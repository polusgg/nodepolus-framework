import { RemovePlayerPacket, JoinGameResponsePacket, GameDataPacket } from "../protocol/packets/root";
import { PlayerSkin, PlayerPet, PlayerHat, PlayerColor, PlayerRole } from "../types/enums";
import { DisconnectReason, LevelTask, LevelVent, Vector2 } from "../types";
import { PlayerData } from "../protocol/entities/gameData/types";
import { EntityGameData } from "../protocol/entities/gameData";
import { DespawnPacket } from "../protocol/packets/gameData";
import { SetInfectedPacket } from "../protocol/packets/rpc";
import { EntityPlayer } from "../protocol/entities/player";
import { Connection } from "../protocol/connection";
import { PlayerInstance } from "../api/player";
import { LobbyInstance } from "../api/lobby";
import { TextComponent } from "../api/text";
import { InternalLobby } from "../lobby";
import { InternalHost } from "../host";
import {
  PlayerRevivedEvent,
  PlayerRoleUpdatedEvent,
  PlayerTaskAddedEvent,
  PlayerTaskRemovedEvent,
  PlayerTaskUncompletedEvent,
} from "../api/events/player";

export class InternalPlayer implements PlayerInstance {
  private readonly id: number;
  private readonly metadata: Map<string, unknown> = new Map();

  private name: TextComponent;
  private role: PlayerRole = PlayerRole.Crewmate;
  private initialized = false;

  /**
   * @param lobby The lobby in which the player exists
   * @param entity The entity that belongs to the player
   * @param connection The connection to which the player belongs
   */
  constructor(
    public lobby: InternalLobby,
    public entity: EntityPlayer,
    private readonly connection?: Connection,
  ) {
    this.id = entity.playerControl.playerId;
    this.name = TextComponent.from(connection?.getName() ?? "");
  }

  getId(): number {
    return this.id;
  }

  getConnection(): Connection | undefined {
    return this.connection;
  }

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  hasMeta(key: string): boolean {
    return this.metadata.has(key);
  }

  getMeta(): Map<string, unknown>;
  getMeta(key: string): unknown;
  getMeta(key?: string): Map<string, unknown> | unknown {
    return key === undefined ? this.metadata : this.metadata.get(key);
  }

  setMeta(key: string, value: unknown): void {
    this.metadata.set(key, value);
  }

  deleteMeta(key: string): void {
    this.metadata.delete(key);
  }

  clearMeta(): void {
    this.metadata.clear();
  }

  getName(): TextComponent {
    return this.name;
  }

  setName(name: TextComponent | string): this {
    if (name instanceof TextComponent) {
      this.name = name;
    } else {
      this.name = TextComponent.from(name);
    }

    this.entity.playerControl.setName(name.toString(), this.lobby.getConnections());

    return this;
  }

  getColor(): PlayerColor {
    return this.getGameDataEntry().color;
  }

  setColor(color: PlayerColor): this {
    this.entity.playerControl.setColor(color, this.lobby.getConnections());

    return this;
  }

  getHat(): PlayerHat {
    return this.getGameDataEntry().hat;
  }

  setHat(hat: PlayerHat): this {
    this.entity.playerControl.setHat(hat, this.lobby.getConnections());

    return this;
  }

  getPet(): PlayerPet {
    return this.getGameDataEntry().pet;
  }

  setPet(pet: PlayerPet): this {
    this.entity.playerControl.setPet(pet, this.lobby.getConnections());

    return this;
  }

  getSkin(): PlayerSkin {
    return this.getGameDataEntry().skin;
  }

  setSkin(skin: PlayerSkin): this {
    this.entity.playerControl.setSkin(skin, this.lobby.getConnections());

    return this;
  }

  getRole(): PlayerRole {
    return this.role;
  }

  setRole(role: PlayerRole): this {
    this.role = role;
    this.getGameDataEntry().isImpostor = role == PlayerRole.Impostor;

    return this;
  }

  isImpostor(): boolean {
    // return this.getGameDataEntry().isImpostor;
    return this.role == PlayerRole.Impostor;
  }

  async setImpostor(): Promise<void> {
    if (this.isImpostor()) {
      return;
    }

    const event = new PlayerRoleUpdatedEvent(this, PlayerRole.Impostor, this.role);

    await this.lobby.getServer().emit("player.role.updated", event);

    if (event.isCancelled()) {
      return;
    }

    // TODO: Check end state
    // TODO: Send UpdateGameData packet

    this.entity.playerControl.sendRPCPacketTo(
      this.lobby.getConnections(),
      new SetInfectedPacket([this.id]),
    );
  }

  setCrewmate(): void {
    throw new Error("TODO: Not yet implemented (is it even possible?)");
  }

  isDead(): boolean {
    return this.getGameDataEntry().isDead;
  }

  getTasks(): [LevelTask, boolean][] {
    return this.getGameDataEntry().tasks;
  }

  setTasks(tasks: Set<LevelTask>): this {
    this.lobby.getHostInstance().setPlayerTasks(this, [...tasks]);

    return this;
  }

