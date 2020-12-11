import { Server } from "./server";
import { Room } from "./room";
import { PlayerColor } from "../types/playerColor";
import { PlayerData } from "../protocol/entities/gameData/playerData";
import { PlayerHat } from "../types/playerHat";
import { PlayerPet } from "../types/playerPet";
import { PlayerSkin } from "../types/playerSkin";
import { Player as InternalPlayer } from "../player";
import Emittery from "emittery";
import { Task } from "./task";
import { InnerGameData } from "../protocol/entities/gameData/innerGameData";
import { GameDataPacket } from "../protocol/packets/rootGamePackets/gameData";
import { CustomHost } from "../host";
import { EntityPlayer } from "../protocol/entities/player";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { InnerPlayerPhysics } from "../protocol/entities/player/innerPlayerPhysics";
import { InnerCustomNetworkTransform } from "../protocol/entities/player/innerCustomNetworkTransform";
import { Vector2 } from "../util/vector2";

declare const server: Server;

export enum PlayerState {
  PreSpawn,
  Spawned,
  InGame,
}

type PlayerEvents = {
  spawned: undefined;
};

export class Player extends Emittery.Typed<PlayerEvents> {
  public readonly id: number;
  public playerId?: number;
  public state: PlayerState = PlayerState.PreSpawn;

  private internalTasks: Task[] = [];

  get internalPlayer(): InternalPlayer {
    if (this.state == PlayerState.Spawned || this.state == PlayerState.InGame) {
      if (!this.playerId && this.playerId !== 0) {
        throw new Error("Player in Spawned/InGame state though has no playerId");
      }

      for (let i = 0; i < this.room.internalRoom.players.length; i++) {
        const player = this.room.internalRoom.players[i];

        if (player.id == this.playerId) {
          return player;
        }
      }

      throw new Error("Player in Spawned/InGame state though has no entry in room players[]");
    }

    throw new Error("Attempted to get gameData entry for player before spawn");
  }

  private get gameDataEntry(): PlayerData {
    if (this.state == PlayerState.Spawned || this.state == PlayerState.InGame) {
      if (!this.room.internalRoom.gameData) {
        throw new Error("Player in Spawned/InGame state though room has no gameData");
      }

      if (this.playerId !== 0) {
        throw new Error("Player in Spawned/InGame state though has no playerId");
      }

      for (let i = 0; i < this.room.internalRoom.gameData.gameData.players.length; i++) {
        const player = this.room.internalRoom.gameData!.gameData.players[i];

        if (player.id == this.playerId) {
          return player;
        }
      }

      throw new Error("Player in Spawned/InGame state though has no entry in gameData");
    }

    throw new Error("Attempted to get gameData entry for player before spawn");
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

  constructor(public room: Room, id?: number, public readonly ip?: string, public readonly port?: number) {
    super();

    if (id) {
      this.id = id;
    } else {
      this.id = server.internalServer.nextConnectionId;
    }
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
      throw new Error("attempted to kill player without gameData");
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
    this.internalPlayer.gameObject.playerControl.murderPlayer(player.internalPlayer.gameObject.playerControl.id, this.room.internalRoom.connections);

    if (this.room.internalRoom.host instanceof CustomHost) {
      this.room.internalRoom.host.handleMurderPlayer(this.internalPlayer.gameObject.playerControl, 0);
    }

    return this;
  }

  revive(): this {
    if (this.room.internalRoom.host instanceof CustomHost) {
      const entity = new EntityPlayer(this.room.internalRoom);

      entity.owner = this.id;

      entity.innerNetObjects = [
        new InnerPlayerControl(this.room.internalRoom.host.netIdIndex++, entity, false, this.playerId!),
        new InnerPlayerPhysics(this.room.internalRoom.host.netIdIndex++, entity),
        new InnerCustomNetworkTransform(this.room.internalRoom.host.netIdIndex++, entity, 0, new Vector2(0, 0), new Vector2(0, 0)),
      ];

      this.room.internalRoom.sendRootGamePacket(new GameDataPacket([
        entity.spawn(),
      ], this.room.code));

      const old = this.internalPlayer.gameObject.customNetworkTransform.clone();

      this.internalPlayer.gameObject.customNetworkTransform.position = new Vector2(-39, -39);

      this.room.internalRoom.sendRootGamePacket(new GameDataPacket([
        this.internalPlayer.gameObject.customNetworkTransform.data(old),
      ], this.room.code));

      this.internalPlayer.gameObject = entity;
    } else {
      throw new Error("TODO: Implement revival for CAAH? (not sure if this is possible. Experimentation time!)");
    }

    return this;
  }

  internalSetTasks(tasks: Task[]): void {
    this.internalTasks = tasks;
  }
}
