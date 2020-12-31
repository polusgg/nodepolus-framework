import { BaseInnerShipStatus, InternalSystemType } from "../protocol/entities/baseShipStatus";
import { EndGamePacket, GameDataPacket, StartGamePacket } from "../protocol/packets/root";
import { EntitySkeldAprilShipStatus } from "../protocol/entities/skeldAprilShipStatus";
import { EntityPlayer, InnerPlayerControl } from "../protocol/entities/player";
import { EntityPolusShipStatus } from "../protocol/entities/polusShipStatus";
import { EntitySkeldShipStatus } from "../protocol/entities/skeldShipStatus";
import { EntityLobbyBehaviour } from "../protocol/entities/lobbyBehaviour";
import { EntityMiraShipStatus } from "../protocol/entities/miraShipStatus";
import { EntityAirshipStatus } from "../protocol/entities/airshipStatus";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { shuffleArrayClone, shuffleArray } from "../util/shuffle";
import { VoteState } from "../protocol/entities/meetingHud/types";
import { PlayerData } from "../protocol/entities/gameData/types";
import { DisconnectReason, LevelTask, Vector2 } from "../types";
import { EntityGameData } from "../protocol/entities/gameData";
import { Connection } from "../protocol/connection";
import { HostInstance } from "../api/host";
import { InternalPlayer } from "../player";
import { InternalLobby } from "../lobby";
import { Tasks } from "../static";
import {
  NormalCommunicationsAmount,
  MiraCommunicationsAmount,
  DecontaminationAmount,
  ElectricalAmount,
  PolusDoorsAmount,
  SabotageAmount,
  SecurityAmount,
  ReactorAmount,
  MedbayAmount,
  OxygenAmount,
  RepairAmount,
} from "../protocol/packets/rpc/repairSystem/amounts";
import {
  DeconSystem,
  DeconTwoSystem,
  DoorsSystem,
  HqHudSystem,
  HudOverrideSystem,
  LaboratorySystem,
  LifeSuppSystem,
  MedScanSystem,
  MovingPlatformSystem,
  ReactorSystem,
  SabotageSystem,
  SecurityCameraSystem,
  SwitchSystem,
} from "../protocol/entities/baseShipStatus/systems";
import {
  AutoDoorsHandler,
  DecontaminationHandler,
  DoorsHandler,
  SabotageSystemHandler,
  SystemsHandler,
} from "./systemHandlers";
import {
  FakeClientId,
  GameOverReason,
  GameState,
  Level,
  LimboState,
  PlayerColor,
  SystemType,
  TaskLength,
  TaskType,
} from "../types/enums";

export class InternalHost implements HostInstance {
  public readyPlayerList: number[] = [];
  public playersInScene: Map<number, string> = new Map();

  private readonly id: number = FakeClientId.ServerAsHost;

  private netIdIndex = 1;
  private counterSequenceId = 0;
  private countdownInterval: NodeJS.Timeout | undefined;
  private meetingHudTimeout: NodeJS.Timeout | undefined;
  private systemsHandler?: SystemsHandler;
  private sabotageHandler?: SabotageSystemHandler;
  private doorHandler?: DoorsHandler | AutoDoorsHandler;
  private decontaminationHandlers: DecontaminationHandler[] = [];

  constructor(
    public lobby: InternalLobby,
  ) {}

  getId(): number {
    return this.id;
  }

  getNextNetId(): number {
    return this.netIdIndex++;
  }

