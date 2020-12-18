import { TaskLength, LevelTask, TASKS_THE_SKELD, TASKS_MIRA_HQ, TASKS_POLUS } from "../types/levelTask";
import { MovingPlatformSystem } from "../protocol/entities/baseShipStatus/systems/movingPlatformSystem";
import { SecurityCameraSystem } from "../protocol/entities/baseShipStatus/systems/securityCameraSystem";
import { InnerCustomNetworkTransform } from "../protocol/entities/player/innerCustomNetworkTransform";
import { HudOverrideSystem } from "../protocol/entities/baseShipStatus/systems/hudOverrideSystem";
import { InnerAprilShipStatus } from "../protocol/entities/aprilShipStatus/innerAprilShipStatus";
import { LaboratorySystem } from "../protocol/entities/baseShipStatus/systems/laboratorySystem";
import { InnerLobbyBehaviour } from "../protocol/entities/lobbyBehaviour/innerLobbyBehaviour";
import { InnerMeetingHud, VoteState } from "../protocol/entities/meetingHud/innerMeetingHud";
import { DeconTwoSystem } from "../protocol/entities/baseShipStatus/systems/deconTwoSystem";
import { LifeSuppSystem } from "../protocol/entities/baseShipStatus/systems/lifeSuppSystem";
import { SabotageSystem } from "../protocol/entities/baseShipStatus/systems/sabotageSystem";
import { InnerAirshipStatus } from "../protocol/entities/airshipStatus/innerAirshipStatus";
import { MedScanSystem } from "../protocol/entities/baseShipStatus/systems/medScanSystem";
import { ReactorSystem } from "../protocol/entities/baseShipStatus/systems/reactorSystem";
import { InnerHeadquarters } from "../protocol/entities/headquarters/innerHeadquarters";
import { SwitchSystem } from "../protocol/entities/baseShipStatus/systems/switchSystem";
import { DeconSystem } from "../protocol/entities/baseShipStatus/systems/deconSystem";
import { DoorsSystem } from "../protocol/entities/baseShipStatus/systems/doorsSystem";
import { HqHudSystem } from "../protocol/entities/baseShipStatus/systems/hqHudSystem";
import { InnerVoteBanSystem } from "../protocol/entities/gameData/innerVoteBanSystem";
import { InternalSystemType } from "../protocol/entities/baseShipStatus/systems/type";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { InnerPlayerPhysics } from "../protocol/entities/player/innerPlayerPhysics";
import { InnerShipStatus } from "../protocol/entities/shipStatus/innerShipStatus";
import { StartGamePacket } from "../protocol/packets/rootGamePackets/startGame";
import { InnerPlanetMap } from "../protocol/entities/planetMap/innerPlanetMap";
import { SabotageSystemHandler } from "./systemHandlers/sabotageSystemHandler";
import { GameDataPacket } from "../protocol/packets/rootGamePackets/gameData";
import { EntityAprilShipStatus } from "../protocol/entities/aprilShipStatus";
import { EndGamePacket } from "../protocol/packets/rootGamePackets/endGame";
import { InnerGameData } from "../protocol/entities/gameData/innerGameData";
import { EntityLobbyBehaviour } from "../protocol/entities/lobbyBehaviour";
import { EntityAirshipStatus } from "../protocol/entities/airshipStatus";
import { EntityHeadquarters } from "../protocol/entities/headquarters";
import { PlayerData } from "../protocol/entities/gameData/playerData";
import { AutoDoorsHandler } from "./systemHandlers/autoDoorsHandler";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { EntityShipStatus } from "../protocol/entities/shipStatus";
import { shuffleArrayClone, shuffleArray } from "../util/shuffle";
import { EntityPlanetMap } from "../protocol/entities/planetMap";
import { EntityGameData } from "../protocol/entities/gameData";
import { DeconHandler } from "./systemHandlers/deconHandler";
import { DisconnectReason } from "../types/disconnectReason";
import { DoorsHandler } from "./systemHandlers/doorsHandler";
import { EntityPlayer } from "../protocol/entities/player";
import { GameOverReason } from "../types/gameOverReason";
import { InnerLevel } from "../protocol/entities/types";
import { Connection } from "../protocol/connection";
import { PlayerColor } from "../types/playerColor";
import { SystemsHandler } from "./systemHandlers";
import { GLOBAL_OWNER } from "../util/constants";
import { FakeHostId } from "../types/fakeHostId";
import { LimboState } from "../types/limboState";
import { SystemType } from "../types/systemType";
import { GameState } from "../types/gameState";
import { TaskType } from "../types/taskType";
import { Vector2 } from "../util/vector2";
import { Level } from "../types/level";
import { HostInstance } from "./types";
import { Player } from "../player";
import { Room } from "../room";
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
} from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";

