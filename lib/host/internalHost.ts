import { BaseInnerShipStatus, InternalSystemType } from "../protocol/entities/baseShipStatus";
import { LobbyCountdownStartedEvent, LobbyCountdownStoppedEvent } from "../api/events/lobby";
import { EndGamePacket, GameDataPacket, StartGamePacket } from "../protocol/packets/root";
import { EntitySkeldAprilShipStatus } from "../protocol/entities/skeldAprilShipStatus";
import { EntityPlayer, InnerPlayerControl } from "../protocol/entities/player";
import { EntityPolusShipStatus } from "../protocol/entities/polusShipStatus";
import { EntitySkeldShipStatus } from "../protocol/entities/skeldShipStatus";
import { DisconnectReason, LevelTask, Vector2, VoteResult } from "../types";
import { EntityLobbyBehaviour } from "../protocol/entities/lobbyBehaviour";
import { EntityMiraShipStatus } from "../protocol/entities/miraShipStatus";
import { EntityAirshipStatus } from "../protocol/entities/airshipStatus";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { shuffleArrayClone, shuffleArray } from "../util/shuffle";
import { VoteState } from "../protocol/entities/meetingHud/types";
import { PlayerData } from "../protocol/entities/gameData/types";
import { EntityGameData } from "../protocol/entities/gameData";
import { Connection } from "../protocol/connection";
import { PlayerInstance } from "../api/player";
import { HostInstance } from "../api/host";
import { InternalPlayer } from "../player";
import { InternalLobby } from "../lobby";
import { Game } from "../api/game";
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
  ClearVotePacket,
  ClosePacket,
  SetInfectedPacket,
  SetStartCounterPacket,
  StartMeetingPacket,
  VotingCompletePacket,
} from "../protocol/packets/rpc";
import {
  MeetingClosedEvent,
  MeetingConcludedEvent,
  MeetingEndedEvent,
  MeetingStartedEvent,
  MeetingVoteAddedEvent,
} from "../api/events/meeting";
import {
  PlayerExiledEvent,
  PlayerRoleUpdatedEvent,
  PlayerSpawnedEvent,
  PlayerTaskAddedEvent,
} from "../api/events/player";
import {
  GameEndedEvent,
  GameStartedEvent,
  GameStartingEvent,
} from "../api/events/game";
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
  PlayerRole,
  SystemType,
  TaskLength,
  TaskType,
} from "../types/enums";

export class InternalHost implements HostInstance {
  private readonly id: number = FakeClientId.ServerAsHost;
  private readonly playersInScene: Map<number, string> = new Map();

  private readyPlayerList: number[] = [];
  private netIdIndex = 1;
  private counterSequenceId = 0;
  private secondsUntilStart = -1;
  private countdownInterval: NodeJS.Timeout | undefined;
  private meetingHudTimeout: NodeJS.Timeout | undefined;
  private systemsHandler?: SystemsHandler;
  private sabotageHandler?: SabotageSystemHandler;
  private doorHandler?: DoorsHandler | AutoDoorsHandler;
  private decontaminationHandlers: DecontaminationHandler[] = [];

  /**
   * @param lobby The lobby being controlled by the host
   */
  constructor(
    private readonly lobby: InternalLobby,
  ) {}

  getLobby(): InternalLobby {
    return this.lobby;
  }

  getId(): number {
    return this.id;
  }

  getNextNetId(): number {
    return this.netIdIndex++;
  }

  getNextPlayerId(): number {
    const taken = this.lobby.getPlayers().map(player => player.getId());

    for (let i = 0; i < 127; i++) {
      if (taken.indexOf(i) == -1) {
        return i;
      }
    }

    return -1;
  }

