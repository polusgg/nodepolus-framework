import { PlayerSkin, PlayerPet, PlayerHat, PlayerColor, PlayerRole, TeleportReason, SpawnFlag } from "../types/enums";
import { RemovePlayerPacket, JoinGameResponsePacket, GameDataPacket } from "../protocol/packets/root";
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
import { Lobby } from "../lobby";
import { Host } from "../host";
import {
  PlayerRevivedEvent,
  PlayerRoleUpdatedEvent,
  PlayerTaskAddedEvent,
  PlayerTaskRemovedEvent,
  PlayerTaskUncompletedEvent,
} from "../api/events/player";

export class Player implements PlayerInstance {
  protected readonly metadata: Map<string, unknown> = new Map();

  protected name: TextComponent;
  protected role: PlayerRole = PlayerRole.Crewmate;
  protected initialized = false;

  /**
   * @param lobby - The lobby in which the player exists
   * @param entity - The entity that belongs to the player
   * @param connection - The connection to which the player belongs
   */
  constructor(
    protected readonly lobby: Lobby,
    protected entity: EntityPlayer,
    protected readonly connection?: Connection,
  ) {
    this.name = TextComponent.from(connection?.getName() ?? "");
  }

  getId(): number {
    return this.entity.getPlayerControl().getPlayerId();
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
  getMeta<T = unknown>(key: string): T;
  getMeta<T = unknown>(key?: string): Map<string, unknown> | T {
    return key === undefined ? this.metadata : this.metadata.get(key) as T;
  }

  setMeta(pair: Record<string, unknown>): void;
  setMeta(key: string, value: unknown): void;
  setMeta(key: string | Record<string, unknown>, value?: unknown): void {
    if (typeof key === "string") {
      this.metadata.set(key, value);
    } else {
      for (const [k, v] of Object.entries(key)) {
        this.metadata.set(k, v);
      }
    }
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

    this.entity.getPlayerControl().setName(name.toString(), this.lobby.getConnections());

    return this;
  }

  getColor(): PlayerColor {
    return this.getGameDataEntry().getColor();
  }

  setColor(color: PlayerColor): this {
    this.entity.getPlayerControl().setColor(color, this.lobby.getConnections());

    return this;
  }

  getHat(): PlayerHat {
    return this.getGameDataEntry().getHat();
  }

  setHat(hat: PlayerHat): this {
    this.entity.getPlayerControl().handleSetHat(hat, this.lobby.getConnections());

    return this;
  }

  getPet(): PlayerPet {
    return this.getGameDataEntry().getPet();
  }

  setPet(pet: PlayerPet): this {
    this.entity.getPlayerControl().handleSetPet(pet, this.lobby.getConnections());

    return this;
  }

  getSkin(): PlayerSkin {
    return this.getGameDataEntry().getSkin();
  }

  setSkin(skin: PlayerSkin): this {
    this.entity.getPlayerControl().handleSetSkin(skin, this.lobby.getConnections());

    return this;
  }

  getRole(): PlayerRole {
    return this.role;
  }

  setRole(role: PlayerRole): this {
    this.role = role;

    this.getGameDataEntry().setImpostor(role == PlayerRole.Impostor);

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

    this.entity.getPlayerControl().sendRpcPacket(
      new SetInfectedPacket([this.getId()]),
      this.lobby.getConnections(),
    );
  }

  setCrewmate(): void {
    // TODO: Is this possible?
    this.lobby.getLogger().warn("PlayerInstance#setCrewmate() is not yet implemented");
  }

  isDead(): boolean {
    return this.getGameDataEntry().isDead();
  }

  getTasks(): [LevelTask, boolean][] {
    return this.getGameDataEntry().getTasks();
  }

  setTasks(tasks: Set<LevelTask>): this {
    this.lobby.getHostInstance().setPlayerTasks(this, [...tasks]);

    return this;
  }

  async addTasks(tasks: Set<LevelTask>): Promise<void> {
    const taskList = [...this.getGameDataEntry().getTasks()];

    for (let i = 0; i < tasks.size; i++) {
      if (taskList.findIndex(task => task[0] == tasks[i]) > -1) {
        continue;
      }

      taskList.push(tasks[i]);
    }

    const event = new PlayerTaskAddedEvent(this, tasks);

    await this.lobby.getServer().emit("player.task.added", event);

    if (!event.isCancelled()) {
      this.getGameDataEntry().setTasks(taskList);
      (this.lobby.getHostInstance() as Host).updatePlayerTasks(this, taskList.map(task => task[0]));
    }
  }

  async removeTasks(tasks: Set<LevelTask>): Promise<void> {
    const taskList = [...this.getGameDataEntry().getTasks()];

    for (let i = 0; i < tasks.size; i++) {
      const index = taskList.findIndex(task => task[0] == tasks[i]);

      if (index > -1) {
        taskList.splice(index, 1);
      }
    }

    const event = new PlayerTaskRemovedEvent(this, tasks);

    await this.lobby.getServer().emit("player.task.removed", event);

    if (!event.isCancelled()) {
      this.getGameDataEntry().setTasks(taskList);
      (this.lobby.getHostInstance() as Host).updatePlayerTasks(this, taskList.map(task => task[0]));
    }
  }

  isTaskAtIndexCompleted(taskIndex: number): boolean {
    return this.getGameDataEntry().isTaskAtIndexCompleted(taskIndex);
  }

  isTaskCompleted(task: LevelTask): boolean {
    return this.getGameDataEntry().isTaskCompleted(task);
  }

  completeTaskAtIndex(taskIndex: number): this {
    this.entity.getPlayerControl().handleCompleteTask(taskIndex, this.lobby.getConnections());

    return this;
  }

  completeTask(task: LevelTask): this {
    this.entity.getPlayerControl().handleCompleteTask(this.getTasks().findIndex(t => t[0] == task), this.lobby.getConnections());

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
    return this.entity.getCustomNetworkTransform().getPosition();
  }

  setPosition(position: Vector2, reason: TeleportReason = TeleportReason.Unknown): this {
    this.entity.getCustomNetworkTransform().snapTo(position, reason, this.lobby.getConnections());

    return this;
  }

  getVelocity(): Vector2 {
    return this.entity.getCustomNetworkTransform().getVelocity();
  }

  getVent(): LevelVent | undefined {
    return this.entity.getPlayerPhysics().getVent();
  }

  enterVent(vent: LevelVent): this {
    this.entity.getPlayerPhysics().enterVent(vent, this.lobby.getConnections());

    return this;
  }

  exitVent(vent: LevelVent): this {
    this.entity.getPlayerPhysics().exitVent(vent, this.lobby.getConnections());

    return this;
  }

  isScanning(): boolean {
    return this.entity.getPlayerControl().isScanning();
  }

  kill(): this {
    const gameData = this.getGameData();

    this.entity.getPlayerControl().exile();
    gameData.getGameData().updateGameData([this.getGameDataEntry()], this.lobby.getConnections());

    if (this.isImpostor()) {
      this.lobby.getHostInstance().handleImpostorDeath();
    } else {
      this.lobby.getHostInstance().handleMurderPlayer(this.entity.getPlayerControl(), 0);
    }

    return this;
  }

  murder(player: PlayerInstance): this {
    const playerControl = this.entity.getPlayerControl();

    playerControl.handleMurderPlayer((player as Player).entity.getPlayerControl().getNetId(), this.lobby.getConnections());
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
      this.entity.getOwnerId(),
      this.entity.getCustomNetworkTransform().getPosition(),
      this.entity.getCustomNetworkTransform().getVelocity(),
      this.getId()!,
      false,
      SpawnFlag.None,
    );

    if (this.connection === undefined) {
      throw new Error("Tried to respawn a player without a connection");
    }

    const oldName = this.getName();

    this.lobby.ignoreNetIds(
      this.entity.getPlayerControl().getNetId(),
      this.entity.getPlayerPhysics().getNetId(),
      this.entity.getCustomNetworkTransform().getNetId(),
    );

    this.setName("");

    if (this.connection.isActingHost()) {
      this.connection.writeReliable(new RemovePlayerPacket(this.lobby.getCode(), this.entity.getOwnerId(), this.entity.getOwnerId(), DisconnectReason.destroy()));
      this.connection.writeReliable(new JoinGameResponsePacket(this.lobby.getCode(), this.entity.getOwnerId(), this.entity.getOwnerId()));
    } else {
      this.connection.writeReliable(new RemovePlayerPacket(this.lobby.getCode(), this.entity.getOwnerId(), this.lobby.getHostInstance().getId(), DisconnectReason.destroy()));
      this.connection.writeReliable(new JoinGameResponsePacket(this.lobby.getCode(), this.entity.getOwnerId(), this.lobby.getHostInstance().getId()));
    }

    this.setName(oldName);

    const connections = this.lobby.getConnections();

    for (let i = 0; i < connections.length; i++) {
      const connection = connections[i];

      if (connection.getId() != this.entity.getOwnerId()) {
        connection.writeReliable(new GameDataPacket([
          new DespawnPacket(this.entity.getPlayerControl().getNetId()),
          new DespawnPacket(this.entity.getPlayerPhysics().getNetId()),
          new DespawnPacket(this.entity.getCustomNetworkTransform().getNetId()),
        ], this.lobby.getCode()));
      }
    }

    this.getGameDataEntry().setDead(false);

    this.entity = entity;

    gameData.getGameData().updateGameData([this.getGameDataEntry()], connections);

    this.lobby.sendRootGamePacket(new GameDataPacket([
      entity.serializeSpawn(),
    ], this.lobby.getCode()));
  }