export class CustomHost implements HostInstance {
  public readonly id: number = FakeHostId.ServerAsHost;

  public readyPlayerList: number[] = [];
  public playersInScene: Map<number, string> = new Map();

  public systemsHandler?: SystemsHandler;
  public sabotageHandler?: SabotageSystemHandler;
  public deconHandlers: DeconHandler[] = [];
  public doorHandler: DoorsHandler | AutoDoorsHandler | undefined;

  private netIdIndex = 1;
  private counterSequenceId = 0;
  private countdownInterval: NodeJS.Timeout | undefined;
  private meetingHudTimeout: NodeJS.Timeout | undefined;

  get nextNetId(): number {
    return this.netIdIndex++;
  }

  private get nextPlayerId(): number {
    const taken = this.room.players.map(player => player.id);

    // TODO: Change the max if necessary, but this is how the ID assignment should work
    for (let i = 0; i < 10; i++) {
      if (taken.indexOf(i) == -1) {
        return i;
      }
    }

    return -1;
  }

  constructor(
    public room: Room,
  ) {}

  /* eslint-disable @typescript-eslint/no-empty-function */
  sendKick(_banned: boolean, _reason: DisconnectReason): void {}
  sendLateRejection(_disconnectReason: DisconnectReason): void {}
  sendWaitingForHost(): void {}
  /* eslint-enable @typescript-eslint/no-empty-function */