  async startCountdown(count: number, starter?: PlayerInstance): Promise<void> {
    const event = new LobbyCountdownStartedEvent(this.lobby, count, starter);

    await this.lobby.getServer().emit("lobby.countdown.started", event);

    if (event.isCancelled()) {
      return;
    }

    this.secondsUntilStart = event.getSecondsUntilStart();

    const countdownFunction = (): void => {
      const time = this.secondsUntilStart--;

      if (this.lobby.getPlayers().length) {
        this.lobby.getPlayers()[0].entity.playerControl.sendRPCPacketTo(
          this.lobby.getConnections(),
          new SetStartCounterPacket(this.counterSequenceId += 5, time),
        );
      }

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

  async stopCountdown(): Promise<void> {
    const event = new LobbyCountdownStoppedEvent(this.lobby, this.secondsUntilStart);

    await this.lobby.getServer().emit("lobby.countdown.stopped", event);

    if (event.isCancelled()) {
      return;
    }

    this.secondsUntilStart = -1;

    if (this.lobby.getPlayers().length > 0) {
      this.lobby.getPlayers()[0].entity.playerControl.sendRPCPacketTo(
        this.lobby.getConnections(),
        new SetStartCounterPacket(this.counterSequenceId += 5, -1),
      );
    }

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  async startGame(): Promise<void> {
    this.lobby.setGame(new Game(this.lobby));

    const event = new GameStartingEvent(this.lobby.getGame()!);

    await this.lobby.getServer().emit("game.starting", event);

    if (event.isCancelled()) {
      this.lobby.setGame();

      return;
    }

    this.lobby.sendRootGamePacket(new StartGamePacket(this.lobby.getCode()));
  }

  async setInfected(infectedCount: number): Promise<void> {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
    }

    const players = this.lobby.getPlayers();

    infectedCount = Math.min(infectedCount, Math.max(0, Math.floor(players.length / 2) - 1));

    let impostors = shuffleArrayClone(players)
      .slice(0, infectedCount)
      .map(player => player);
    const selectedIds = impostors.map(player => player.getId());
    const promises = (await Promise.all(players.map(async player => {
      const event = new PlayerRoleUpdatedEvent(player, selectedIds.includes(player.getId()) ? PlayerRole.Impostor : PlayerRole.Crewmate);

      await this.lobby.getServer().emit("player.role.updated", event);

      return event;
    })));

    for (let i = 0; i < promises.length; i++) {
      const event = promises[i];

      if (event.isCancelled() || event.getNewRole() == PlayerRole.Crewmate) {
        const index = impostors.findIndex(impostor => impostor.getId() == event.getPlayer().getId());

        if (index > -1) {
          impostors.splice(index, 1);
        }
      } else if (event.getNewRole() == PlayerRole.Impostor) {
        if (impostors.findIndex(impostor => impostor.getId() == event.getPlayer().getId()) == -1) {
          impostors.push(event.getPlayer() as InternalPlayer);
        }
      }
    }

    const event = new GameStartedEvent(this.lobby.getGame()!, impostors);

    await this.lobby.getServer().emit("game.started", event);

    impostors = event.getImpostors() as InternalPlayer[];

    for (let i = 0; i < impostors.length; i++) {
      const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == impostors[i].getId());

      if (gameDataPlayerIndex == -1) {
        throw new Error(`Player ${impostors[i].getId()} does not have a PlayerData instance o the GameData instance`);
      }

      gameData.gameData.players[gameDataPlayerIndex].isImpostor = true;
      impostors[i].setRole(PlayerRole.Impostor);
    }

    this.lobby.getPlayers()[0].entity.playerControl.sendRPCPacketTo(
      this.lobby.getConnections(),
      new SetInfectedPacket(impostors.map(player => player.getId())),
    );
  }

  setTasks(): void {
    /**
     * This implementation is ported directly from Among Us to be as close to
     * the original as possible.
     */
    const options = this.lobby.getOptions();
    const level = options.levels[0];
    const numCommon = options.commonTaskCount;
    const numLong = options.longTaskCount;
    // Minimum of 1 short task
    const numShort = numCommon + numLong + options.shortTaskCount > 0 ? options.shortTaskCount : 1;
    const allTasks = Tasks.forLevel(level);
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

      const player = this.lobby.getPlayers().find(pl => pl.getId() == pid);

      if (player) {
        this.setPlayerTasks(player, tasks);
      }
    }
  }

  async setPlayerTasks(player: PlayerInstance, tasks: LevelTask[]): Promise<void> {
    const event = new PlayerTaskAddedEvent(player, new Set(tasks));

    await this.lobby.getServer().emit("player.task.added", event);

    if (event.isCancelled()) {
      return;
    }

    this.updatePlayerTasks(player, [...event.getTasks()]);
  }