  async addTasks(tasks: Set<LevelTask>): Promise<void> {
    const taskList = [...this.getGameDataEntry().tasks];

    for (let i = 0; i < tasks.size; i++) {
      if (taskList.findIndex(task => task[0] == tasks[i]) > -1) {
        continue;
      }

      taskList.push(tasks[i]);
    }

    const event = new PlayerTaskAddedEvent(this, tasks);

    await this.lobby.getServer().emit("player.task.added", event);

    if (!event.isCancelled()) {
      this.getGameDataEntry().tasks = taskList;

      (this.lobby.getHostInstance() as InternalHost).updatePlayerTasks(this, taskList.map(task => task[0]));
    }
  }

  async removeTasks(tasks: Set<LevelTask>): Promise<void> {
    const taskList = [...this.getGameDataEntry().tasks];

    for (let i = 0; i < tasks.size; i++) {
      const index = taskList.findIndex(task => task[0] == tasks[i]);

      if (index > -1) {
        taskList.splice(index, 1);
      }
    }

    const event = new PlayerTaskRemovedEvent(this, tasks);

    await this.lobby.getServer().emit("player.task.removed", event);

    if (!event.isCancelled()) {
      this.getGameDataEntry().tasks = taskList;

      (this.lobby.getHostInstance() as InternalHost).updatePlayerTasks(this, taskList.map(task => task[0]));
    }
  }

  isTaskAtIndexCompleted(taskIndex: number): boolean {
    return this.getGameDataEntry().isTaskAtIndexCompleted(taskIndex);
  }

  isTaskCompleted(task: LevelTask): boolean {
    return this.getGameDataEntry().isTaskCompleted(task);
  }

  completeTaskAtIndex(taskIndex: number): this {
    this.lobby.getHostInstance().handleCompleteTask(this.entity.playerControl, taskIndex);

    return this;
  }

  completeTask(task: LevelTask): this {
    this.lobby.getHostInstance().handleCompleteTask(this.entity.playerControl, this.getTasks().findIndex(t => t[0] == task));

    return this;
  }

  async uncompleteTaskAtIndex(taskIndex: number): Promise<void> {
    const task = this.getTasks()[taskIndex][0];
    const event = new PlayerTaskUncompletedEvent(this, taskIndex, task);

    await this.lobby.getServer().emit("player.task.uncompleted", event);

    if (!event.isCancelled()) {
      this.getGameDataEntry().completeTaskAtIndex(taskIndex, false);
    }
  }

  async uncompleteTask(task: LevelTask): Promise<void> {
    const taskIndex = this.getTasks().findIndex(t => t[0] == task);
    const event = new PlayerTaskUncompletedEvent(this, taskIndex, task);

    await this.lobby.getServer().emit("player.task.uncompleted", event);

    if (!event.isCancelled()) {
      this.getGameDataEntry().completeTask(task, false);
    }
  }

  getPosition(): Vector2 {
    return this.entity.customNetworkTransform.position;
  }

  setPosition(position: Vector2): this {
    this.entity.customNetworkTransform.snapTo(position, this.lobby.getConnections());

    return this;
  }

  getVelocity(): Vector2 {
    return this.entity.customNetworkTransform.velocity;
  }

  getVent(): LevelVent | undefined {
    return this.entity.playerPhysics.getVent();
  }

  enterVent(vent: LevelVent): this {
    this.entity.playerPhysics.enterVent(vent, this.lobby.getConnections());

    return this;
  }

  exitVent(vent: LevelVent): this {
    this.entity.playerPhysics.exitVent(vent, this.lobby.getConnections());

    return this;
  }

  isScanning(): boolean {
    // TODO: set via scanning events
    return false;
  }

  kill(): this {
    const gameData = this.getGameData();

    this.entity.playerControl.exile();

    gameData.gameData.updateGameData([
      this.getGameDataEntry(),
    ], this.lobby.getConnections());

    if (this.isImpostor()) {
      this.lobby.getHostInstance().handleImpostorDeath();
    } else {
      this.lobby.getHostInstance().handleMurderPlayer(this.entity.playerControl, 0);
    }

    return this;
  }

  murder(player: PlayerInstance): this {
    const playerControl = this.entity.playerControl;

    playerControl.murderPlayer((player as InternalPlayer).entity.playerControl.netId, this.lobby.getConnections());
    this.lobby.getHostInstance().handleMurderPlayer(playerControl, 0);

    return this;
  }