  handleReady(sender: Connection): void {
    this.readyPlayerList.push(sender.id);

    /**
     * TODO:
     * Add disconnection logic to timeout players who take too long to be ready.
     * This **SHOULD NOT** be allowed because literally anybody who can read
     * could browse the source or check sus.wiki to figure this out and lock up
     * an entire server if they really wanted to.
     */

    if (this.readyPlayerList.length == this.room.connections.length) {
      if (this.room.lobbyBehavior) {
        this.room.despawn(this.room.lobbyBehavior.lobbyBehaviour);
      }

      switch (this.room.options.options.levels[0]) {
        case Level.TheSkeld:
          this.room.shipStatus = new EntityShipStatus(this.room);
          this.room.shipStatus.owner = GLOBAL_OWNER;
          this.room.shipStatus.innerNetObjects = [
            new InnerShipStatus(this.nextNetId, this.room.shipStatus),
          ];
          break;
        case Level.AprilSkeld:
          this.room.shipStatus = new EntityAprilShipStatus(this.room);
          this.room.shipStatus.owner = GLOBAL_OWNER;
          this.room.shipStatus.innerNetObjects = [
            new InnerAprilShipStatus(this.nextNetId, this.room.shipStatus),
          ];
          break;
        case Level.MiraHq:
          this.room.shipStatus = new EntityHeadquarters(this.room);
          this.room.shipStatus.owner = GLOBAL_OWNER;
          this.room.shipStatus.innerNetObjects = [
            new InnerHeadquarters(this.nextNetId, this.room.shipStatus),
          ];
          break;
        case Level.Polus:
          this.room.shipStatus = new EntityPlanetMap(this.room);
          this.room.shipStatus.owner = GLOBAL_OWNER;
          this.room.shipStatus.innerNetObjects = [
            new InnerPlanetMap(this.nextNetId, this.room.shipStatus),
          ];
          break;
        case Level.Airship:
          this.room.shipStatus = new EntityAirshipStatus(this.room);
          this.room.shipStatus.owner = GLOBAL_OWNER;
          this.room.shipStatus.innerNetObjects = [
            new InnerAirshipStatus(this.nextNetId, this.room.shipStatus),
          ];
          break;
      }

      this.systemsHandler = new SystemsHandler(this);
      this.sabotageHandler = new SabotageSystemHandler(this);

      switch (this.room.options.options.levels[0]) {
        case Level.TheSkeld:
          this.deconHandlers = [];
          this.doorHandler = new AutoDoorsHandler(this, this.room.shipStatus.innerNetObjects[0]);
          break;
        case Level.AprilSkeld:
          this.deconHandlers = [];
          this.doorHandler = new AutoDoorsHandler(this, this.room.shipStatus.innerNetObjects[0]);
          break;
        case Level.MiraHq:
          this.deconHandlers = [
            new DeconHandler(this, this.room.shipStatus.innerNetObjects[0].systems[InternalSystemType.Decon] as DeconSystem),
          ];
          break;
        case Level.Polus:
          this.deconHandlers = [
            new DeconHandler(this, this.room.shipStatus.innerNetObjects[0].systems[InternalSystemType.Decon] as DeconSystem),
            new DeconHandler(this, this.room.shipStatus.innerNetObjects[0].systems[InternalSystemType.Decon2] as DeconTwoSystem),
          ];
          this.doorHandler = new DoorsHandler(this, this.room.shipStatus.innerNetObjects[0]);
          break;
        case Level.Airship:
          this.deconHandlers = [];
          this.doorHandler = new DoorsHandler(this, this.room.shipStatus.innerNetObjects[0]);
          break;
      }

      if (!this.room.gameData) {
        throw new Error("Attempted to start game without a GameData instance");
      }

      this.room.sendRootGamePacket(new GameDataPacket([this.room.shipStatus!.spawn()], this.room.code));

      this.setInfected(this.room.options.options.impostorCount);

      // TODO: Uncomment when removing the for loop below
      // this.setTasks();

      // TODO: Remove -- debug task list for medbay scan on all 3 maps
      for (let i = 0; i < this.room.players.length; i++) {
        this.room.gameData.gameData.setTasks(this.room.players[i].id, [25, 4, 2], this.room.connections);
      }

      this.room.gameData.gameData.updateGameData(this.room.gameData.gameData.players, this.room.connections);

      this.room.gameState = GameState.Started;
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

    const newPlayerId = this.nextPlayerId;

    if (newPlayerId == -1) {
      sender.sendLateRejection(DisconnectReason.gameFull());
    }

    this.playersInScene.set(sender.id, sceneName);

    if (!this.room.lobbyBehavior) {
      this.room.lobbyBehavior = new EntityLobbyBehaviour(this.room);
      this.room.lobbyBehavior.owner = GLOBAL_OWNER;
      this.room.lobbyBehavior.innerNetObjects = [
        new InnerLobbyBehaviour(this.nextNetId, this.room.lobbyBehavior),
      ];
    }

    sender.write(new GameDataPacket([this.room.lobbyBehavior.spawn()], this.room.code));

    if (!this.room.gameData) {
      this.room.gameData = new EntityGameData(this.room);
      this.room.gameData.owner = GLOBAL_OWNER;
      this.room.gameData.innerNetObjects = [
        new InnerGameData(this.nextNetId, this.room.gameData, []),
        new InnerVoteBanSystem(this.nextNetId, this.room.gameData),
      ];
    }

    sender.write(new GameDataPacket([this.room.gameData.spawn()], this.room.code));

    const entity = new EntityPlayer(this.room);

    entity.owner = sender.id;
    entity.innerNetObjects = [
      new InnerPlayerControl(this.nextNetId, entity, true, newPlayerId),
      new InnerPlayerPhysics(this.nextNetId, entity),
      new InnerCustomNetworkTransform(this.nextNetId, entity, 5, new Vector2(0, 0), new Vector2(0, 0)),
    ];

    const player = new Player(entity);

    for (let i = 0; i < this.room.players.length; i++) {
      sender.write(new GameDataPacket([this.room.players[i].gameObject.spawn()], this.room.code));
    }

    this.room.players.push(player);

    await this.room.sendRootGamePacket(new GameDataPacket([player.gameObject.spawn()], this.room.code));

    player.gameObject.playerControl.syncSettings(this.room.options, [sender]);

    this.confirmPlayerData(sender, player);

    player.gameObject.playerControl.isNew = false;
  }

  handleCheckName(sender: InnerPlayerControl, name: string): void {
    let checkName: string = name;
    let index = 1;

    const owner = this.room.findConnection(sender.parent.owner);

    if (!owner) {
      throw new Error("IPC doesn't have an owner when trying to checkName");
    }

    this.confirmPlayerData(owner, new Player(sender.parent));

    while (this.isNameTaken(checkName)) {
      checkName = `${name} ${index++}`;
    }

    sender.setName(checkName, this.room.connections);

    this.room.finishedSpawningPlayer(owner);

    if (!this.room.isSpawningPlayers) {
      this.room.reapplyActingHosts();
    }
  }

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void {
    const takenColors = this.getTakenColors();
    let setColor: PlayerColor = color;

    const owner = this.room.findConnection(sender.parent.owner);

    if (!owner) {
      throw new Error("IPC doesn't have an owner when trying to checkName");
    }

    this.confirmPlayerData(owner, new Player(sender.parent));

    if (this.room.players.length <= 12) {
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

    sender.setColor(setColor, this.room.connections);
  }

  handleCompleteTask(sender: InnerPlayerControl, taskIndex: number): void {
    if (!this.room.gameData) {
      throw new Error("Received CompleteTask without a GameData instance");
    }

    const playerIndex = this.room.gameData.gameData.players.findIndex(playerData => playerData.id == sender.playerId);

    if (playerIndex == -1) {
      throw new Error("Received CompleteTask from a connection without an InnerPlayerControl instance");
    }

    this.room.gameData.gameData.players[playerIndex].completeTask(taskIndex);

    const crewmates = this.room.gameData.gameData.players.filter(playerData => !playerData.isImpostor);

    if (crewmates.every(crewmate => crewmate.isDoneWithTasks)) {
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
    if (!this.room.gameData) {
      throw new Error("Received ReportDeadBody without a GameData instance");
    }

    sender.startMeeting(victimPlayerId, this.room.connections);

    this.room.meetingHud = new EntityMeetingHud(this.room);
    this.room.meetingHud.innerNetObjects = [
      new InnerMeetingHud(this.nextNetId, this.room.meetingHud),
    ];
    this.room.meetingHud.innerNetObjects[0].playerStates = Array(this.room.gameData.gameData.players.length);

    for (let i = 0; i < this.room.gameData.gameData.players.length; i++) {
      const player = this.room.gameData.gameData.players[i];

      this.room.meetingHud!.innerNetObjects[0].playerStates[player.id] = new VoteState(
        player!.id == sender.playerId,
        false,
        player.isDead || player.isDisconnected,
        -1,
      );
    }

    this.room.sendRootGamePacket(new GameDataPacket([
      this.room.meetingHud.spawn(),
    ], this.room.code));

    this.meetingHudTimeout = setTimeout(this.endMeeting, (this.room.options.options.votingTime + this.room.options.options.discussionTime) * 1000);
  }

  endMeeting(): void {
    if (!this.room.meetingHud) {
      throw new Error("Attempted to end a meeting without a MeetingHud instance");
    }

    if (!this.room.gameData) {
      throw new Error("Attempted to end a meeting without a GameData instance");
    }

    const oldData = this.room.meetingHud.meetingHud.clone();
    const votes: Map<number, number[]> = new Map();

    for (let i = 0; i < this.room.gameData.gameData.players.length; i++) {
      const player = this.room.gameData.gameData.players[i];
      const state = this.room.meetingHud!.meetingHud.playerStates[player.id];

      if (!votes.has(state.votedFor)) {
        votes.set(state.votedFor, []);
      }

      votes.get(state.votedFor)!.push(player.id);
    }

    const voteCounts = [...votes.values()].map(playersVotedFor => playersVotedFor.length);
    const largestVoteCount = Math.max(...voteCounts);
    const allLargestVotes = [...votes.entries()].filter(entry => entry[1].length == largestVoteCount);

    if (allLargestVotes.length == 1 && allLargestVotes[0][0] != -1) {
      this.room.meetingHud.meetingHud.votingComplete(this.room.meetingHud.meetingHud.playerStates, true, allLargestVotes[0][0], false, this.room.connections);
    } else {
      this.room.meetingHud.meetingHud.votingComplete(this.room.meetingHud.meetingHud.playerStates, false, 255, true, this.room.connections);
    }

    const exiledPlayer = this.room.gameData.gameData.players.find(playerData => playerData.id == allLargestVotes[0][0]);

    if (allLargestVotes[0][0] != -1 && allLargestVotes.length == 1) {
      if (!exiledPlayer) {
        throw new Error("Exiled player has no data stored in GameData instance");
      }

      exiledPlayer.isDead = true;
    }

    this.room.sendRootGamePacket(new GameDataPacket([
      this.room.meetingHud.meetingHud.data(oldData),
    ], this.room.code));

    setTimeout(() => {
      if (!this.room.meetingHud) {
        throw new Error("Attempted to end a meeting without a MeetingHud instance");
      }

      this.room.meetingHud.meetingHud.close(this.room.connections);

      delete this.room.meetingHud;

      setTimeout(() => {
        if (this.shouldEndGame()) {
          if (!this.room.gameData) {
            throw new Error("Attempted to end a meeting without a GameData instance");
          }

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

  handleCastVote(votingPlayerId: number, suspectPlayerId: number): void {
    if (!this.room.meetingHud) {
      throw new Error("Received CastVote without a MeetingHud instance");
    }

    const oldMeetingHud = this.room.meetingHud.meetingHud.clone();

    this.room.meetingHud.meetingHud.playerStates[votingPlayerId].votedFor = suspectPlayerId;
    this.room.meetingHud.meetingHud.playerStates[votingPlayerId].didVote = true;

    this.room.sendRootGamePacket(new GameDataPacket([
      this.room.meetingHud.meetingHud.data(oldMeetingHud),
    ], this.room.code));

    if (this.meetingHudTimeout && this.room.meetingHud.meetingHud.playerStates.every(p => p.didVote || p.isDead)) {
      this.endMeeting();
      clearInterval(this.meetingHudTimeout);
    }
  }

  handleRepairSystem(_sender: InnerLevel, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void {
    if (!this.room.shipStatus) {
      throw new Error("Received RepairSystem without a ShipStatus instance");
    }

    if (!this.room.isHost || !(this.room.host instanceof CustomHost)) {
      throw new Error(`CustomHost received RepairSystem but server is not host`);
    }

    const system = this.room.shipStatus.innerNetObjects[0].getSystemFromType(systemId);
    const player = this.room.players.find(thePlayer => thePlayer.gameObject.playerControl.id == playerControlNetId);
    const level = this.room.options.options.levels[0];

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

  handleCloseDoorsOfType(_sender: InnerLevel, systemId: SystemType): void {
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
      this.room.removeActingHosts(true);
      // TODO: Config option
      this.startCountdown(5);
    }
  }

  handleDisconnect(connection: Connection): void {
    if (this.room.gameState == GameState.NotStarted) {
      this.stopCountdown();
    }

    if (!this.room.gameData) {
      if (this.room.gameState == GameState.NotStarted || this.room.gameState == GameState.Started) {
        throw new Error("Received Disconnect without a GameData instance");
      }

      return;
    }

    const player = this.room.findPlayerByConnection(connection);

    if (!player) {
      console.log("WARN: Recieved disconnect from connection without player");

      return;
    }

    const playerIndex = this.room.gameData.gameData.players.findIndex(playerData => playerData.id == player.id);
    const playerData = this.room.gameData.gameData.players[playerIndex];

    if (this.room.gameState == GameState.Started) {
      playerData.isDisconnected = true;
    } else {
      this.room.gameData.gameData.players.splice(playerIndex, 1);
    }

    this.room.gameData.gameData.updateGameData(this.room.gameData.gameData.players, this.room.connections);

    if (this.shouldEndGame()) {
      if (playerData.isImpostor) {
        this.endGame(GameOverReason.ImpostorDisconnect);
      } else {
        this.endGame(GameOverReason.CrewmateDisconnect);
      }
    }
  }

  handleUsePlatform(sender: InnerPlayerControl): void {
    if (!this.room.shipStatus) {
      throw new Error("Cannot find shipStatus on room.");
    }

    const oldData = this.room.shipStatus.innerNetObjects[0].clone();
    const movingPlatform = this.room.shipStatus.innerNetObjects[0].systems[InternalSystemType.MovingPlatform] as MovingPlatformSystem;

    movingPlatform.innerPlayerControlNetId = sender.parent.playerControl.id;
    movingPlatform.side = (movingPlatform.side + 1) % 2;

    movingPlatform.sequenceId++;

    //@ts-ignore TODO: Talk to cody about this?
    const data = this.room.shipStatus.innerNetObjects[0].getData(oldData);

    this.room.sendRootGamePacket(new GameDataPacket([data], this.room.code));
  }

  stopCountdown(): void {
    if (this.room.players.length > 0) {
      this.room.players[0].gameObject.playerControl.setStartCounter(this.counterSequenceId += 5, -1, this.room.connections);
    }

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown(count: number): void {
    let currentCount = count;
    const countdownFunction = (): void => {
      const time = currentCount--;

      this.room.players[0].gameObject.playerControl.setStartCounter(this.counterSequenceId += 5, time, this.room.connections);

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

  startGame(): void {
    this.room.sendRootGamePacket(new StartGamePacket(this.room.code));
  }

  setInfected(infectedCount: number): void {
    const shuffledPlayers = shuffleArrayClone(this.room.players);
    const impostors = new Array(infectedCount);

    for (let i = 0; i < infectedCount; i++) {
      impostors[i] = shuffledPlayers[i].id;
    }

    this.room.players[0].gameObject.playerControl.setInfected(impostors, this.room.connections);
  }

  setTasks(): void {
    const options = this.room.options.options;
    const level = options.levels[0];
    const numCommon = options.commonTasks;
    const numLong = options.longTasks;
    // Minimum of 1 short task
    const numShort = numCommon + numLong + options.shortTasks > 0 ? options.shortTasks : 1;

    let allTasks: LevelTask[];

    switch (level) {
      case Level.TheSkeld:
        allTasks = TASKS_THE_SKELD;
        break;
      case Level.MiraHq:
        allTasks = TASKS_MIRA_HQ;
        break;
      case Level.Polus:
        allTasks = TASKS_POLUS;
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

    for (let pid = 0; pid < this.room.players.length; pid++) {
      // Clear the used task array
      used.clear();

      // Remove every non-common task (effectively reusing the same array)
      tasks.splice(numCommon, tasks.length - numCommon);

      // Add long tasks
      this.addTasksFromList(longIndex, numLong, tasks, used, allLong);

      // Add short tasks
      this.addTasksFromList(shortIndex, numShort, tasks, used, allShort);

      const player = this.room.players.find(pl => pl.id == pid);

      if (player) {
        if (!this.room.gameData) {
          throw new Error("Attempted to set tasks without a GameData instance");
        }

        this.room.gameData.gameData.setTasks(player.id, tasks.map(task => task.id), this.room.connections);
      }
    }
  }

  endGame(reason: GameOverReason): void {
    this.room.gameState = GameState.NotStarted;
    this.deconHandlers = [];
    this.readyPlayerList = [];
    this.room.players = [];

    this.playersInScene.clear();

    for (let i = 0; i < this.room.connections.length; i++) {
      this.room.connections[i].limboState = LimboState.PreSpawn;
    }

    delete this.room.lobbyBehavior;
    delete this.room.shipStatus;
    delete this.room.gameData;
    delete this.doorHandler;
    delete this.sabotageHandler;
    delete this.systemsHandler;

    this.room.sendRootGamePacket(new EndGamePacket(this.room.code, reason, false));
  }

  private addTasksFromList(
    start: { val: number },
    count: number,
    tasks: LevelTask[],
    usedTaskTypes: Set<TaskType>,
    unusedTasks: LevelTask[],
  ): void {
    // A separate counter to stop the loop should it run forever since `i`
    // could be get decremented below
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
    if (!this.room.gameData) {
      throw new Error("shouldEndGame called without a GameData instance");
    }

    if (this.room.gameState == GameState.NotStarted) {
      return false;
    }

    const aliveImpostors: PlayerData[] = [];
    const aliveCrewmates: PlayerData[] = [];

    for (let i = 0; i < this.room.gameData.gameData.players.length; i++) {
      const playerData = this.room.gameData.gameData.players[i];

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
    if (!this.room.gameData) {
      throw new Error("isNameTaken called without a GameData instance");
    }

    return !!this.room.gameData.gameData.players.find(player => player.name == name);
  }

  private getTakenColors(): PlayerColor[] {
    if (!this.room.gameData) {
      throw new Error("getTakenColors called without a GameData instance");
    }

    return this.room.gameData.gameData.players.map(player => player.color);
  }

  private confirmPlayerData(connection: Connection, player: Player): void {
    if (!this.room.gameData) {
      throw new Error("confirmPlayerData called without a GameData instance");
    }

    if (this.room.gameData.gameData.players.map(p => p.id).indexOf(player.gameObject.playerControl.playerId) == -1) {
      console.log(connection.name, "spawning");

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

      this.room.gameData.gameData.updateGameData([playerData], this.room.connections);
    }
  }
}