  handleReady(sender: Connection): void {
    this.readyPlayerList.push(sender.id);

    /**
     * TODO:
     * Add disconnection logic to timeout players who take too long to be ready.
     * This **SHOULD NOT** be allowed because literally anybody who can read
     * could browse the source or check sus.wiki to figure this out and lock up
     * an entire server if they really wanted to.
     */

    const connections = this.lobby.getConnections();

    if (this.readyPlayerList.length == connections.length) {
      const lobbyBehaviour = this.lobby.getLobbyBehaviour();

      if (lobbyBehaviour) {
        this.lobby.despawn(lobbyBehaviour.lobbyBehaviour);
      }

      switch (this.lobby.options.levels[0]) {
        case Level.TheSkeld:
          this.lobby.setShipStatus(new EntitySkeldShipStatus(this.lobby, this.getNextNetId()));
          break;
        case Level.AprilSkeld:
          this.lobby.setShipStatus(new EntitySkeldAprilShipStatus(this.lobby, this.getNextNetId()));
          break;
        case Level.MiraHq:
          this.lobby.setShipStatus(new EntityMiraShipStatus(this.lobby, this.getNextNetId()));
          break;
        case Level.Polus:
          this.lobby.setShipStatus(new EntityPolusShipStatus(this.lobby, this.getNextNetId()));
          break;
        case Level.Airship:
          this.lobby.setShipStatus(new EntityAirshipStatus(this.lobby, this.getNextNetId()));
          break;
      }

      this.systemsHandler = new SystemsHandler(this);
      this.sabotageHandler = new SabotageSystemHandler(this);

      switch (this.lobby.options.levels[0]) {
        case Level.TheSkeld:
          this.decontaminationHandlers = [];
          this.doorHandler = new AutoDoorsHandler(this, this.lobby.getShipStatus()!.getShipStatus());
          break;
        case Level.AprilSkeld:
          this.decontaminationHandlers = [];
          this.doorHandler = new AutoDoorsHandler(this, this.lobby.getShipStatus()!.getShipStatus());
          break;
        case Level.MiraHq:
          this.decontaminationHandlers = [
            new DecontaminationHandler(this, this.lobby.getShipStatus()!.getShipStatus().systems[InternalSystemType.Decon] as unknown as DeconSystem),
          ];
          break;
        case Level.Polus:
          this.decontaminationHandlers = [
            new DecontaminationHandler(this, this.lobby.getShipStatus()!.getShipStatus().systems[InternalSystemType.Decon] as unknown as DeconSystem),
            new DecontaminationHandler(this, this.lobby.getShipStatus()!.getShipStatus().systems[InternalSystemType.Decon2] as unknown as DeconTwoSystem),
          ];
          this.doorHandler = new DoorsHandler(this, this.lobby.getShipStatus()!.getShipStatus());
          break;
        case Level.Airship:
          this.decontaminationHandlers = [];
          this.doorHandler = new DoorsHandler(this, this.lobby.getShipStatus()!.getShipStatus());
          break;
      }

      if (!this.lobby.getGameData()) {
        throw new Error("Attempted to start game without a GameData instance");
      }

      this.lobby.sendRootGamePacket(new GameDataPacket([this.lobby.getShipStatus()!.serializeSpawn()], this.lobby.getCode()));

      this.setInfected(this.lobby.options.impostorCount);

      // TODO: Uncomment when removing the for loop below
      // this.setTasks();

      // TODO: Remove -- debug task list for medbay scan on all 3 maps
      for (let i = 0; i < this.lobby.getPlayers().length; i++) {
        this.lobby.getGameData()!.gameData.setTasks(this.lobby.getPlayers()[i].id, [25, 4, 2], connections);
      }

      this.lobby.getGameData()!.gameData.updateGameData(this.lobby.getGameData()!.gameData.players, connections);

      this.lobby.setGameState(GameState.Started);
    }
  }