  async endMeeting(): Promise<void> {
    const gameData = this.lobby.getGameData();
    const meetingHud = this.lobby.getMeetingHud();

    if (!meetingHud) {
      throw new Error("Attempted to end a meeting without a MeetingHud instance");
    }

    if (!gameData) {
      throw new Error("Attempted to end a meeting without a GameData instance");
    }

    const oldData = meetingHud.meetingHud.clone();
    const voteResults: Map<number, VoteResult> = new Map();
    const playerInstanceCache: Map<number, PlayerInstance> = new Map();
    const fetchPlayerById = (playerId: number): PlayerInstance | undefined => {
      if (playerId == -1) {
        return;
      }

      if (playerInstanceCache.has(playerId)) {
        return playerInstanceCache.get(playerId);
      }

      const playerInstance = this.lobby.findPlayerByPlayerId(playerId);

      if (!playerInstance) {
        return;
      }

      playerInstanceCache.set(playerId, playerInstance);

      return playerInstance;
    };

    const players = this.lobby.getPlayers();

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const state = meetingHud!.meetingHud.playerStates[player.getId()];

      if (state.isDead) {
        continue;
      }

      if (!voteResults.has(player.getId())) {
        voteResults.set(player.getId(), new VoteResult(player));
      }

      const vote = voteResults.get(player.getId())!;

      if (state.didVote) {
        const votedFor = fetchPlayerById(state.votedFor);

        if (!votedFor) {
          if (state.votedFor == -1) {
            vote.setSkipping();
          } else {
            voteResults.delete(player.getId());

            continue;
          }
        } else {
          vote.setVotedFor(votedFor);
        }
      }
    }

    const concludedEvent = new MeetingConcludedEvent(this.lobby.getGame()!, [...voteResults.values()]);

    await this.lobby.getServer().emit("meeting.concluded", concludedEvent);

    const isTied = concludedEvent.isTied();
    let exiledPlayer = concludedEvent.getExiledPlayer();

    if (concludedEvent.isCancelled()) {
      return;
    }

    let exiledPlayerData: PlayerData | undefined;

    if (!isTied && exiledPlayer) {
      const voters = [...voteResults.values()]
        .filter(vote => vote.getVotedFor()?.getId() == exiledPlayer?.getId())
        .map(vote => vote.getPlayer());
      const exiledEvent = new PlayerExiledEvent(exiledPlayer, voters);

      await this.lobby.getServer().emit("player.died", exiledEvent);
      await this.lobby.getServer().emit("player.exiled", exiledEvent);

      if (!exiledEvent.isCancelled()) {
        exiledPlayer = exiledEvent.getPlayer();
        exiledPlayerData = gameData.gameData.players.find(playerData => playerData.id == exiledPlayer?.getId());

        if (!exiledPlayerData) {
          throw new Error("Exiled player does not have a PlayerData instance on the GameData instance");
        }

        exiledPlayerData.isDead = true;
      }
    }

    meetingHud.meetingHud.sendRPCPacketTo(this.lobby.getConnections(), new VotingCompletePacket(
      meetingHud.meetingHud.playerStates, isTied ? 0xff : (exiledPlayer?.getId() ?? 0xff), isTied),
    );

    this.lobby.sendRootGamePacket(new GameDataPacket([
      meetingHud.meetingHud.data(oldData),
    ], this.lobby.getCode()));

