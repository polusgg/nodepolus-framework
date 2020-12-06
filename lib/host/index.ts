import { RepairAmount, ElectricalAmount, MedbayAmount, OxygenAmount, ReactorAmount, SecurityAmount, PolusDoorsAmount, MiraCommunicationsAmount, NormalCommunicationsAmount, DecontaminationAmount, SabotageAmount } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { SecurityCameraSystem } from "../protocol/entities/baseShipStatus/systems/securityCameraSystem";
import { InnerCustomNetworkTransform } from "../protocol/entities/player/innerCustomNetworkTransform";
import { HudOverrideSystem } from "../protocol/entities/baseShipStatus/systems/hudOverrideSystem";
import { LaboratorySystem } from "../protocol/entities/baseShipStatus/systems/laboratorySystem";
import { AutoDoorsSystem } from "../protocol/entities/baseShipStatus/systems/autoDoorsSystem";
import { InnerLobbyBehaviour } from "../protocol/entities/lobbyBehaviour/innerLobbyBehaviour";
import { DeconTwoSystem } from "../protocol/entities/baseShipStatus/systems/deconTwoSystem";
import { LifeSuppSystem } from "../protocol/entities/baseShipStatus/systems/lifeSuppSystem";
import { SabotageSystem } from "../protocol/entities/baseShipStatus/systems/sabotageSystem";
import { MedScanSystem } from "../protocol/entities/baseShipStatus/systems/medScanSystem";
import { ReactorSystem } from "../protocol/entities/baseShipStatus/systems/reactorSystem";
import { InnerHeadquarters } from "../protocol/entities/headquarters/innerHeadquarters";
import { SwitchSystem } from "../protocol/entities/baseShipStatus/systems/switchSystem";
import { DeconSystem } from "../protocol/entities/baseShipStatus/systems/deconSystem";
import { DoorsSystem } from "../protocol/entities/baseShipStatus/systems/doorsSystem";
import { HqHudSystem } from "../protocol/entities/baseShipStatus/systems/hqHudSystem";
import { InnerVoteBanSystem } from "../protocol/entities/gameData/innerVoteBanSystem";
import { TaskLength, LevelTask, THE_SKELD, MIRA_HQ, POLUS } from "../types/levelTask";
import { InternalSystemType } from "../protocol/entities/baseShipStatus/systems/type";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { InnerPlayerPhysics } from "../protocol/entities/player/innerPlayerPhysics";
import { InnerShipStatus } from "../protocol/entities/shipStatus/innerShipStatus";
import { StartGamePacket } from "../protocol/packets/rootGamePackets/startGame";
import { InnerPlanetMap } from "../protocol/entities/planetMap/innerPlanetMap";
import { SabotageSystemHandler } from "./systemHandlers/sabotageSystemHandler";
import { GameDataPacket } from "../protocol/packets/rootGamePackets/gameData";
import { EndGamePacket } from "../protocol/packets/rootGamePackets/endGame";
import { InnerGameData } from "../protocol/entities/gameData/innerGameData";
import { EntityLobbyBehaviour } from "../protocol/entities/lobbyBehaviour";
import { EntityHeadquarters } from "../protocol/entities/headquarters";
import { PlayerData } from "../protocol/entities/gameData/playerData";
import { EntityShipStatus } from "../protocol/entities/shipStatus";
import { shuffleArrayClone, shuffleArray } from "../util/shuffle";
import { EntityPlanetMap } from "../protocol/entities/planetMap";
import { EntityGameData } from "../protocol/entities/gameData";
import { DeconHandler } from "./systemHandlers/deconHandler";
import { DisconnectReason } from "../types/disconnectReason";
import { EntityPlayer } from "../protocol/entities/player";
import { GameOverReason } from "../types/gameOverReason";
import { InnerLevel } from "../protocol/entities/types";
import { Connection } from "../protocol/connection";
import { PlayerColor } from "../types/playerColor";
import { SystemsHandler } from "./systemHandlers";
import { FakeHostId } from "../types/fakeHostId";
import { GLOBAL_OWNER } from "../util/constants";
import { SystemType } from "../types/systemType";
import { GameState } from "../types/gameState";
import { TaskType } from "../types/taskType";
import { Vector2 } from "../util/vector2";
import { Level } from "../types/level";
import { HostInstance } from "./types";
import { Player } from "../player";
import { Room } from "../room";
import { DoorSystem } from "./doorHandlers/doorSystem";