  async handleSceneChange(sender: Connection, sceneName: string): Promise<void> {
    this.stopCountdown();

    if (sceneName !== "OnlineGame") {
      return;
    }

    if (this.playersInScene.get(sender.id)) {
      throw new Error("Sender has already changed scene");
    }

    const newPlayerId = this.getNextPlayerId();

    if (newPlayerId == -1) {
      sender.sendLateRejection(DisconnectReason.gameFull());
    }

    this.playersInScene.set(sender.id, sceneName);

    let lobbyBehaviour = this.lobby.getLobbyBehaviour();

    if (!lobbyBehaviour) {
      lobbyBehaviour = new EntityLobbyBehaviour(this.lobby, this.getNextNetId());

      this.lobby.setLobbyBehaviour(lobbyBehaviour);
    }

    sender.write(new GameDataPacket([lobbyBehaviour.serializeSpawn()], this.lobby.getCode()));

    let gameData = this.lobby.getGameData();

    if (!gameData) {
      gameData = new EntityGameData(this.lobby, this.getNextNetId(), [], this.getNextNetId());

      this.lobby.setGameData(gameData);
    }

    sender.write(new GameDataPacket([gameData.serializeSpawn()], this.lobby.getCode()));

    const entity = new EntityPlayer(
      this.lobby,
      sender.id,
      this.getNextNetId(),
      newPlayerId,
      this.getNextNetId(),
      this.getNextNetId(),
      5,
      new Vector2(0, 0),
      new Vector2(0, 0),
    );

    const player = new InternalPlayer(this.lobby, entity);

    for (let i = 0; i < this.lobby.getPlayers().length; i++) {
      sender.write(new GameDataPacket([this.lobby.getPlayers()[i].gameObject.serializeSpawn()], this.lobby.getCode()));
    }

    this.lobby.addPlayer(player);

    await this.lobby.sendRootGamePacket(new GameDataPacket([player.gameObject.serializeSpawn()], this.lobby.getCode()));

    player.gameObject.playerControl.syncSettings(this.lobby.options, [sender]);

    this.confirmPlayerData(sender, player);

    player.gameObject.playerControl.isNew = false;

    sender.flush(true);

    gameData.gameData.updateGameData(gameData.gameData.players, this.lobby.getConnections());
  }

  handleCheckName(sender: InnerPlayerControl, name: string): void {
    let checkName: string = name;
    let index = 1;

    const owner = this.lobby.findConnection(sender.parent.owner);

    if (!owner) {
      throw new Error("Received CheckName from an InnerPlayerControl without an owner");
    }

    const player = this.lobby.findPlayerByInnerNetObject(sender);

    if (player) {
      this.confirmPlayerData(owner, player);
    } else {
      // TODO:
      throw new Error(`Failed to confirm playerData for sender: ${sender.parent.owner}.`);
    }

    while (this.isNameTaken(checkName)) {
      checkName = `${name} ${index++}`;
    }

    sender.setName(checkName, this.lobby.getConnections());

    this.lobby.finishedSpawningPlayer(owner);

    if (!this.lobby.isSpawningPlayers()) {
      this.lobby.reapplyActingHosts();
    }
  }

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void {
    const takenColors = this.getTakenColors();
    let setColor: PlayerColor = color;

    const owner = this.lobby.findConnection(sender.parent.owner);

    if (!owner) {
      throw new Error("Received CheckColor from an InnerPlayerControl without an owner");
    }

    this.confirmPlayerData(owner, new InternalPlayer(this.lobby, sender.parent));

    if (this.lobby.getPlayers().length <= 12) {
      while (takenColors.indexOf(setColor) != -1) {
        for (let i = 0; i < 12; i++) {
          if (takenColors.indexOf(i) == -1) {
            setColor = i;
          }
        }
      }
    } else {
      setColor = PlayerColor.ForteGreen;
    }

    sender.setColor(setColor, this.lobby.getConnections());
  }

  handleCompleteTask(sender: InnerPlayerControl, taskIndex: number): void {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("Received CompleteTask without a GameData instance");
    }

    const playerIndex = gameData.gameData.players.findIndex(playerData => playerData.id == sender.playerId);

    if (playerIndex == -1) {
      throw new Error("Received CompleteTask from a connection without an InnerPlayerControl instance");
    }

    gameData.gameData.players[playerIndex].completeTask(taskIndex);