    setTimeout(async () => {
      const closedEvent = new MeetingClosedEvent(
        this.lobby.getGame()!,
        concludedEvent.getVotes(),
        isTied,
        exiledPlayer,
      );

      await this.lobby.getServer().emit("meeting.closed", closedEvent);

      if (closedEvent.isCancelled()) {
        return;
      }

      meetingHud.meetingHud.sendRPCPacketTo(this.lobby.getConnections(), new ClosePacket());

      this.lobby.deleteMeetingHud();

      setTimeout(() => {
        this.lobby.getServer().emit("meeting.ended", new MeetingEndedEvent(
          this.lobby.getGame()!,
          concludedEvent.getVotes(),
          isTied,
          exiledPlayer,
        ));

        if (this.shouldEndGame()) {
          if (exiledPlayerData!.isImpostor) {
            this.endGame(GameOverReason.CrewmatesByVote);
          } else {
            this.endGame(GameOverReason.ImpostorsByVote);
          }
        }
      // This timing of 8.5 seconds is based on in-game observations and may be
      // slightly inaccurate due to network latency and fluctuating framerates.
      }, 8500);
    }, 5000);
  }

  async endGame(reason: GameOverReason): Promise<void> {
    const event = new GameEndedEvent(this.lobby.getGame()!, reason);

    await this.lobby.getServer().emit("game.ended", event);

    if (event.isCancelled()) {
      return;
    }

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
    this.lobby.sendRootGamePacket(new EndGamePacket(this.lobby.getCode(), event.getReason(), false));
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

    if (this.readyPlayerList.length != connections.length) {
      return;
    }

    const lobbyBehaviour = this.lobby.getLobbyBehaviour();

    if (lobbyBehaviour) {
      this.lobby.despawn(lobbyBehaviour.lobbyBehaviour);
    }

    switch (this.lobby.getLevel()) {
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

    switch (this.lobby.getLevel()) {
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
          new DecontaminationHandler(this, this.lobby.getShipStatus()!.getShipStatus().systems[InternalSystemType.Decon] as DeconSystem),
        ];
        break;
      case Level.Polus:
        this.decontaminationHandlers = [
          new DecontaminationHandler(this, this.lobby.getShipStatus()!.getShipStatus().systems[InternalSystemType.Decon] as DeconSystem),
          new DecontaminationHandler(this, this.lobby.getShipStatus()!.getShipStatus().systems[InternalSystemType.Decon2] as DeconTwoSystem),
        ];
        this.doorHandler = new DoorsHandler(this, this.lobby.getShipStatus()!.getShipStatus());
        break;
      case Level.Airship:
        this.decontaminationHandlers = [];
        this.doorHandler = new DoorsHandler(this, this.lobby.getShipStatus()!.getShipStatus());
        break;
    }

    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("Attempted to start game without a GameData instance");
    }

    this.lobby.sendRootGamePacket(new GameDataPacket([this.lobby.getShipStatus()!.serializeSpawn()], this.lobby.getCode()));
    this.setInfected(this.lobby.getOptions().impostorCount);
    this.setTasks();
    gameData.gameData.updateGameData(gameData.gameData.players, connections);
    this.lobby.setGameState(GameState.Started);
  }

  async handleSceneChange(sender: Connection, sceneName: string): Promise<void> {
    this.stopCountdown();

    if (sceneName !== "OnlineGame") {
      return;
    }

    if (this.playersInScene.has(sender.id)) {
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

    sender.writeReliable(new GameDataPacket([lobbyBehaviour.serializeSpawn()], this.lobby.getCode()));

    let gameData = this.lobby.getGameData();

    if (!gameData) {
      gameData = new EntityGameData(this.lobby, this.getNextNetId(), [], this.getNextNetId());

      this.lobby.setGameData(gameData);
    }

    sender.writeReliable(new GameDataPacket([gameData.serializeSpawn()], this.lobby.getCode()));

    const event = new PlayerSpawnedEvent(sender, this.lobby, newPlayerId, true, new Vector2(0, 0));

    await this.lobby.getServer().emit("player.spawned", event);

    const entity = new EntityPlayer(
      this.lobby,
      sender.id,
      this.getNextNetId(),
      newPlayerId,
      this.getNextNetId(),
      this.getNextNetId(),
      5,
      event.getPosition(),
      new Vector2(0, 0),
    );

    entity.playerControl.isNew = event.isNew();

    const player = new InternalPlayer(this.lobby, entity, sender);

    for (let i = 0; i < this.lobby.getPlayers().length; i++) {
      sender.writeReliable(new GameDataPacket([this.lobby.getPlayers()[i].entity.serializeSpawn()], this.lobby.getCode()));
    }

    this.lobby.addPlayer(player);

    await this.lobby.sendRootGamePacket(new GameDataPacket([player.entity.serializeSpawn()], this.lobby.getCode()));

    player.entity.playerControl.syncSettings(this.lobby.getMutableOptions(), [sender]);

    this.confirmPlayerData(player);

    player.entity.playerControl.isNew = false;

    sender.flush(true);

    gameData.gameData.updateGameData(gameData.gameData.players, this.lobby.getConnections());
  }

  async handleCheckName(sender: InnerPlayerControl, name: string): Promise<void> {
    let checkName: string = name;
    let index = 1;

    const owner = this.lobby.findConnection(sender.parent.owner);

    if (!owner) {
      throw new Error("Received CheckName from an InnerPlayerControl without an owner");
    }

    const player = this.lobby.findPlayerByConnection(owner);

    if (player) {
      this.confirmPlayerData(player);
    } else {
      throw new Error(`Client ${sender.parent.owner} does not have a PlayerInstance on the lobby instance`);
    }

    while (this.isNameTaken(checkName)) {
      checkName = `${name} ${index++}`;
    }

    player.setName(checkName);

    await this.lobby.finishedSpawningPlayer(owner);

    if (!this.lobby.isSpawningPlayers()) {
      this.lobby.reapplyActingHosts();
    }
  }

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void {
    const takenColors = this.getTakenColors(sender.playerId);
    let setColor: PlayerColor = color;

    const owner = this.lobby.findConnection(sender.parent.owner);

    if (!owner) {
      throw new Error("Received CheckColor from an InnerPlayerControl without an owner");
    }

    const player = this.lobby.findPlayerByConnection(owner);

    if (player) {
      this.confirmPlayerData(player);
    } else {
      throw new Error(`Client ${sender.parent.owner} does not have a PlayerInstance on the lobby instance`);
    }

    if (this.lobby.getPlayers().length <= 12) {
      while (takenColors.indexOf(setColor) > -1) {
        for (let i = 0; i < 12; i++) {
          if (takenColors.indexOf(i) == -1) {
            setColor = i;
          }
        }
      }
    } else {
      setColor = PlayerColor.ForteGreen;
    }

    player.setColor(setColor);
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

    gameData.gameData.players[playerIndex].completeTaskAtIndex(taskIndex);

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

  async handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): Promise<void> {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("Received ReportDeadBody without a GameData instance");
    }

    const owner = this.lobby.findConnection(sender.parent.owner);

    if (!owner) {
      throw new Error("Received ReportDeadBody from an InnerPlayerControl without an owner");
    }

    const player = this.lobby.findPlayerByConnection(owner);

    if (!player) {
      throw new Error(`Client ${sender.parent.owner} does not have a PlayerInstance on the lobby instance`);
    }

    const event = new MeetingStartedEvent(
      this.lobby.getGame()!,
      player,
      victimPlayerId ? this.lobby.findPlayerByPlayerId(victimPlayerId) : undefined,
    );

    await this.lobby.getServer().emit("meeting.started", event);

    if (event.isCancelled()) {
      // TODO: Try to remove "Waiting for host" text on emergency meeting button window
      return;
    }

    sender.sendRPCPacketTo(this.lobby.getConnections(), new StartMeetingPacket(event.getVictim()?.getId() ?? 0xff));

    const meetingHud = new EntityMeetingHud(this.lobby, this.getNextNetId());

    this.lobby.setMeetingHud(meetingHud);

    meetingHud.meetingHud.playerStates = new Array(gameData.gameData.players.length);

    for (let i = 0; i < gameData.gameData.players.length; i++) {
      const playerData = gameData.gameData.players[i];

      meetingHud!.meetingHud.playerStates[playerData.id] = new VoteState(
        playerData!.id == event.getCaller().getId(),
        false,
        playerData.isDead || playerData.isDisconnected,
        -1,
      );
    }

    this.lobby.sendRootGamePacket(new GameDataPacket([
      meetingHud.serializeSpawn(),
    ], this.lobby.getCode()));

    this.meetingHudTimeout = setTimeout(this.endMeeting.bind(this), (this.lobby.getOptions().votingTime + this.lobby.getOptions().discussionTime) * 1000);
  }

  async handleCastVote(votingPlayerId: number, suspectPlayerId: number): Promise<void> {
    const meetingHud = this.lobby.getMeetingHud();

    if (!meetingHud) {
      throw new Error("Received CastVote without a MeetingHud instance");
    }

    const player = this.lobby.findPlayerByPlayerId(votingPlayerId);

    if (!player) {
      throw new Error(`Player ${votingPlayerId} does not have a PlayerInstance on the lobby instance`);
    }

    const event = new MeetingVoteAddedEvent(
      this.lobby.getGame()!,
      player,
      suspectPlayerId ? this.lobby.findPlayerByPlayerId(suspectPlayerId) : undefined,
    );

    await this.lobby.getServer().emit("meeting.vote.added", event);

    if (event.isCancelled()) {
      const connection = player.getConnection();

      if (connection) {
        meetingHud.meetingHud.sendRPCPacketTo([connection], new ClearVotePacket());
      }

      return;
    }

    const oldMeetingHud = meetingHud.meetingHud.clone();
    const states = meetingHud.meetingHud.playerStates;

    states[event.getVoter().getId()].votedFor = event.getSuspect()?.getId() ?? -1;
    states[event.getVoter().getId()].didVote = true;

    this.lobby.sendRootGamePacket(new GameDataPacket([
      meetingHud.meetingHud.data(oldMeetingHud),
    ], this.lobby.getCode()));

    if (this.meetingHudTimeout && states.every(p => p.didVote || p.isDead)) {
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
    const player = this.lobby.getPlayers().find(thePlayer => thePlayer.entity.playerControl.netId == playerControlNetId);
    const level = this.lobby.getLevel();

    if (!player) {
      throw new Error(`Received RepairSystem from a non-player InnerNetObject: ${playerControlNetId}`);
    }

    switch (system.type) {
      case SystemType.Electrical:
        this.systemsHandler!.repairSwitch(player, system as SwitchSystem, amount as ElectricalAmount);
        break;
      case SystemType.Medbay:
        this.systemsHandler!.repairMedbay(player, system as MedScanSystem, amount as MedbayAmount);
        break;
      case SystemType.Oxygen:
        this.systemsHandler!.repairOxygen(player, system as LifeSuppSystem, amount as OxygenAmount);
        break;
      case SystemType.Reactor:
        this.systemsHandler!.repairReactor(player, system as ReactorSystem, amount as ReactorAmount);
        break;
      case SystemType.Laboratory:
        this.systemsHandler!.repairReactor(player, system as LaboratorySystem, amount as ReactorAmount);
        break;
      case SystemType.Security:
        this.systemsHandler!.repairSecurity(player, system as SecurityCameraSystem, amount as SecurityAmount);
        break;
      case SystemType.Doors:
        if (level == Level.Polus) {
          this.systemsHandler!.repairPolusDoors(player, system as DoorsSystem, amount as PolusDoorsAmount);
        } else {
          throw new Error(`Received RepairSystem for Doors on an unimplemented level: ${level as Level} (${Level[level]})`);
        }
        break;
      case SystemType.Communications:
        if (level == Level.MiraHq) {
          this.systemsHandler!.repairHqHud(player, system as HqHudSystem, amount as MiraCommunicationsAmount);
        } else {
          this.systemsHandler!.repairHudOverride(player, system as HudOverrideSystem, amount as NormalCommunicationsAmount);
        }
        break;
      case SystemType.Decontamination:
        this.systemsHandler!.repairDecon(player, system as DeconSystem, amount as DecontaminationAmount);
        break;
      case SystemType.Decontamination2:
        this.systemsHandler!.repairDecon(player, system as DeconTwoSystem, amount as DecontaminationAmount);
        break;
      case SystemType.Sabotage:
        this.systemsHandler!.repairSabotage(player, system as SabotageSystem, amount as SabotageAmount);
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

  handleSetStartCounter(player: PlayerInstance, sequenceId: number, timeRemaining: number): void {
    if (timeRemaining == -1) {
      return;
    }

    if (this.counterSequenceId < sequenceId && this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    if (timeRemaining == 5 && this.counterSequenceId != sequenceId) {
      this.lobby.removeActingHosts(true);
      // TODO: Config option
      this.startCountdown(5, player);
    }
  }

  handleDisconnect(connection: Connection, _reason?: DisconnectReason): void {
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
      this.lobby.getLogger().warn("Received Disconnect from connection without a player");

      return;
    }

    const playerIndex = gameData.gameData.players.findIndex(playerData => playerData.id == player.getId());
    const playerData = gameData.gameData.players[playerIndex];

    if (gameState == GameState.Started) {
      playerData.isDisconnected = true;
    } else {
      gameData.gameData.players.splice(playerIndex, 1);
    }

    gameData.gameData.updateGameData(gameData.gameData.players, this.lobby.getConnections());
    gameData.voteBanSystem.votes.delete(connection.id);

    if (this.shouldEndGame()) {
      if (playerData.isImpostor) {
        this.endGame(GameOverReason.ImpostorDisconnect);
      } else {
        this.endGame(GameOverReason.CrewmateDisconnect);
      }

      return;
    }

    const meetingHud = this.lobby.getMeetingHud();

    if (meetingHud) {
      meetingHud.meetingHud.clearVote([player]);
    }
  }

  handleUsePlatform(sender: InnerPlayerControl): void {
    const shipStatus = this.lobby.getShipStatus();

    if (!shipStatus) {
      throw new Error("Received UsePlatform without a ShipStatus instance");
    }

    const oldData = shipStatus.getShipStatus().clone();
    const movingPlatform = shipStatus.getShipStatus().systems[InternalSystemType.MovingPlatform] as MovingPlatformSystem;

    movingPlatform.innerPlayerControlNetId = sender.parent.playerControl.netId;
    movingPlatform.side = (movingPlatform.side + 1) % 2;

    movingPlatform.sequenceId++;

    const data = shipStatus.getShipStatus().getData(oldData);

    this.lobby.sendRootGamePacket(new GameDataPacket([data], this.lobby.getCode()));
  }

  /**
   * Sets the give players task list.
   *
   * @internal
   * @param player The player whose task list will be updates
   * @param tasks The player's new tasks
   */
  updatePlayerTasks(player: PlayerInstance, tasks: LevelTask[]): void {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("Attempted to set tasks without a GameData instance");
    }

    gameData.gameData.setTasks(player.getId(), tasks.map(task => task.id), this.lobby.getConnections());
  }

  /**
   * Adds random tasks to the given list.
   *
   * @internal
   * @param start The position in the source array to prevent an out-of-bounds array access
   * @param count The number of tasks to add
   * @param tasks The output array containing the random tasks
   * @param usedTaskTypes The types of tasks that are already in the output array
   * @param unusedTasks The source array of tasks
   */
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

  /**
   * Gets whether or not the game should end based on the number of Impostors
   * and Crewmates that are still alive.
   *
   * @internal
   * @returns `true` if `impostors.length >= crewmates.length`, `false` if not
   */
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

  /**
   * Checks if the given name is already in use by another player.
   *
   * @internal
   * @param name The name to be checked
   * @returns `true` if the name is already in use, `false` if not
   */
  private isNameTaken(name: string): boolean {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("isNameTaken called without a GameData instance");
    }

    return !!gameData.gameData.players.find(player => player.name == name);
  }

  /**
   * Gets all colors that are already in use by other players.
   *
   * @internal
   * @param excludePlayerId The ID of a player whose color will be excluded from the results
   * @returns The colors that are already in use
   */
  private getTakenColors(excludePlayerId: number): PlayerColor[] {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("getTakenColors called without a GameData instance");
    }

    return gameData.gameData.players.filter(player => player.id !== excludePlayerId && this.lobby.getPlayers().find(p => p.getId() == player.id)?.getConnection()).map(player => player.color);
  }

  /**
   * Creates a PlayerData instance for the given player if one does not already
   * exist on the GameData instance.
   *
   * @internal
   * @param player The player whose PlayerData will be checked
   */
  private confirmPlayerData(player: InternalPlayer): void {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("confirmPlayerData called without a GameData instance");
    }

    if (!gameData.gameData.players.some(p => p.id == player.entity.playerControl.playerId)) {
      const playerData = new PlayerData(
        player.entity.playerControl.playerId,
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
