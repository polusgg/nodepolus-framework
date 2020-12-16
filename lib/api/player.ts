import { InnerCustomNetworkTransform } from "../protocol/entities/player/innerCustomNetworkTransform";
import { DespawnPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/despawn";
import { JoinGameResponsePacket } from "../protocol/packets/rootGamePackets/joinGame";
import { RemovePlayerPacket } from "../protocol/packets/rootGamePackets/removePlayer";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { InnerPlayerPhysics } from "../protocol/entities/player/innerPlayerPhysics";
import { GameDataPacket } from "../protocol/packets/rootGamePackets/gameData";
import { PlayerData } from "../protocol/entities/gameData/playerData";
import { DisconnectReason } from "../types/disconnectReason";
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
import { Text } from "./text";

declare const server: Server;

export enum PlayerState {
  PreSpawn,
  Spawned,
  InGame,
}

export type PlayerEvents = {
  murdered: Player;
  moved: {
    position: Vector2;
    velocity: Vector2;
  };
};

export type PlainPlayerEvents = "spawned" | "assignedImpostor";

export class Player extends Emittery.Typed<PlayerEvents, PlainPlayerEvents> {
  public playerId?: number;
  public state: PlayerState = PlayerState.PreSpawn;

  private internalTasks: Task[] = [];
  private lastPosition: Vector2 = new Vector2(0, 0);
  private lastVelocity: Vector2 = new Vector2(0, 0);

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

  get name(): Text {
    /**
     * TODO: This is a really bad implementation.
     * It instantiates a new text object every time, which is slow. Plus any
     * changes made to the text object won't reflect on the actual player which
     * should occur.
     *
     * A better implementation would be to have a non-getter property on the
     * Player for name, that gets updated when the internal player's name gets
     * updated (e.g. in an event)
     */
    return Text.from(this.gameDataEntry.name);
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
        throw new Error("Room has no GameData instance");
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

    room.internalRoom.on("playerMoved", ({ cid, position, velocity }) => {
      if (cid == this.clientId) {
        if (this.lastPosition.x != position.x ||
            this.lastPosition.y != position.y ||
            this.lastVelocity.x != velocity.x ||
            this.lastVelocity.y != velocity.y
        ) {
          this.emit("moved", { position, velocity });

          this.lastPosition = position;
          this.lastVelocity = velocity;
        }
      }
    });

    room.internalRoom.on("setInfected", infected => {
      for (let i = 0; i < infected.length; i++) {
        const infectedpid = infected[i];

        if (infectedpid === this.playerId) {
          this.emit("assignedImpostor");
        }
      }
    });
  }

  setName(name: Text | string): this {
    this.internalPlayer.gameObject.playerControl.setName(name.toString(), this.room.internalRoom.connections);

    return this;
  }

  setColor(color: PlayerColor): this {
    this.internalPlayer.gameObject.playerControl.setColor(color, this.room.internalRoom.connections);

    return this;
  }

  setHat(hat: PlayerHat): this {
    this.internalPlayer.gameObject.playerControl.setHat(hat, this.room.internalRoom.connections);

    return this;
  }

  setPet(pet: PlayerPet): this {
    this.internalPlayer.gameObject.playerControl.setPet(pet, this.room.internalRoom.connections);

    return this;
  }

  setSkin(skin: PlayerSkin): this {
    this.internalPlayer.gameObject.playerControl.setSkin(skin, this.room.internalRoom.connections);

    return this;
  }

  kill(): this {
    if (!this.room.internalRoom.gameData) {
      throw new Error("Attempted to kill player without a GameData instance");
    }

    this.internalPlayer.gameObject.playerControl.exiled([]);

    this.room.internalRoom.gameData.gameData.updateGameData([
      this.gameDataEntry,
    ], this.room.internalRoom.connections);

    if (this.room.internalRoom.isHost) {
      if (this.isImpostor) {
        (this.room.internalRoom.host as CustomHost).handleImpostorDeath();
      } else {
        (this.room.internalRoom.host as CustomHost).handleMurderPlayer(this.internalPlayer.gameObject.playerControl, 0);
      }
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
      if (!this.room.internalRoom.gameData) {
        throw new Error("Attempted to revive player without a GameData instance");
      }

      const entity = new EntityPlayer(this.room.internalRoom);

      entity.owner = this.clientId;
      entity.innerNetObjects = [
        new InnerPlayerControl(this.room.internalRoom.host.nextNetId, entity, false, this.playerId!),
        new InnerPlayerPhysics(this.room.internalRoom.host.nextNetId, entity),
        new InnerCustomNetworkTransform(
          this.room.internalRoom.host.nextNetId,
          entity,
          0,
          this.internalPlayer.gameObject.customNetworkTransform.position,
          this.internalPlayer.gameObject.customNetworkTransform.velocity,
        ),
      ];

      this.internalPlayer.gameObject.customNetworkTransform.position = new Vector2(-39, -39);

      const thisConnection = this.room.internalRoom.findConnectionByPlayer(this.internalPlayer);

      if (!thisConnection) {
        throw new Error("Tried to respawn a player without a connection");
      }

      const oldName = this.name;

      this.room.internalRoom.ignoredNetIds = this.room.internalRoom.ignoredNetIds.concat([
        this.internalPlayer.gameObject.playerControl.id,
        this.internalPlayer.gameObject.playerPhysics.id,
        this.internalPlayer.gameObject.customNetworkTransform.id,
      ]);

      this.setName("");

      if (thisConnection.isActingHost) {
        thisConnection.write(new RemovePlayerPacket(this.room.code, this.clientId, this.clientId, DisconnectReason.serverRequest()));
        thisConnection.write(new JoinGameResponsePacket(this.room.code, this.clientId, this.clientId));
      } else {
        thisConnection.write(new RemovePlayerPacket(this.room.code, this.clientId, this.room.internalRoom.host.id, DisconnectReason.serverRequest()));
        thisConnection.write(new JoinGameResponsePacket(this.room.code, this.clientId, this.room.internalRoom.host.id));
      }

      this.setName(oldName);

      for (let i = 0; i < this.room.internalRoom.connections.length; i++) {
        const connection = this.room.internalRoom.connections[i];

        if (connection.id != this.clientId) {
          connection.write(new GameDataPacket([
            new DespawnPacket(this.internalPlayer.gameObject.playerControl.id),
            new DespawnPacket(this.internalPlayer.gameObject.playerPhysics.id),
            new DespawnPacket(this.internalPlayer.gameObject.customNetworkTransform.id),
          ], this.room.code));
        }
      }

      this.gameDataEntry.isDead = false;
      this.internalPlayer.gameObject = entity;

      this.room.internalRoom.gameData.gameData.updateGameData([this.gameDataEntry], this.room.internalRoom.connections);

      this.room.internalRoom.sendRootGamePacket(new GameDataPacket([
        entity.spawn(),
      ], this.room.code));
    } else {
      throw new Error("Attempted to revive player without a custom host instance");
    }

    return this;
  }

  sendChat(message: string): this {
    this.internalPlayer.gameObject.playerControl.sendChat(message, this.room.internalRoom.connections);

    return this;
  }

  internalSetTasks(tasks: Task[]): void {
    this.internalTasks = tasks;
  }
}
