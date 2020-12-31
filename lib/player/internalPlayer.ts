import { RemovePlayerPacket, JoinGameResponsePacket, GameDataPacket } from "../protocol/packets/root";
import { PlayerSkin, PlayerPet, PlayerHat, PlayerColor } from "../types/enums";
import { PlayerData } from "../protocol/entities/gameData/types";
import { DespawnPacket } from "../protocol/packets/gameData";
import { EntityPlayer } from "../protocol/entities/player";
import { DisconnectReason, Vector2 } from "../types";
import { PlayerInstance } from "../api/player";
import { TextComponent } from "../api/text";
import { InternalLobby } from "../lobby";
import { Task } from "../api/game/task";

export class InternalPlayer implements PlayerInstance {
  public readonly id: number;

  private internalTasks: Task[] = [];
  private internalName: TextComponent;

  constructor(
    public lobby: InternalLobby,
    public gameObject: EntityPlayer,
  ) {
    this.id = gameObject.playerControl.playerId;
    this.internalName = TextComponent.from("");
  }

  getId(): number {
    return this.id;
  }

  getName(): TextComponent {
    return this.internalName;
  }

  getColor(): PlayerColor {
    return this.getGameDataEntry().color;
  }

  getHat(): PlayerHat {
    return this.getGameDataEntry().hat;
  }

  getPet(): PlayerPet {
    return this.getGameDataEntry().pet;
  }

  getSkin(): PlayerSkin {
    return this.getGameDataEntry().skin;
  }

  isImpostor(): boolean {
    return this.getGameDataEntry().isImpostor;
  }

  isDead(): boolean {
    return this.getGameDataEntry().isDead;
  }

  getTasks(): Task[] {
    return this.internalTasks;
  }

  isScanning(): boolean {
    // TODO: set via scanning events
    return false;
  }

  setName(name: TextComponent | string): this {
    // this.emit("nameChanged", this.name);

    if (name instanceof TextComponent) {
      this.internalName = name;
    } else {
      this.internalName = TextComponent.from(name);
    }

    this.gameObject.playerControl.setName(name.toString(), this.lobby.getConnections());

    return this;
  }

  setColor(color: PlayerColor): this {
    // this.emit("colorChanged", this.color);

    this.gameObject.playerControl.setColor(color, this.lobby.getConnections());

    return this;
  }

  setHat(hat: PlayerHat): this {
    // this.emit("hatChanged", this.hat);

    this.gameObject.playerControl.setHat(hat, this.lobby.getConnections());

    return this;
  }

  setPet(pet: PlayerPet): this {
    // this.emit("petChanged", this.pet);

    this.gameObject.playerControl.setPet(pet, this.lobby.getConnections());

    return this;
  }

  setSkin(skin: PlayerSkin): this {
    // this.emit("skinChanged", this.skin);

    this.gameObject.playerControl.setSkin(skin, this.lobby.getConnections());

    return this;
  }

  setTasks(tasks: Task[]): this {
    this.internalTasks = tasks;

    return this;
  }

  kill(): this {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("Attempted to kill player without a GameData instance");
    }

    this.gameObject.playerControl.exiled([]);

    gameData.gameData.updateGameData([
      this.getGameDataEntry(),
    ], this.lobby.getConnections());

    if (this.isImpostor()) {
      this.lobby.getHostInstance().handleImpostorDeath();
    } else {
      this.lobby.getHostInstance().handleMurderPlayer(this.gameObject.playerControl, 0);
    }

    // TODO: Finish once events are written
    // this.emit("exiled", )

    return this;
  }

  murder(player: PlayerInstance): this {
    const playerControl = this.gameObject.playerControl;

    // TODO: throw a pretty error if player is not an InternalPlayer

    playerControl.murderPlayer((player as InternalPlayer).gameObject.playerControl.netId, this.lobby.getConnections());
    this.lobby.getHostInstance().handleMurderPlayer(playerControl, 0);

    return this;
  }

  revive(): this {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("Attempted to revive player without a GameData instance");
    }

    const entity = new EntityPlayer(
      this.lobby,
      this.gameObject.owner,
      this.lobby.getHostInstance().getNextNetId(),
      this.getId()!,
      this.lobby.getHostInstance().getNextNetId(),
      this.lobby.getHostInstance().getNextNetId(),
      0,
      this.gameObject.customNetworkTransform.position,
      this.gameObject.customNetworkTransform.velocity,
    );

    this.gameObject.customNetworkTransform.position = new Vector2(-39, -39);

    const thisConnection = this.lobby.findConnectionByPlayer(this);

    if (!thisConnection) {
      throw new Error("Tried to respawn a player without a connection");
    }

    const oldName = this.getName();

    this.lobby.ignoredNetIds.push(
      this.gameObject.playerControl.netId,
      this.gameObject.playerPhysics.netId,
      this.gameObject.customNetworkTransform.netId,
    );

    this.setName("");

    if (thisConnection.isActingHost) {
      thisConnection.write(new RemovePlayerPacket(this.lobby.getCode(), this.gameObject.owner, this.gameObject.owner, DisconnectReason.serverRequest()));
      thisConnection.write(new JoinGameResponsePacket(this.lobby.getCode(), this.gameObject.owner, this.gameObject.owner));
    } else {
      thisConnection.write(new RemovePlayerPacket(this.lobby.getCode(), this.gameObject.owner, this.lobby.getHostInstance().getId(), DisconnectReason.serverRequest()));
      thisConnection.write(new JoinGameResponsePacket(this.lobby.getCode(), this.gameObject.owner, this.lobby.getHostInstance().getId()));
    }

    this.setName(oldName);

    const connections = this.lobby.getConnections();

    for (let i = 0; i < connections.length; i++) {
      const connection = connections[i];

      if (connection.id != this.gameObject.owner) {
        connection.write(new GameDataPacket([
          new DespawnPacket(this.gameObject.playerControl.netId),
          new DespawnPacket(this.gameObject.playerPhysics.netId),
          new DespawnPacket(this.gameObject.customNetworkTransform.netId),
        ], this.lobby.getCode()));
      }
    }

    this.getGameDataEntry().isDead = false;
    this.gameObject = entity;

    gameData.gameData.updateGameData([this.getGameDataEntry()], connections);

    this.lobby.sendRootGamePacket(new GameDataPacket([
      entity.serializeSpawn(),
    ], this.lobby.getCode()));

    return this;
  }

  sendChat(message: string): this {
    this.gameObject.playerControl.sendChat(message, this.lobby.getConnections());

    return this;
  }

  private getGameDataEntry(): PlayerData {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("Lobby has no GameData instance");
    }

    for (let i = 0; i < gameData.gameData.players.length; i++) {
      const player = gameData!.gameData.players[i];

      if (player.id == this.id) {
        return player;
      }
    }

    throw new Error("Player was not found in the lobby's GameData instance");
  }
}
