import { GameDataPacket, JoinGameResponsePacket, RemovePlayerPacket } from "../../protocol/packets/root";
import { PlayerColor, PlayerHat, PlayerPet, PlayerSkin, PlayerState } from "../../types/enums";
import { PlayerData } from "../../protocol/entities/gameData/types";
import { DespawnPacket } from "../../protocol/packets/gameData";
import { EntityPlayer } from "../../protocol/entities/player";
import { Player as InternalPlayer } from "../../player";
import { DisconnectReason, Vector2 } from "../../types";
import { PlainPlayerEvents, PlayerEvents } from ".";
import { TextComponent } from "../text";
import { Server } from "../server";
import { Lobby } from "../lobby";
import Emittery from "emittery";
import { Task } from "../game";

declare const server: Server;

export class Player extends Emittery.Typed<PlayerEvents, PlainPlayerEvents> {
  public playerId?: number;
  public state: PlayerState = PlayerState.PreSpawn;

  private internalTasks: Task[] = [];
  private lastPosition: Vector2 = new Vector2(0, 0);
  private lastVelocity: Vector2 = new Vector2(0, 0);

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
      return TextComponent.from(this.getGameDataEntry().name);
    } catch (error) {
      const connectionName = server.internalServer.connections.get(`${this.ip}:${this.port}`)?.name;

      if (connectionName) {
        return TextComponent.from(connectionName);
      }

      throw new Error("Player has no connection on the server instance");
    }
  }

  get color(): PlayerColor {
    return this.getGameDataEntry().color;
  }

  get hat(): PlayerHat {
    return this.getGameDataEntry().hat;
  }

  get pet(): PlayerPet {
    return this.getGameDataEntry().pet;
  }

  get skin(): PlayerSkin {
    return this.getGameDataEntry().skin;
  }

  get isImpostor(): boolean {
    return this.getGameDataEntry().isImpostor;
  }

  get isDead(): boolean {
    return this.getGameDataEntry().isDead;
  }

  get tasks(): Task[] {
    return this.internalTasks;
  }

  get isScanning(): boolean {
    // TODO: set via scanning events
    return false;
  }

  constructor(
    public lobby: Lobby,
    public readonly clientId: number = server.internalServer.getNextConnectionId(),
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

  getInternalPlayer(): InternalPlayer {
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

  setName(name: TextComponent | string): this {
    this.emit("nameChanged", this.name);

    this.getInternalPlayer().gameObject.playerControl.setName(name.toString(), this.lobby.internalLobby.connections);

    return this;
  }

  setColor(color: PlayerColor): this {
    this.emit("colorChanged", this.color);

    this.getInternalPlayer().gameObject.playerControl.setColor(color, this.lobby.internalLobby.connections);

    return this;
  }

  setHat(hat: PlayerHat): this {
    this.emit("hatChanged", this.hat);

    this.getInternalPlayer().gameObject.playerControl.setHat(hat, this.lobby.internalLobby.connections);

    return this;
  }

  setPet(pet: PlayerPet): this {
    this.emit("petChanged", this.pet);

    this.getInternalPlayer().gameObject.playerControl.setPet(pet, this.lobby.internalLobby.connections);

    return this;
  }

  setSkin(skin: PlayerSkin): this {
    this.emit("skinChanged", this.skin);

    this.getInternalPlayer().gameObject.playerControl.setSkin(skin, this.lobby.internalLobby.connections);

    return this;
  }

  kill(): this {
    if (!this.lobby.internalLobby.gameData) {
      throw new Error("Attempted to kill player without a GameData instance");
    }

    this.getInternalPlayer().gameObject.playerControl.exiled([]);

    this.lobby.internalLobby.gameData.gameData.updateGameData([
      this.getGameDataEntry(),
    ], this.lobby.internalLobby.connections);

    if (this.isImpostor) {
      this.lobby.internalLobby.customHostInstance.handleImpostorDeath();
    } else {
      this.lobby.internalLobby.customHostInstance.handleMurderPlayer(this.getInternalPlayer().gameObject.playerControl, 0);
    }

    // TODO: Finish once events are written
    // this.emit("exiled", )

    return this;
  }

  murder(player: Player): this {
    const playerControl = this.getInternalPlayer().gameObject.playerControl;

    playerControl.murderPlayer(player.getInternalPlayer().gameObject.playerControl.netId, this.lobby.internalLobby.connections);
    this.lobby.internalLobby.customHostInstance.handleMurderPlayer(playerControl, 0);

    return this;
  }

  revive(): this {
    if (!this.lobby.internalLobby.gameData) {
      throw new Error("Attempted to revive player without a GameData instance");
    }

    const entity = new EntityPlayer(
      this.lobby.internalLobby,
      this.clientId,
      this.lobby.internalLobby.customHostInstance.getNextNetId(),
      this.playerId!,
      this.lobby.internalLobby.customHostInstance.getNextNetId(),
      this.lobby.internalLobby.customHostInstance.getNextNetId(),
      0,
      this.getInternalPlayer().gameObject.customNetworkTransform.position,
      this.getInternalPlayer().gameObject.customNetworkTransform.velocity,
    );

    this.getInternalPlayer().gameObject.customNetworkTransform.position = new Vector2(-39, -39);

    const thisConnection = this.lobby.internalLobby.findConnectionByPlayer(this.getInternalPlayer());

    if (!thisConnection) {
      throw new Error("Tried to respawn a player without a connection");
    }

    const oldName = this.name;

    this.lobby.internalLobby.ignoredNetIds = this.lobby.internalLobby.ignoredNetIds.concat([
      this.getInternalPlayer().gameObject.playerControl.netId,
      this.getInternalPlayer().gameObject.playerPhysics.netId,
      this.getInternalPlayer().gameObject.customNetworkTransform.netId,
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
          new DespawnPacket(this.getInternalPlayer().gameObject.playerControl.netId),
          new DespawnPacket(this.getInternalPlayer().gameObject.playerPhysics.netId),
          new DespawnPacket(this.getInternalPlayer().gameObject.customNetworkTransform.netId),
        ], this.lobby.code));
      }
    }

    this.getGameDataEntry().isDead = false;
    this.getInternalPlayer().gameObject = entity;

    this.lobby.internalLobby.gameData.gameData.updateGameData([this.getGameDataEntry()], this.lobby.internalLobby.connections);

    this.lobby.internalLobby.sendRootGamePacket(new GameDataPacket([
      entity.serializeSpawn(),
    ], this.lobby.code));

    return this;
  }

  sendChat(message: string): this {
    this.getInternalPlayer().gameObject.playerControl.sendChat(message, this.lobby.internalLobby.connections);

    return this;
  }

  internalSetTasks(tasks: Task[]): void {
    this.internalTasks = tasks;
  }

  private getGameDataEntry(): PlayerData {
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
}