  sendChat(message: string): this {
    this.entity.getPlayerControl().handleSendChat(message, this.lobby.getConnections());

    return this;
  }

  startMeeting(victim?: PlayerInstance): this {
    this.lobby.getHostInstance().handleReportDeadBody(this.entity.getPlayerControl(), victim?.getId());

    return this;
  }

  castVote(suspect?: PlayerInstance): this {
    const meetingHud = this.lobby.getMeetingHud();

    if (meetingHud !== undefined) {
      meetingHud.getMeetingHud().castVote(this.getId(), suspect?.getId() ?? -1);
    }

    return this;
  }

  clearVote(): this {
    const meetingHud = this.lobby.getMeetingHud();

    if (meetingHud !== undefined) {
      meetingHud.getMeetingHud().clearVote([this]);
    }

    return this;
  }

  castVotekick(target: PlayerInstance): this {
    this.getGameData().getVoteBanSystem().addVote(this, target as Player, this.lobby.getConnections());

    return this;
  }

  clearVotekick(target: PlayerInstance): this {
    this.getGameData().getVoteBanSystem().clearVote(this, target as Player, this.lobby.getConnections());

    return this;
  }

  clearVotekicksForMe(): this {
    this.getGameData().getVoteBanSystem().clearVotesForPlayer(this, this.lobby.getConnections());

    return this;
  }

