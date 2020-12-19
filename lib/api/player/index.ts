import { InnerCustomNetworkTransform } from "../../protocol/entities/player/innerCustomNetworkTransform";
import { DespawnPacket } from "../../protocol/packets/rootGamePackets/gameDataPackets/despawn";
import { JoinGameResponsePacket } from "../../protocol/packets/rootGamePackets/joinGame";
import { RemovePlayerPacket } from "../../protocol/packets/rootGamePackets/removePlayer";
import { InnerPlayerControl } from "../../protocol/entities/player/innerPlayerControl";
import { InnerPlayerPhysics } from "../../protocol/entities/player/innerPlayerPhysics";
import { InnerMeetingHud } from "../../protocol/entities/meetingHud/innerMeetingHud";
import { GameDataPacket } from "../../protocol/packets/rootGamePackets/gameData";
import { PlayerData } from "../../protocol/entities/gameData/playerData";
import { EntityMeetingHud } from "../../protocol/entities/meetingHud";
import { DisconnectReason } from "../../types/disconnectReason";
import { EntityPlayer } from "../../protocol/entities/player";
import { Player as InternalPlayer } from "../../player";
import { PlayerColor } from "../../types/playerColor";
import { GLOBAL_OWNER } from "../../util/constants";
import { PlayerSkin } from "../../types/playerSkin";
import { PlayerHat } from "../../types/playerHat";
import { PlayerPet } from "../../types/playerPet";
import { DeathReason } from "../types/enums";
import { Vector2 } from "../../util/vector2";
import { TextComponent } from "../text";
import { Task } from "../game/task";
import { Server } from "../server";
import { Lobby } from "../lobby";
import Emittery from "emittery";
import Vent from "../game/vent";

declare const server: Server;

export enum PlayerState {
  PreSpawn,
  Spawned,
  InGame,
  Destroyed,
}

export type PlayerEvents = {
  murdered: Player;
  moved: {
    position: Vector2;
    velocity: Vector2;
  };
  nameChanged: TextComponent;
  colorChanged: PlayerColor;
  petChanged: PlayerPet;
  hatChanged: PlayerHat;
  skinChanged: PlayerSkin;
  voted: Player | undefined;
  chat: TextComponent;
  enterVent: Vent;
  exitVent: Vent;
  killed: DeathReason;
};

