import { InnerCustomNetworkTransform } from "../protocol/entities/player/innerCustomNetworkTransform";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { InnerPlayerPhysics } from "../protocol/entities/player/innerPlayerPhysics";
import { GameDataPacket } from "../protocol/packets/rootGamePackets/gameData";
import { InnerGameData } from "../protocol/entities/gameData/innerGameData";
import { PlayerData } from "../protocol/entities/gameData/playerData";
import { EntityPlayer } from "../protocol/entities/player";
import { Player as InternalPlayer } from "../player";
import { PlayerColor } from "../types/playerColor";
import { PlayerSkin } from "../types/playerSkin";
import { PlayerHat } from "../types/playerHat";
import { PlayerPet } from "../types/playerPet";
import { Vector2 } from "../util/vector2";
import { CustomHost } from "../host";
import { Server } from "./server";
import Emittery from "emittery";
import { Room } from "./room";
import { Task } from "./task";

declare const server: Server;

export enum PlayerState {
  PreSpawn,
  Spawned,
  InGame,
}

export type PlainPlayerEvents = "spawned";

export class Player extends Emittery.Typed<Record<string, never>, PlainPlayerEvents> {
  public playerId?: number;
  public state: PlayerState = PlayerState.PreSpawn;

  private internalTasks: Task[] = [];

  get internalPlayer(): InternalPlayer {
    if (this.state == PlayerState.Spawned || this.state == PlayerState.InGame) {
      if (this.playerId === undefined) {
        throw new Error("Player has no ID");
      }

      for (let i = 0; i < this.room.internalRoom.players.length; i++) {
        const player = this.room.internalRoom.players[i];

        if (player.id == this.playerId) {
          return player;
        }
      }

      throw new Error("Player was not found in the room's players array");
    }

    throw new Error("Attempted to get a player before they were spawned");
  }

  get name(): string {
    return this.gameDataEntry.name;
  }

  get color(): PlayerColor {
    return this.gameDataEntry.color;
  }

  get hat(): PlayerHat {
    return this.gameDataEntry.hat;
  }

  get pet(): PlayerPet {
    return this.gameDataEntry.pet;
  }

  get skin(): PlayerSkin {
    return this.gameDataEntry.skin;
  }

  get isImpostor(): boolean {
    return this.gameDataEntry.isImpostor;
  }

  get isDead(): boolean {
    return this.gameDataEntry.isDead;
  }

  get tasks(): Task[] {
    return this.internalTasks;
  }

  private get gameDataEntry(): PlayerData {
    if (this.state == PlayerState.Spawned || this.state == PlayerState.InGame) {
      if (this.playerId === undefined) {
        throw new Error("Player has no ID");
      }

      if (!this.room.internalRoom.gameData) {
        throw new Error("Player has no GameData instance");
      }

      for (let i = 0; i < this.room.internalRoom.gameData.gameData.players.length; i++) {
        const player = this.room.internalRoom.gameData!.gameData.players[i];

        if (player.id == this.playerId) {
          return player;
        }
      }

      throw new Error("Player was not found in the room's GameData instance");
    }

    throw new Error("Attempted to get a player's data before they were spawned");
  }

  constructor(
    public room: Room,
    public readonly clientId: number = server.internalServer.nextConnectionId,
    public readonly ip?: string,
    public readonly port?: number,
  ) {
    super();
  }

  setName(newName: string): this {
    this.internalPlayer.gameObject.playerControl.setName(newName, this.room.internalRoom.connections);

    return this;
  }

  setColor(newColor: PlayerColor): this {
    this.internalPlayer.gameObject.playerControl.setColor(newColor, this.room.internalRoom.connections);

    return this;
  }

  setHat(newHat: PlayerHat): this {
    this.internalPlayer.gameObject.playerControl.setHat(newHat, this.room.internalRoom.connections);

    return this;
  }

  setPet(newPet: PlayerPet): this {
    this.internalPlayer.gameObject.playerControl.setPet(newPet, this.room.internalRoom.connections);

    return this;
  }

  setSkin(newSkin: PlayerSkin): this {
    this.internalPlayer.gameObject.playerControl.setSkin(newSkin, this.room.internalRoom.connections);

    return this;
  }

  kill(): this {
    if (!this.room.internalRoom.gameData) {
      throw new Error("Attempted to kill player without a GameData instance");
    }

    const oldGameData: InnerGameData = this.room.internalRoom.gameData.gameData.clone();

    this.internalPlayer.gameObject.playerControl.exiled([]);

    this.room.internalRoom.sendRootGamePacket(new GameDataPacket([
      this.room.internalRoom.gameData.gameData.data(oldGameData),
    ], this.room.code));

    if (this.room.internalRoom.host instanceof CustomHost) {
      this.room.internalRoom.host.handleMurderPlayer(this.internalPlayer.gameObject.playerControl, 0);
    }

    return this;
  }

  murder(player: Player): this {
    const playerControl = this.internalPlayer.gameObject.playerControl;

    playerControl.murderPlayer(player.internalPlayer.gameObject.playerControl.id, this.room.internalRoom.connections);

    if (this.room.internalRoom.host instanceof CustomHost) {
      this.room.internalRoom.host.handleMurderPlayer(playerControl, 0);
    }

    return this;
  }

  revive(): this {
    if (this.room.internalRoom.host instanceof CustomHost) {
      const entity = new EntityPlayer(this.room.internalRoom);

      entity.owner = this.clientId;
      entity.innerNetObjects = [
        new InnerPlayerControl(this.room.internalRoom.host.nextNetId, entity, false, this.playerId!),
        new InnerPlayerPhysics(this.room.internalRoom.host.nextNetId, entity),
        new InnerCustomNetworkTransform(this.room.internalRoom.host.nextNetId, entity, 0, new Vector2(0, 0), new Vector2(0, 0)),
      ];

      this.room.internalRoom.sendRootGamePacket(new GameDataPacket([
        entity.spawn(),
      ], this.room.code));

      const transform = this.internalPlayer.gameObject.customNetworkTransform;
      const old = transform.clone();

      transform.position = new Vector2(-39, -39);

      this.room.internalRoom.sendRootGamePacket(new GameDataPacket([
        transform.data(old),
      ], this.room.code));

      this.internalPlayer.gameObject = entity;
    } else {
      throw new Error("Attempted to revive player without a custom host instance");
    }

    return this;
  }

  internalSetTasks(tasks: Task[]): void {
    this.internalTasks = tasks;
  }
}