    const crewmates = gameData.gameData.players.filter(playerData => !playerData.isImpostor);

    if (crewmates.every(crewmate => crewmate.isDoneWithTasks())) {
      this.endGame(GameOverReason.CrewmatesByTask);
    }
  }

  handleMurderPlayer(_sender: InnerPlayerControl, _victimPlayerControlNetId: number): void {
    if (this.shouldEndGame()) {
      this.endGame(GameOverReason.ImpostorsByKill);
    }
  }

  handleImpostorDeath(): void {
    if (this.shouldEndGame()) {
      this.endGame(GameOverReason.CrewmatesByVote);
    }
  }

  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): void {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("Received ReportDeadBody without a GameData instance");
    }

    sender.startMeeting(victimPlayerId, this.lobby.getConnections());

    const meetingHud = new EntityMeetingHud(this.lobby, this.getNextNetId());

    this.lobby.setMeetingHud(meetingHud);

    meetingHud.meetingHud.playerStates = Array(gameData.gameData.players.length);

    for (let i = 0; i < gameData.gameData.players.length; i++) {
      const player = gameData.gameData.players[i];

      meetingHud!.meetingHud.playerStates[player.id] = new VoteState(
        player!.id == sender.playerId,
        false,
        player.isDead || player.isDisconnected,
        -1,
      );
    }

    this.lobby.sendRootGamePacket(new GameDataPacket([
      meetingHud.serializeSpawn(),
    ], this.lobby.getCode()));

    this.meetingHudTimeout = setTimeout(this.endMeeting, (this.lobby.options.votingTime + this.lobby.options.discussionTime) * 1000);
  }

  handleCastVote(votingPlayerId: number, suspectPlayerId: number): void {
    const meetingHud = this.lobby.getMeetingHud();

    if (!meetingHud) {
      throw new Error("Received CastVote without a MeetingHud instance");
    }

    const oldMeetingHud = meetingHud.meetingHud.clone();

    meetingHud.meetingHud.playerStates[votingPlayerId].votedFor = suspectPlayerId;
    meetingHud.meetingHud.playerStates[votingPlayerId].didVote = true;

    this.lobby.sendRootGamePacket(new GameDataPacket([
      meetingHud.meetingHud.data(oldMeetingHud),
    ], this.lobby.getCode()));

    if (this.meetingHudTimeout && meetingHud.meetingHud.playerStates.every(p => p.didVote || p.isDead)) {
      this.endMeeting();
      clearInterval(this.meetingHudTimeout);
    }
  }

  handleRepairSystem(_sender: BaseInnerShipStatus, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void {
    const shipStatus = this.lobby.getShipStatus();

    if (!shipStatus) {
      throw new Error("Received RepairSystem without a ShipStatus instance");
    }

    const system = shipStatus.getShipStatus().getSystemFromType(systemId);
    const player = this.lobby.getPlayers().find(thePlayer => thePlayer.gameObject.playerControl.netId == playerControlNetId);
    const level = this.lobby.options.levels[0];

    if (!player) {
      throw new Error(`Received RepairSystem from a non-player InnerNetObject: ${playerControlNetId}`);
    }

    switch (system.type) {
      case SystemType.Electrical:
        this.systemsHandler!.repairSwitch(player, system as unknown as SwitchSystem, amount as ElectricalAmount);
        break;
      case SystemType.Medbay:
        this.systemsHandler!.repairMedbay(player, system as unknown as MedScanSystem, amount as MedbayAmount);
        break;
      case SystemType.Oxygen:
        this.systemsHandler!.repairOxygen(player, system as unknown as LifeSuppSystem, amount as OxygenAmount);
        break;
      case SystemType.Reactor:
        this.systemsHandler!.repairReactor(player, system as unknown as ReactorSystem, amount as ReactorAmount);
        break;
      case SystemType.Laboratory:
        this.systemsHandler!.repairReactor(player, system as unknown as LaboratorySystem, amount as ReactorAmount);
        break;
      case SystemType.Security:
        this.systemsHandler!.repairSecurity(player, system as SecurityCameraSystem, amount as SecurityAmount);
        break;
      case SystemType.Doors:
        if (level == Level.Polus) {
          this.systemsHandler!.repairPolusDoors(player, system as unknown as DoorsSystem, amount as PolusDoorsAmount);
        } else {
          throw new Error(`Received RepairSystem for Doors on an unimplemented level: ${level as Level} (${Level[level]})`);
        }
        break;
      case SystemType.Communications:
        if (level == Level.MiraHq) {
          this.systemsHandler!.repairHqHud(player, system as unknown as HqHudSystem, amount as MiraCommunicationsAmount);
        } else {
          this.systemsHandler!.repairHudOverride(player, system as unknown as HudOverrideSystem, amount as NormalCommunicationsAmount);
        }
        break;
      case SystemType.Decontamination:
        this.systemsHandler!.repairDecon(player, system as unknown as DeconSystem, amount as DecontaminationAmount);
        break;
      case SystemType.Decontamination2:
        this.systemsHandler!.repairDecon(player, system as unknown as DeconTwoSystem, amount as DecontaminationAmount);
        break;
      case SystemType.Sabotage:
        this.systemsHandler!.repairSabotage(player, system as unknown as SabotageSystem, amount as SabotageAmount);
        break;
      default:
        throw new Error(`Received RepairSystem packet for an unimplemented SystemType: ${system.type} (${SystemType[system.type]})`);
    }
  }

  handleCloseDoorsOfType(_sender: BaseInnerShipStatus, systemId: SystemType): void {
    if (!this.doorHandler) {
      throw new Error("Received CloseDoorsOfType without a door handler");
    }

    this.doorHandler.closeDoor(this.doorHandler.getDoorsForSystem(systemId));
    this.doorHandler.setSystemTimeout(systemId, 30);
  }

  handleSetStartCounter(sequenceId: number, timeRemaining: number): void {
    // TODO: This breaks the logic of stopping the counter when someone joins or leaves
    if (timeRemaining == -1) {
      return;
    }

    if (this.counterSequenceId < sequenceId && this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    if (timeRemaining == 5 && this.counterSequenceId != sequenceId) {
      this.lobby.removeActingHosts(true);
      // TODO: Config option
      this.startCountdown(5);
    }
  }

  handleDisconnect(connection: Connection): void {
    const gameState = this.lobby.getGameState();
    const gameData = this.lobby.getGameData();

    if (gameState == GameState.NotStarted) {
      this.stopCountdown();
    }

    if (!gameData) {
      if (gameState == GameState.NotStarted || gameState == GameState.Started) {
        throw new Error("Received Disconnect without a GameData instance");
      }

      return;
    }

    const player = this.lobby.findPlayerByConnection(connection);

    if (!player) {
      console.warn("Received disconnect from connection without a player");

      return;
    }

    const playerIndex = gameData.gameData.players.findIndex(playerData => playerData.id == player.id);
    const playerData = gameData.gameData.players[playerIndex];

    if (gameState == GameState.Started) {
      playerData.isDisconnected = true;
    } else {
      gameData.gameData.players.splice(playerIndex, 1);
    }

    gameData.gameData.updateGameData(gameData.gameData.players, this.lobby.getConnections());

    if (this.shouldEndGame()) {
      if (playerData.isImpostor) {
        this.endGame(GameOverReason.ImpostorDisconnect);
      } else {
        this.endGame(GameOverReason.CrewmateDisconnect);
      }
    }
  }

  handleUsePlatform(sender: InnerPlayerControl): void {
    const shipStatus = this.lobby.getShipStatus();

    if (!shipStatus) {
      throw new Error("Received UsePlatform without a ShipStatus instance");
    }

    const oldData = shipStatus.getShipStatus().clone();
    const movingPlatform = shipStatus.getShipStatus().systems[InternalSystemType.MovingPlatform] as unknown as MovingPlatformSystem;

    movingPlatform.innerPlayerControlNetId = sender.parent.playerControl.netId;
    movingPlatform.side = (movingPlatform.side + 1) % 2;

    movingPlatform.sequenceId++;

    const data = shipStatus.getShipStatus().getData(oldData);

    this.lobby.sendRootGamePacket(new GameDataPacket([data], this.lobby.getCode()));
  }

  startCountdown(count: number): void {
    let currentCount = count;
    const countdownFunction = (): void => {
      const time = currentCount--;

      this.lobby.getPlayers()[0].gameObject.playerControl.setStartCounter(this.counterSequenceId += 5, time, this.lobby.getConnections());

      if (time <= 0) {
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }

        this.startGame();
      }
    };

    countdownFunction();

    this.countdownInterval = setInterval(countdownFunction, 1000);
  }

  stopCountdown(): void {
    if (this.lobby.getPlayers().length > 0) {
      this.lobby.getPlayers()[0].gameObject.playerControl.setStartCounter(this.counterSequenceId += 5, -1, this.lobby.getConnections());
    }

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startGame(): void {
    this.lobby.sendRootGamePacket(new StartGamePacket(this.lobby.getCode()));
  }

  setInfected(infectedCount: number): void {
    const shuffledPlayers = shuffleArrayClone(this.lobby.getPlayers());
    const impostors = new Array(infectedCount);

    for (let i = 0; i < infectedCount; i++) {
      impostors[i] = shuffledPlayers[i].id;
    }

    this.lobby.getPlayers()[0].gameObject.playerControl.setInfected(impostors, this.lobby.getConnections());
  }

  setTasks(): void {
    const options = this.lobby.options;
    const level = options.levels[0];
    const numCommon = options.commonTaskCount;
    const numLong = options.longTaskCount;
    // Minimum of 1 short task
    const numShort = numCommon + numLong + options.shortTaskCount > 0 ? options.shortTaskCount : 1;

    let allTasks: readonly LevelTask[];

    switch (level) {
      case Level.TheSkeld:
        allTasks = Tasks.skeld;
        break;
      case Level.MiraHq:
        allTasks = Tasks.miraHq;
        break;
      case Level.Polus:
        allTasks = Tasks.polus;
        break;
      case Level.Airship:
        allTasks = Tasks.airship;
        break;
      default:
        throw new Error(`Attempted to set tasks for an unimplemented level: ${level as Level} (${Level[level]})`);
    }

    const allCommon: LevelTask[] = [];
    const allShort: LevelTask[] = [];
    const allLong: LevelTask[] = [];

    for (let i = 0; i < allTasks.length; i++) {
      const task = allTasks[i];

      switch (task.length) {
        case TaskLength.Common:
          allCommon.push(task);
          break;
        case TaskLength.Short:
          allShort.push(task);
          break;
        case TaskLength.Long:
          allLong.push(task);
          break;
      }
    }

    // Used to store the currently assigned tasks to try to prevent
    // players from having the exact same tasks
    const used: Set<TaskType> = new Set();
    // The array of tasks for the player
    const tasks: LevelTask[] = [];

    // Add common tasks
    this.addTasksFromList({ val: 0 }, numCommon, tasks, used, allCommon);

    for (let i = 0; i < numCommon; i++) {
      if (allCommon.length == 0) {
        // Not enough common tasks
        break;
      }

      const index = Math.floor(Math.random() * allCommon.length);

      tasks.push(allCommon[index]);
      allCommon.splice(index, 1);
    }

    // Indices used to act as a read head for short and long tasks
    // to try to prevent players from having the exact same tasks
    const shortIndex = { val: 0 };
    const longIndex = { val: 0 };

    for (let pid = 0; pid < this.lobby.getPlayers().length; pid++) {
      // Clear the used task array
      used.clear();

      // Remove every non-common task (effectively reusing the same array)
      tasks.splice(numCommon, tasks.length - numCommon);

      // Add long tasks
      this.addTasksFromList(longIndex, numLong, tasks, used, allLong);

      // Add short tasks
      this.addTasksFromList(shortIndex, numShort, tasks, used, allShort);

      const player = this.lobby.getPlayers().find(pl => pl.id == pid);

      if (player) {
        const gameData = this.lobby.getGameData();

        if (!gameData) {
          throw new Error("Attempted to set tasks without a GameData instance");
        }

        gameData.gameData.setTasks(player.id, tasks.map(task => task.id), this.lobby.getConnections());
      }
    }
  }

  endMeeting(): void {
    const gameData = this.lobby.getGameData();
    const meetingHud = this.lobby.getMeetingHud();

    if (!meetingHud) {
      throw new Error("Attempted to end a meeting without a MeetingHud instance");
    }

    if (!gameData) {
      throw new Error("Attempted to end a meeting without a GameData instance");
    }

    const oldData = meetingHud.meetingHud.clone();
    const votes: Map<number, number[]> = new Map();

    for (let i = 0; i < gameData.gameData.players.length; i++) {
      const player = gameData.gameData.players[i];
      const state = meetingHud!.meetingHud.playerStates[player.id];

      if (!votes.has(state.votedFor)) {
        votes.set(state.votedFor, []);
      }

      votes.get(state.votedFor)!.push(player.id);
    }

    const voteCounts = [...votes.values()].map(playersVotedFor => playersVotedFor.length);
    const largestVoteCount = Math.max(...voteCounts);
    const allLargestVotes = [...votes.entries()].filter(entry => entry[1].length == largestVoteCount);

    if (allLargestVotes.length == 1 && allLargestVotes[0][0] != -1) {
      meetingHud.meetingHud.votingComplete(meetingHud.meetingHud.playerStates, true, allLargestVotes[0][0], false, this.lobby.getConnections());
    } else {
      meetingHud.meetingHud.votingComplete(meetingHud.meetingHud.playerStates, false, 255, true, this.lobby.getConnections());
    }

    const exiledPlayer = gameData.gameData.players.find(playerData => playerData.id == allLargestVotes[0][0]);

    if (allLargestVotes[0][0] != -1 && allLargestVotes.length == 1) {
      if (!exiledPlayer) {
        throw new Error("Exiled player has no data stored in GameData instance");
      }

      exiledPlayer.isDead = true;
    }

    this.lobby.sendRootGamePacket(new GameDataPacket([
      meetingHud.meetingHud.data(oldData),
    ], this.lobby.getCode()));

    setTimeout(() => {
      meetingHud.meetingHud.close(this.lobby.getConnections());

      this.lobby.deleteMeetingHud();

      setTimeout(() => {
        if (this.shouldEndGame()) {
          if (exiledPlayer!.isImpostor) {
            this.endGame(GameOverReason.CrewmatesByVote);
          } else {
            this.endGame(GameOverReason.ImpostorsByVote);
          }
        }
      // This timing of 8.5 seconds is based on in-game observations and may be
      // slightly inaccurate due to network latency and fluctuating framerates
      }, 8500);
    }, 5000);
  }

  endGame(reason: GameOverReason): void {
    this.lobby.setGameState(GameState.NotStarted);
    this.decontaminationHandlers = [];
    this.readyPlayerList = [];
    this.lobby.clearPlayers();

    this.playersInScene.clear();

    for (let i = 0; i < this.lobby.getConnections().length; i++) {
      this.lobby.getConnections()[i].limboState = LimboState.PreSpawn;
    }

    this.lobby.deleteLobbyBehaviour();
    this.lobby.deleteShipStatus();
    this.lobby.deleteMeetingHud();
    delete this.doorHandler;
    delete this.sabotageHandler;
    delete this.systemsHandler;

    this.lobby.setGameData(new EntityGameData(this.lobby, this.getNextNetId(), [], this.getNextNetId()));

    this.lobby.sendRootGamePacket(new EndGamePacket(this.lobby.getCode(), reason, false));
  }

  getSystemsHandler(): SystemsHandler | undefined {
    return this.systemsHandler;
  }

  getSabotageHandler(): SabotageSystemHandler | undefined {
    return this.sabotageHandler;
  }

  getDoorHandler(): DoorsHandler | AutoDoorsHandler | undefined {
    return this.doorHandler;
  }

  getDecontaminationHandlers(): DecontaminationHandler[] {
    return this.decontaminationHandlers;
  }

  private getNextPlayerId(): number {
    const taken = this.lobby.getPlayers().map(player => player.id);

    for (let i = 0; i < 125; i++) {
      if (taken.indexOf(i) == -1) {
        return i;
      }
    }

    return -1;
  }

  private addTasksFromList(
    start: { val: number },
    count: number,
    tasks: LevelTask[],
    usedTaskTypes: Set<TaskType>,
    unusedTasks: LevelTask[],
  ): void {
    // A separate counter to prevent the following loop from running forever
    let sanityCheck = 0;

    for (let i = 0; i < count; i++) {
      if (sanityCheck++ >= 1000) {
        // Stop after 1000 tries
        break;
      }

      // If we are trying to get another task that
      // exceeds the number of available tasks
      if (start.val >= unusedTasks.length) {
        // Start back at the beginning...
        start.val = 0;

        // ...and reshuffle the available tasks
        shuffleArray(unusedTasks);

        // If the player already has every single task...
        // if (unusedTasks.every(task => usedTaskTypes.indexOf(task.type) != -1)) {
        if (unusedTasks.every(task => usedTaskTypes.has(task.type))) {
          // ...then clear the used task array so they can have duplicates
          usedTaskTypes.clear();
        }
      }

      // Get the task
      const task: LevelTask | undefined = start.val >= unusedTasks.length ? undefined : unusedTasks[start.val++];

      if (!task) {
        continue;
      }

      // If it is already assigned...
      if (usedTaskTypes.has(task.type)) {
        // ...then go back one
        i--;
      } else {
        // ...otherwise add it to the player's tasks
        usedTaskTypes.add(task.type);
        tasks.push(task);
      }
    }
  }

  private shouldEndGame(): boolean {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("shouldEndGame called without a GameData instance");
    }

    if (this.lobby.getGameState() == GameState.NotStarted) {
      return false;
    }

    const aliveImpostors: PlayerData[] = [];
    const aliveCrewmates: PlayerData[] = [];

    for (let i = 0; i < gameData.gameData.players.length; i++) {
      const playerData = gameData.gameData.players[i];

      if (playerData.isDead || playerData.isDisconnected) {
        continue;
      }

      if (playerData.isImpostor) {
        aliveImpostors.push(playerData);
      } else {
        aliveCrewmates.push(playerData);
      }
    }

    return (aliveImpostors.length >= aliveCrewmates.length) || aliveImpostors.length == 0;
  }

  private isNameTaken(name: string): boolean {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("isNameTaken called without a GameData instance");
    }

    return !!gameData.gameData.players.find(player => player.name == name);
  }

  private getTakenColors(): PlayerColor[] {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("getTakenColors called without a GameData instance");
    }

    return gameData.gameData.players.map(player => player.color);
  }

  private confirmPlayerData(connection: Connection, player: InternalPlayer): void {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("confirmPlayerData called without a GameData instance");
    }

    if (!gameData.gameData.players.some(p => p.id == player.gameObject.playerControl.playerId)) {
      const playerData = new PlayerData(
        player.gameObject.playerControl.playerId,
        "",
        PlayerColor.Red,
        0,
        0,
        0,
        false,
        false,
        false,
        [],
      );

      gameData.gameData.updateGameData([playerData], this.lobby.getConnections());
    }
  }
}