export type PlainPlayerEvents = "spawned" | "despawned" | "assignedImpostor" | "exiled";

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

      for (let i = 0; i < this.lobby.internalLobby.players.length; i++) {
        const player = this.lobby.internalLobby.players[i];

        if (player.id == this.playerId) {
          return player;
        }
      }

      throw new Error("Player was not found in the lobby's players array");
    }

    throw new Error("Attempted to get a player before they were spawned");
  }

  get name(): TextComponent {
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
    try {
      return TextComponent.from(this.gameDataEntry.name);
    } catch (error) {
      const connectionName = server.internalServer.connections.get(`${this.ip}:${this.port}`)?.name;

      if (connectionName) {
        return TextComponent.from(connectionName);
      }

      throw new Error("Player has no connection on the server instance");
    }
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

  get isScanning(): boolean {
    // TODO: set via scanning events
    return false;
  }

  private get gameDataEntry(): PlayerData {
    if (this.state == PlayerState.Spawned || this.state == PlayerState.InGame) {
      if (this.playerId === undefined) {
        throw new Error("Player has no ID");
      }

      if (!this.lobby.internalLobby.gameData) {
        throw new Error("Lobby has no GameData instance");
      }

      for (let i = 0; i < this.lobby.internalLobby.gameData.gameData.players.length; i++) {
        const player = this.lobby.internalLobby.gameData!.gameData.players[i];

        if (player.id == this.playerId) {
          return player;
        }
      }

      throw new Error("Player was not found in the lobby's GameData instance");
    }

    throw new Error("Attempted to get a player's data before they were spawned");
  }

  constructor(
    public lobby: Lobby,
    public readonly clientId: number = server.internalServer.nextConnectionId,
    public readonly ip?: string,
    public readonly port?: number,
  ) {
    super();

    lobby.internalLobby.on("movement", ({ clientId: id, position, velocity }) => {
      if (this.state == PlayerState.PreSpawn) {
        // TODO
      }

      if (id == this.clientId) {
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

    lobby.internalLobby.on("chat", ({ clientId: id, message }) => {
      if (id == this.clientId) {
        // TODO: See name getter
        this.emit("chat", TextComponent.from(message));
      }
    });

    lobby.internalLobby.on("setInfected", infected => {
      for (let i = 0; i < infected.length; i++) {
        const id = infected[i];

        if (id === this.playerId) {
          this.emit("assignedImpostor");
        }
      }
    });

    lobby.internalLobby.on("despawn", innerNetObject => {
      if (innerNetObject.parent.owner == this.clientId) {
        this.state = PlayerState.PreSpawn;
      }
    });

    // lobby.internalLobby.on("nameChanged", ({ clientId: id, newName }) => {
    //   if (id == this.clientId) {
    //     this.emit("")
    //   }
    // });
  }

  setName(name: TextComponent | string): this {
    this.emit("nameChanged", this.name);

    this.internalPlayer.gameObject.playerControl.setName(name.toString(), this.lobby.internalLobby.connections);

    return this;
  }

  setColor(color: PlayerColor): this {
    this.emit("colorChanged", this.color);

    this.internalPlayer.gameObject.playerControl.setColor(color, this.lobby.internalLobby.connections);

    return this;
  }

  setHat(hat: PlayerHat): this {
    this.emit("hatChanged", this.hat);

    this.internalPlayer.gameObject.playerControl.setHat(hat, this.lobby.internalLobby.connections);

    return this;
  }

  setPet(pet: PlayerPet): this {
    this.emit("petChanged", this.pet);

    this.internalPlayer.gameObject.playerControl.setPet(pet, this.lobby.internalLobby.connections);

    return this;
  }

  setSkin(skin: PlayerSkin): this {
    this.emit("skinChanged", this.skin);

    this.internalPlayer.gameObject.playerControl.setSkin(skin, this.lobby.internalLobby.connections);

    return this;
  }

  kill(): this {
    if (!this.lobby.internalLobby.gameData) {
      throw new Error("Attempted to kill player without a GameData instance");
    }

    this.internalPlayer.gameObject.playerControl.exiled([]);

    this.lobby.internalLobby.gameData.gameData.updateGameData([
      this.gameDataEntry,
    ], this.lobby.internalLobby.connections);

    if (this.isImpostor) {
      this.lobby.internalLobby.customHostInstance.handleImpostorDeath();
    } else {
      this.lobby.internalLobby.customHostInstance.handleMurderPlayer(this.internalPlayer.gameObject.playerControl, 0);
    }

    // TODO: Finish once events are written
    // this.emit("exiled", )

    return this;
  }

  murder(player: Player): this {
    const playerControl = this.internalPlayer.gameObject.playerControl;

    playerControl.murderPlayer(player.internalPlayer.gameObject.playerControl.id, this.lobby.internalLobby.connections);
    this.lobby.internalLobby.customHostInstance.handleMurderPlayer(playerControl, 0);

    return this;
  }

  revive(): this {
    if (!this.lobby.internalLobby.gameData) {
      throw new Error("Attempted to revive player without a GameData instance");
    }

    const entity = new EntityPlayer(this.lobby.internalLobby);

    entity.owner = this.clientId;
    entity.innerNetObjects = [
      new InnerPlayerControl(this.lobby.internalLobby.customHostInstance.nextNetId, entity, false, this.playerId!),
      new InnerPlayerPhysics(this.lobby.internalLobby.customHostInstance.nextNetId, entity),
      new InnerCustomNetworkTransform(
        this.lobby.internalLobby.customHostInstance.nextNetId,
        entity,
        0,
        this.internalPlayer.gameObject.customNetworkTransform.position,
        this.internalPlayer.gameObject.customNetworkTransform.velocity,
      ),
    ];

    this.internalPlayer.gameObject.customNetworkTransform.position = new Vector2(-39, -39);

    const thisConnection = this.lobby.internalLobby.findConnectionByPlayer(this.internalPlayer);

    if (!thisConnection) {
      throw new Error("Tried to respawn a player without a connection");
    }

    const oldName = this.name;

    this.lobby.internalLobby.ignoredNetIds = this.lobby.internalLobby.ignoredNetIds.concat([
      this.internalPlayer.gameObject.playerControl.id,
      this.internalPlayer.gameObject.playerPhysics.id,
      this.internalPlayer.gameObject.customNetworkTransform.id,
    ]);

    this.setName("");

    if (thisConnection.isActingHost) {
      thisConnection.write(new RemovePlayerPacket(this.lobby.code, this.clientId, this.clientId, DisconnectReason.serverRequest()));
      thisConnection.write(new JoinGameResponsePacket(this.lobby.code, this.clientId, this.clientId));
    } else {
      thisConnection.write(new RemovePlayerPacket(this.lobby.code, this.clientId, this.lobby.internalLobby.customHostInstance.id, DisconnectReason.serverRequest()));
      thisConnection.write(new JoinGameResponsePacket(this.lobby.code, this.clientId, this.lobby.internalLobby.customHostInstance.id));
    }

    this.setName(oldName);

    for (let i = 0; i < this.lobby.internalLobby.connections.length; i++) {
      const connection = this.lobby.internalLobby.connections[i];

      if (connection.id != this.clientId) {
        connection.write(new GameDataPacket([
          new DespawnPacket(this.internalPlayer.gameObject.playerControl.id),
          new DespawnPacket(this.internalPlayer.gameObject.playerPhysics.id),
          new DespawnPacket(this.internalPlayer.gameObject.customNetworkTransform.id),
        ], this.lobby.code));
      }
    }

    this.gameDataEntry.isDead = false;
    this.internalPlayer.gameObject = entity;

    this.lobby.internalLobby.gameData.gameData.updateGameData([this.gameDataEntry], this.lobby.internalLobby.connections);

    this.lobby.internalLobby.sendRootGamePacket(new GameDataPacket([
      entity.spawn(),
    ], this.lobby.code));

    return this;
  }

  sendChat(message: string): this {
    this.internalPlayer.gameObject.playerControl.sendChat(message, this.lobby.internalLobby.connections);

    return this;
  }

  internalSetTasks(tasks: Task[]): void {
    this.internalTasks = tasks;
  }

  // TODO: Delete?
  sendNote(message: TextComponent | string): this {
    const oldName = this.name.toString();

    const tempFakeMHud = new EntityMeetingHud(this.lobby.internalLobby);

    tempFakeMHud.owner = GLOBAL_OWNER;

    tempFakeMHud.innerNetObjects = [
      new InnerMeetingHud(this.lobby.internalLobby.customHostInstance.nextNetId, tempFakeMHud),
    ];

    this.lobby.internalLobby.sendRootGamePacket(new GameDataPacket([
      tempFakeMHud.spawn(),
    ], this.lobby.code));

    this.setName(`[FFFFFFFF]${message.toString()}[FFFFFF00]`);
    this.internalPlayer.gameObject.playerControl.sendChatNote(this.playerId!, 0, this.lobby.internalLobby.connections);
    this.setName(oldName);

    this.lobby.internalLobby.sendRootGamePacket(new GameDataPacket([
      new DespawnPacket(tempFakeMHud.innerNetObjects[0].id),
    ], this.lobby.code));

    return this;
  }
}