  async revive(): Promise<void> {
    const gameData = this.getGameData();

    const event = new PlayerRevivedEvent(this);

    await this.lobby.getServer().emit("player.revived", event);

    if (event.isCancelled()) {
      return;
    }

    const entity = new EntityPlayer(
      this.lobby,
      this.entity.owner,
      this.lobby.getHostInstance().getNextNetId(),
      this.getId()!,
      this.lobby.getHostInstance().getNextNetId(),
      this.lobby.getHostInstance().getNextNetId(),
      0,
      this.entity.customNetworkTransform.position,
      this.entity.customNetworkTransform.velocity,
    );

    if (this.connection === undefined) {
      throw new Error("Tried to respawn a player without a connection");
    }

    const oldName = this.getName();

    this.lobby.ignoredNetIds.push(
      this.entity.playerControl.netId,
      this.entity.playerPhysics.netId,
      this.entity.customNetworkTransform.netId,
    );

    this.setName("");

    if (this.connection.isActingHost) {
      this.connection.writeReliable(new RemovePlayerPacket(this.lobby.getCode(), this.entity.owner, this.entity.owner, DisconnectReason.serverRequest()));
      this.connection.writeReliable(new JoinGameResponsePacket(this.lobby.getCode(), this.entity.owner, this.entity.owner));
    } else {
      this.connection.writeReliable(new RemovePlayerPacket(this.lobby.getCode(), this.entity.owner, this.lobby.getHostInstance().getId(), DisconnectReason.serverRequest()));
      this.connection.writeReliable(new JoinGameResponsePacket(this.lobby.getCode(), this.entity.owner, this.lobby.getHostInstance().getId()));
    }

    this.setName(oldName);

    const connections = this.lobby.getConnections();

    for (let i = 0; i < connections.length; i++) {
      const connection = connections[i];

      if (connection.id != this.entity.owner) {
        connection.writeReliable(new GameDataPacket([
          new DespawnPacket(this.entity.playerControl.netId),
          new DespawnPacket(this.entity.playerPhysics.netId),
          new DespawnPacket(this.entity.customNetworkTransform.netId),
        ], this.lobby.getCode()));
      }
    }

    this.getGameDataEntry().isDead = false;
    this.entity = entity;

    gameData.gameData.updateGameData([this.getGameDataEntry()], connections);

    this.lobby.sendRootGamePacket(new GameDataPacket([
      entity.serializeSpawn(),
    ], this.lobby.getCode()));
  }

  sendChat(message: string): this {
    this.entity.playerControl.sendChat(message, this.lobby.getConnections());

    return this;
  }

  startMeeting(victim?: PlayerInstance): this {
    this.lobby.getHostInstance().handleReportDeadBody(this.entity.playerControl, victim?.getId());

    return this;
  }

  castVote(suspect?: PlayerInstance): this {
    const meetingHud = this.lobby.getMeetingHud();

    if (meetingHud) {
      meetingHud.meetingHud.castVote(this.id, suspect?.getId() ?? -1);
    }

    return this;
  }

  clearVote(): this {
    const meetingHud = this.lobby.getMeetingHud();

    if (meetingHud) {
      meetingHud.meetingHud.clearVote([this]);
    }

    return this;
  }

  castVotekick(target: PlayerInstance): this {
    this.getGameData().voteBanSystem.addVote(this, target as InternalPlayer, this.lobby.getConnections());

    return this;
  }

  clearVotekick(target: PlayerInstance): this {
    this.getGameData().voteBanSystem.clearVote(this, target as InternalPlayer, this.lobby.getConnections());

    return this;
  }

  clearVotekicksForMe(): this {
    this.getGameData().voteBanSystem.clearVotesForPlayer(this, this.lobby.getConnections());

    return this;
  }

  clearVotekicksFromMe(): this {
    this.getGameData().voteBanSystem.clearVotesFromPlayer(this, this.lobby.getConnections());

    return this;
  }

  kick(reason?: DisconnectReason): this {
    if (this.connection === undefined) {
      throw new Error(`Player ${this.id} does not have a connection on the lobby instance`);
    }

    this.connection.sendKick(false, undefined, reason);

    return this;
  }

  ban(reason?: DisconnectReason): this {
    if (this.connection === undefined) {
      throw new Error(`Player ${this.id} does not have a connection on the lobby instance`);
    }

    this.connection.sendKick(true, undefined, reason);

    return this;
  }

  getGameDataEntry(): PlayerData {
    const gameData = this.getGameData();

    for (let i = 0; i < gameData.gameData.players.length; i++) {
      const player = gameData!.gameData.players[i];

      if (player.id == this.id) {
        return player;
      }
    }

    throw new Error(`Player ${this.id} does not have a PlayerData instance in GameData`);
  }

  updateGameData(): void {
    this.getGameData().gameData.updateGameData([this.getGameDataEntry()], this.lobby.getConnections());
  }

  /**
   * Gets whether or not the player has been successfully initialized by the
   * connection and server.
   *
   * @internal
   */
  hasBeenInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Sets whether or not the player has been successfully initialized by the
   * connection and server.
   *
   * @internal
   * @param initialized `true` if the player has been initialized, `false` if not
   */
  setInitialized(initialized: boolean): void {
    this.initialized = initialized;
  }

  /**
   * Gets the GameData instance from the player's lobby.
   *
   * @internal
   */
  private getGameData(): EntityGameData {
    const gameData = this.lobby.getGameData();

    if (!gameData) {
      throw new Error("Lobby does not have a GameData instance");
    }

    return gameData;
  }
}