export class CustomHost implements HostInstance {
  public readonly id: number = FakeHostId.ServerAsHost;
  public readonly readyPlayerList: number[] = [];
  public readonly playersInScene: Map<number, string> = new Map();
  public readonly systemsHandler: SystemsHandler;
  public readonly sabotageHandler: SabotageSystemHandler;
  public deconHandlers: DeconHandler[] = [];
  public doorSystem: DoorSystem | undefined;

  private netIdIndex = 1;
  private counterSequenceId = 0;
  private countdownInterval: NodeJS.Timeout | undefined;

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
  ) {
    this.systemsHandler = new SystemsHandler(this);
    this.sabotageHandler = new SabotageSystemHandler(this);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
  sendKick(_banned: boolean, _reason: DisconnectReason): void {}
  sendLateRejection(_disconnectReason: DisconnectReason): void {}
  // Clients do not need to wait for the host if the server is the host.
  sendWaitingForHost(): void {}
  /* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

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
          // TODO: API call for AprilShipStatus
          this.room.shipStatus = new EntityShipStatus(this.room);
          this.room.shipStatus.owner = GLOBAL_OWNER;
          this.room.shipStatus.innerNetObjects = [
            new InnerShipStatus(this.netIdIndex++, this.room.shipStatus),
          ];
          break;
        case Level.MiraHq:
          this.room.shipStatus = new EntityHeadquarters(this.room);
          this.room.shipStatus.owner = GLOBAL_OWNER;
          this.room.shipStatus.innerNetObjects = [
            new InnerHeadquarters(this.netIdIndex++, this.room.shipStatus),
          ];
          break;
        case Level.Polus:
          this.room.shipStatus = new EntityPlanetMap(this.room);
          this.room.shipStatus.owner = GLOBAL_OWNER;
          this.room.shipStatus.innerNetObjects = [
            new InnerPlanetMap(this.netIdIndex++, this.room.shipStatus),
          ];
          break;
      }

      switch (this.room.options.options.levels[0]) {
        case Level.TheSkeld:
          this.deconHandlers = [];
          break;
        case Level.MiraHq:
          this.deconHandlers = [
            new DeconHandler(this, this.room.shipStatus.innerNetObjects[0].systems[InternalSystemType.Decon] as DeconSystem),
          ];
          break;
        case Level.Polus:
          this.deconHandlers = [
            new DeconHandler(this, this.room.shipStatus.innerNetObjects[0].systems[InternalSystemType.Decon] as DeconSystem),
            new DeconHandler(this, this.room.shipStatus.innerNetObjects[0].systems[InternalSystemType.Decon2] as DeconSystem),
          ];
          this.doorSystem = new DoorSystem(this, this.room.shipStatus);
          break;
      }

      if (!this.room.gameData) {
        throw new Error("Attempted to start game w/o gamedata");
      }

      this.room.sendRootGamePacket(new GameDataPacket([this.room.shipStatus!.spawn()], this.room.code));

      this.setInfected(this.room.options.options.impostorCount);

      // TODO: Uncomment when all tasks are added to LevelTask
      // this.setTasks();

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
        new InnerLobbyBehaviour(this.netIdIndex++, this.room.lobbyBehavior),
      ];
    }

    sender.write(new GameDataPacket([this.room.lobbyBehavior.spawn()], this.room.code));

    if (!this.room.gameData) {
      this.room.gameData = new EntityGameData(this.room);
      this.room.gameData.owner = GLOBAL_OWNER;
      this.room.gameData.innerNetObjects = [
        new InnerGameData(this.netIdIndex++, this.room.gameData, []),
        new InnerVoteBanSystem(this.netIdIndex++, this.room.gameData),
      ];
    }

    sender.write(new GameDataPacket([this.room.gameData.spawn()], this.room.code));

    const entity = new EntityPlayer(this.room);

    entity.owner = sender.id;
    entity.innerNetObjects = [
      new InnerPlayerControl(this.netIdIndex++, entity, true, newPlayerId),
      new InnerPlayerPhysics(this.netIdIndex++, entity),
      new InnerCustomNetworkTransform(this.netIdIndex++, entity, 5, new Vector2(0, 0), new Vector2(0, 0)),
    ];

    const player = new Player(entity);

    this.room.players.forEach(testplayer => {
      sender.write(new GameDataPacket([testplayer.gameObject.spawn()], this.room.code));
    });

    this.room.players.push(player);

    await this.room.sendRootGamePacket(new GameDataPacket([player.gameObject.spawn()], this.room.code));

    player.gameObject.playerControl.syncSettings(this.room.options, this.room.connections);

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

    player.gameObject.playerControl.isNew = false;

    setTimeout(() => {
      this.room.reapplyActingHosts();
    }, 100);
  }

  handleCheckName(sender: InnerPlayerControl, name: string): void {
    let checkName: string = name;
    let nameTaken: boolean = this.isNameTaken(checkName);
    let index = 1;

    while (nameTaken) {
      checkName = `${name} ${index++}`;

      nameTaken = this.isNameTaken(checkName);
    }

    sender.setName(checkName, this.room.connections);
  }

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void {
    const takenColors = this.getTakenColors();

    let setColor: PlayerColor = color;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): void {
    // TODO: Spawn MeetingHud with player states
    throw new Error("Method not implemented.");
  }

  handleRepairSystem(sender: InnerLevel, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void {
    if (!this.room.shipStatus) {
      throw new Error("Attempted to handle Repair System without a shipstatus");
    }

    if (!this.room.isHost || !(this.room.host instanceof CustomHost)) {
      throw new Error(`CustomHost received RepairSystem but server is not host`);
    }

    const system = this.room.shipStatus.innerNetObjects[0].getSystemFromType(systemId);
    const player = this.room.players.find(testplayer => testplayer.gameObject.playerControl.id == playerControlNetId);

    if (!player) {
      throw new Error(`Received RepairSystem from an InnerNetObject other than a player: ${playerControlNetId}`);
    }

    switch (system.type) {
      case SystemType.Electrical:
        this.systemsHandler.repairSwitch(player, system as SwitchSystem, amount as ElectricalAmount);
        break;
      case SystemType.Medbay:
        this.systemsHandler.repairMedbay(player, system as MedScanSystem, amount as MedbayAmount);
        break;
      case SystemType.Oxygen:
        this.systemsHandler.repairOxygen(player, system as LifeSuppSystem, amount as OxygenAmount);
        break;
      case SystemType.Reactor:
        this.systemsHandler.repairReactor(player, system as ReactorSystem, amount as ReactorAmount);
        break;
      case SystemType.Laboratory:
        this.systemsHandler.repairReactor(player, system as LaboratorySystem, amount as ReactorAmount);
        break;
      case SystemType.Security:
        this.systemsHandler.repairSecurity(player, system as SecurityCameraSystem, amount as SecurityAmount);
        break;
      case SystemType.Doors:
        if (this.room.options.options.levels[0] == Level.TheSkeld) {
          this.systemsHandler.repairSkeldDoors(player, system as AutoDoorsSystem, amount);
        } else if (this.room.options.options.levels[0] == Level.Polus) {
          this.systemsHandler.repairPolusDoors(player, system as DoorsSystem, amount as PolusDoorsAmount);
        }
        break;
      case SystemType.Communications:
        if (this.room.options.options.levels[0] == Level.MiraHq) {
          this.systemsHandler.repairHqHud(player, system as HqHudSystem, amount as MiraCommunicationsAmount);
        } else {
          this.systemsHandler.repairHudOverride(player, system as HudOverrideSystem, amount as NormalCommunicationsAmount);
        }
        break;
      case SystemType.Decontamination:
        this.systemsHandler.repairDecon(player, system as DeconSystem, amount as DecontaminationAmount);
        break;
      case SystemType.Decontamination2:
        this.systemsHandler.repairDecon(player, system as DeconTwoSystem, amount as DecontaminationAmount);
        break;
      case SystemType.Sabotage:
        this.systemsHandler.repairSabotage(player, system as SabotageSystem, amount as SabotageAmount);
        break;
      default:
        throw new Error(`Received RepairSystem packet for an unimplemented SystemType: ${system.type} (${SystemType[system.type]})`);
    }
  }

  handleCloseDoorsOfType(sender: InnerLevel, systemId: SystemType): void {
    if (!this.doorSystem) {
      throw new Error("handleCloseDoorsOfType called without a door system. Likely due to the packet being sent either before map initiation (lobby) or on MiraHQ, which does not have doors.");
    }

    this.doorSystem.closeDoor(this.doorSystem.getDoorsForSystem(systemId));
    this.doorSystem.setSystemTimeout(systemId, 30);
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

    const countdownInterval = setInterval(() => {
      const c = currentCount--;

      this.room.players[0].gameObject.playerControl.setStartCounter(this.counterSequenceId += 5, c, this.room.connections);

      if (c <= 0) {
        clearInterval(countdownInterval);
        this.startGame();
      }
    }, 1000);

    this.countdownInterval = countdownInterval;
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

    // console.log(`Setting tasks: ${numCommon} common, ${numLong} long, ${numShort} short`);

    let allTasks: LevelTask[];

    switch (level) {
      case Level.TheSkeld:
        allTasks = THE_SKELD;
        break;
      case Level.MiraHq:
        allTasks = MIRA_HQ;
        break;
      case Level.Polus:
        allTasks = POLUS;
        break;
      default:
        throw new Error(`Attempted to set tasks for an unimplemented level: ${level as Level} (${Level[level]})`);
    }

    const allCommon = shuffleArrayClone(allTasks.filter(task => task.length == TaskLength.Common));
    const allShort = shuffleArrayClone(allTasks.filter(task => task.length == TaskLength.Short));
    const allLong = shuffleArrayClone(allTasks.filter(task => task.length == TaskLength.Long));

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

      const idx = Math.floor(Math.random() * allCommon.length);

      // tasks.push(allCommon[idx]);
      tasks.push(allCommon[idx]);
      allCommon.splice(idx, 1);
    }

    // Indices used to act as a read head for short and long tasks
    // to try to prevent players from having the exact same tasks
    const shortIdx = { val: 0 };
    const longIdx = { val: 0 };

    for (let pid = 0; pid < this.room.players.length; pid++) {
      // Clear the used task array
      // used.splice(0, used.length);
      used.clear();

      // Remove every non-common task (effectively reusing the same array)
      tasks.splice(numCommon, tasks.length - numCommon);

      // Add long tasks
      this.addTasksFromList(longIdx, numLong, tasks, used, allLong);

      // Add short tasks
      this.addTasksFromList(shortIdx, numShort, tasks, used, allShort);

      const player = this.room.players.find(pl => pl.id == pid);

      if (player) {
        // console.log(`Player ${pid} has tasks:`, tasks.map(task => task.id));
        // console.log(`${tasks.filter(task => task.length == TaskLength.Common).length} common`);
        // console.log(`${tasks.filter(task => task.length == TaskLength.Long).length} long`);
        // console.log(`${tasks.filter(task => task.length == TaskLength.Short).length} short`);

        if (!this.room.gameData) {
          throw new Error("Attempted to set tasks without a GameData object");
        }

        this.room.gameData.gameData.setTasks(player.id, tasks.map(task => task.id), this.room.connections);
      }
    }
  }

  endGame(reason: GameOverReason): void {
    this.room.sendRootGamePacket(new EndGamePacket(this.room.code, reason, false));
  }

  // Don't blame me, blame Forte
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
          // usedTaskTypes.splice(0, usedTaskTypes.length);
          usedTaskTypes.clear();
        }
      }

      // Get the task
      const task: LevelTask | undefined = start.val >= unusedTasks.length ? undefined : unusedTasks[start.val++];

      if (!task) {
        continue;
      }

      // If it is already assigned...
      // if (usedTaskTypes.indexOf(task.type) != -1) {
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

  private isNameTaken(name: string): boolean {
    if (!this.room.gameData) {
      throw new Error("isNameTaken called for room without a GameData instance");
    }

    return !!this.room.gameData.gameData.players.find(player => player.name == name);
  }

  private getTakenColors(): PlayerColor[] {
    if (!this.room.gameData) {
      throw new Error("getTakenColors called for room without a GameData instance");
    }

    return this.room.gameData.gameData.players.map(player => player.color);
  }
}
