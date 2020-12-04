import { RepairAmount } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { InnerCustomNetworkTransform } from "../protocol/entities/player/innerCustomNetworkTransform";
import { InnerLobbyBehaviour } from "../protocol/entities/lobbyBehaviour/innerLobbyBehaviour";
import { InnerHeadquarters } from "../protocol/entities/headquarters/innerHeadquarters";
import { InnerVoteBanSystem } from "../protocol/entities/gameData/innerVoteBanSystem";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { InnerPlayerPhysics } from "../protocol/entities/player/innerPlayerPhysics";
import { InnerShipStatus } from "../protocol/entities/shipStatus/innerShipStatus";
import { DisconnectionType, DisconnectReason } from "../types/disconnectReason";
import { StartGamePacket } from "../protocol/packets/rootGamePackets/startGame";
import { InnerPlanetMap } from "../protocol/entities/planetMap/innerPlanetMap";
import { GameDataPacket } from "../protocol/packets/rootGamePackets/gameData";
import { InnerGameData } from "../protocol/entities/gameData/innerGameData";
import { EntityLobbyBehaviour } from "../protocol/entities/lobbyBehaviour";
import { EntityHeadquarters } from "../protocol/entities/headquarters";
import { PlayerData } from "../protocol/entities/gameData/playerData";
import { EntityShipStatus } from "../protocol/entities/shipStatus";
import { EntityPlanetMap } from "../protocol/entities/planetMap";
import { EntityGameData } from "../protocol/entities/gameData";
import { EntityPlayer } from "../protocol/entities/player";
import { InnerLevel } from "../protocol/entities/types";
import { Connection } from "../protocol/connection";
import { PlayerColor } from "../types/playerColor";
import { FakeHostId } from "../types/fakeHostId";
import { GLOBAL_OWNER } from "../util/constants";
import { SystemType } from "../types/systemType";
import { GameState } from "../types/gameState";
import { Vector2 } from "../util/vector2";
import { Level } from "../types/level";
import { HostInstance } from "./types";
import { Player } from "../player";
import { Room } from "../room";

export class CustomHost implements HostInstance {
  public readonly id: number = FakeHostId.ServerAsHost;
  public readonly readyPlayerList: number[] = [];
  public readonly playersInScene: Map<number, string> = new Map();

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
    // TODO: Implement
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

      this.room.connections.forEach(connection => {
        // TODO: setInfected, setTasks, updateGameData
        connection.write(new GameDataPacket([ this.room.shipStatus!.spawn() ], this.room.code));
      });

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
      sender.sendLateRejection(new DisconnectReason(DisconnectionType.GameFull));
    }

    this.playersInScene.set(sender.id, sceneName);

    if (!this.room.lobbyBehavior) {
      this.room.lobbyBehavior = new EntityLobbyBehaviour(this.room);
      this.room.lobbyBehavior.owner = GLOBAL_OWNER;
      this.room.lobbyBehavior.innerNetObjects = [
        new InnerLobbyBehaviour(this.netIdIndex++, this.room.lobbyBehavior),
      ];
    }

    sender.write(new GameDataPacket([ this.room.lobbyBehavior.spawn() ], this.room.code));

    if (!this.room.gameData) {
      this.room.gameData = new EntityGameData(this.room);
      this.room.gameData.owner = GLOBAL_OWNER;
      this.room.gameData.innerNetObjects = [
        new InnerGameData(this.netIdIndex++, this.room.gameData, []),
        new InnerVoteBanSystem(this.netIdIndex++, this.room.gameData),
      ];
    }

    sender.write(new GameDataPacket([ this.room.gameData.spawn() ], this.room.code));

    const entity = new EntityPlayer(this.room);

    entity.owner = sender.id;
    entity.innerNetObjects = [
      new InnerPlayerControl(this.netIdIndex++, entity, true, newPlayerId),
      new InnerPlayerPhysics(this.netIdIndex++, entity),
      new InnerCustomNetworkTransform(this.netIdIndex++, entity, 5, new Vector2(0, 0), new Vector2(0, 0)),
    ];

    const player = new Player(entity);

    // console.log("ABC DEF");

    // console.log(this.room.players);

    this.room.players.forEach(testplayer => {
      sender.write(new GameDataPacket([ testplayer.gameObject.spawn() ], this.room.code));
    });

    this.room.players.push(player);

    // console.log(this.room);

    // console.log("A");

    await this.room.sendRootGamePacket(new GameDataPacket([ player.gameObject.spawn() ], this.room.code));

    // console.log("B");

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

    this.room.gameData.gameData.updateGameData([ playerData ], this.room.connections);

    player.gameObject.playerControl.isNew = false;

    // await promise;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRepairSystem(sender: InnerLevel, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void {
    // TODO: Update system and send ShipStatus data packet
    throw new Error("Method not implemented.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleCloseDoorsOfType(sender: InnerLevel, systemId: SystemType): void {
    // TODO: Close the requested doors and send ShipStatus data packet
    throw new Error("Method not implemented.");
  }

  handleSetStartCounter(sequenceId: number, timeRemaining: number): void {
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