  clearVotekicksFromMe(): this {
    this.getGameData().getVoteBanSystem().clearVotesFromPlayer(this, this.lobby.getConnections());

    return this;
  }

  kick(reason?: DisconnectReason): this {
    if (this.connection === undefined) {
      throw new Error(`Player ${this.getId()} does not have a connection on the lobby instance`);
    }

    this.connection.sendKick(false, undefined, reason);

    return this;
  }

  ban(reason?: DisconnectReason): this {
    if (this.connection === undefined) {
      throw new Error(`Player ${this.getId()} does not have a connection on the lobby instance`);
    }

    this.connection.sendKick(true, undefined, reason);

    return this;
  }

  getGameDataEntry(): PlayerData {
    const data = this.getGameData().getGameData().getPlayer(this.getId());

    if (data === undefined) {
      throw new Error(`Player ${this.getId()} does not have a PlayerData instance in GameData`);
    }

    return data;
  }

  updateGameData(): void {
    this.getGameData().getGameData().updateGameData([this.getGameDataEntry()], this.lobby.getConnections());
  }

  /**
   * Gets the player's entity containing their PlayerControl, PlayerPhysics, and
   * CustomNetworkTransform InnerNetObjects.
   *
   * @internal
   */
  getEntity(): EntityPlayer {
    return this.entity;
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
   * @param initialized - `true` if the player has been initialized, `false` if not
   */
  setInitialized(initialized: boolean): this {
    this.initialized = initialized;

    return this;
  }

  /**
   * Gets the GameData instance from the player's lobby.
   *
   * @internal
   */
  protected getGameData(): EntityGameData {
    const gameData = this.lobby.getGameData();

    if (gameData === undefined) {
      throw new Error("Lobby does not have a GameData instance");
    }

    return gameData;
  }
}
