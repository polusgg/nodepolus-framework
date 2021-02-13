import { PlayerColor, PlayerHat, PlayerPet, PlayerRole, PlayerSkin } from "../../types/enums";
import { DisconnectReason, LevelTask, LevelVent, Vector2 } from "../../types";
import { PlayerData } from "../../protocol/entities/gameData/types";
import { Connection } from "../../protocol/connection";
import { LobbyInstance } from "../lobby";
import { TextComponent } from "../text";

/**
 * An interface describing the public API of players inside a LobbyInstance.
 */
export interface PlayerInstance {
  /**
   * Gets the ID of the player character.
   */
  getId(): number;

  /**
   * Gets the connection to which the player belongs.
   */
  getConnection(): Connection | undefined;

  /**
   * Gets the lobby in which the player exists.
   */
  getLobby(): LobbyInstance;

  /**
   * Gets whether or not the player has metadata for the given key.
   *
   * @param key The metadata key
   */
  hasMeta(key: string): boolean;

  /**
   * Gets all of the metadata associated with the player.
   */
  getMeta(): Map<string, unknown>;

  /**
   * Gets the metadata for the given key.
   *
   * @typeParam T The type of the returned metadata (default `unknown`)
   * @param key The key whose associated metadata will be returned
   * @returns The metadata, or `undefined` if no metadata is associated with `key`
   */
  getMeta<T = unknown>(key: string): T;

  /**
   * Gets the metadata for the given key, or all of the metadata associated
   * with the player.
   *
   * @typeParam T The type of the returned metadata (default `unknown`)
   * @param key The key whose associated data will be returned, or `undefined` to return all metadata
   * @returns The metadata, or `undefined` if no metadata is associated with `key`
   */
  getMeta<T = unknown>(key?: string): Map<string, unknown> | T;

  /**
   * Sets the metadata for the given key-value pairs.
   *
   * @param pair The key-value metadata pairs to be set
   */
  setMeta(pair: Record<string, unknown>): void;
  /**
   * Sets the metadata for the given key.
   *
   * @param key The key whose metadata will be set
   * @param value The metadata to be set
   */
  setMeta(key: string, value: unknown): void;
  /**
   * Sets the metadata for the given key or key-value pairs.
   *
   * @param key The key whose metadata will be set, or the key-value metadata pairs to be set
   * @param value The metadata to be set if `key` is a `string`
   */
  setMeta(key: string | Record<string, unknown>, value?: unknown): void;

  /**
   * Deletes the metadata for the given key.
   *
   * @param key The key whose metatada will be deleted
   */
  deleteMeta(key: string): void;

  /**
   * Deletes all metadata associated with the player.
   */
  clearMeta(): void;

  /**
   * Gets the player's name.
   */
  getName(): TextComponent;

  /**
   * Sets the player's name.
   *
   * @param name The player's new name
   */
  setName(name: TextComponent | string): this;

  /**
   * Gets the player's color.
   */
  getColor(): PlayerColor;

  /**
   * Sets the player's color.
   *
   * @param color The player's new color
   */
  setColor(color: PlayerColor): this;

  /**
   * Gets the player's hat.
   */
  getHat(): PlayerHat;

  /**
   * Sets the player's hat.
   *
   * @param hat The player's new hat
   */
  setHat(hat: PlayerHat): this;

  /**
   * Gets the player's pet.
   */
  getPet(): PlayerPet;

  /**
   * Sets the player's pet.
   *
   * @param pet The player's new pet
   */
  setPet(pet: PlayerPet): this;

  /**
   * Gets the player's skin.
   */
  getSkin(): PlayerSkin;

  /**
   * Sets the player's skin.
   *
   * @param skin The player's new skin
   */
  setSkin(skin: PlayerSkin): this;

  /**
   * Gets the player's role.
   */
  getRole(): PlayerRole;

  /**
   * Sets the player's role.
   *
   * @experimental
   * @param role The player's new role
   */
  setRole(role: PlayerRole): this;

  /**
   * Gets whether or not the player is an Impostor.
   *
   * @returns `true` if the player is an Impostor
   */
  isImpostor(): boolean;

  /**
   * Sets the player's role to Impostor.
   */
  setImpostor(): void;

  /**
   * Sets the player's role to Crewmate.
   *
   * @experimental
   */
  setCrewmate(): void;

  /**
   * Gets whether or not the player is dead.
   *
   * @returns `true` if the player is dead, `false` if not
   */
  isDead(): boolean;

  /**
   * Gets the player's tasks.
   */
  getTasks(): [LevelTask, boolean][];

  /**
   * Sets the player's tasks.
   *
   * @param tasks The player's new tasks
   */
  setTasks(tasks: Set<LevelTask>): this;

  /**
   * Adds the given tasks to the player's tasks.
   *
   * @param tasks The tasks to be added
   */
  addTasks(tasks: Set<LevelTask>): void;

  /**
   * Removes the given tasks from the player's tasks.
   *
   * @param tasks The tasks to be removed
   */
  removeTasks(tasks: Set<LevelTask>): void;

  /**
   * Gets whether or not the player has completed the task at the given index.
   *
   * @param taskIndex The index whose task completion state will be checked
   * @returns `true` if the task at position `index` is completed, `false` if not
   */
  isTaskAtIndexCompleted(taskIndex: number): boolean;

  /**
   * Gets whether or not the player has completed the given task.
   *
   * @param task The task whose completion state will be checked
   * @returns `true` if the `task` is completed, `false` if not
   */
  isTaskCompleted(task: LevelTask): boolean;

  /**
   * Marks the task at the given index as complete for the player.
   *
   * @param taskIndex The index whose task will be marked as complete
   */
  completeTaskAtIndex(taskIndex: number): this;

  /**
   * Marks the given task as complete for the player.
   *
   * @param task The task to marked as complete
   */
  completeTask(task: LevelTask): this;

  /**
   * Marks the task at the given index as incomplete for the player.
   *
   * @param taskIndex The index whose task will be marked as incomplete
   */
  uncompleteTaskAtIndex(taskIndex: number): void;

  /**
   * Marks the given task as incomplete for the player.
   *
   * @param task The task to marked as incomplete
   */
  uncompleteTask(task: LevelTask): void;

  /**
   * Gets the player's position.
   */
  getPosition(): Vector2;

  /**
   * Sets the player's position.
   *
   * @param position The player's new position
   */
  setPosition(position: Vector2): this;

  /**
   * Gets the player's velocity.
   */
  getVelocity(): Vector2;

  /**
   * Gets the vent in which the player is hiding.
   *
   * @returns The vent in which the player is hiding, or `undefined` if they are not in a vent
   */
  getVent(): LevelVent | undefined;

  /**
   * Forces the player to enter the given vent.
   *
   * @experimental
   * @param vent The vent to be entered
   */
  enterVent(vent: LevelVent): this;

  /**
   * Forces the player to exit the given vent.
   *
   * @experimental
   * @param vent The vent to be exited
   */
  exitVent(vent: LevelVent): this;

  /**
   * Gets whether or not the player is getting scanned on a Medbay scanner.
   *
   * @returns `true` if the player is getting scanned, `false` if not
   */
  isScanning(): boolean;

  /**
   * Kills the player with no animation or body.
   */
  kill(): this;

  /**
   * Kills the player as though they were murdered by the given player.
   *
   * @param player The player whose character will show in the kill animation
   */
  murder(player: PlayerInstance): this;

  /**
   * Revives the player.
   */
  revive(): void;

  /**
   * Forces the player to send a message.
   *
   * @param message The message to be sent
   */
  sendChat(message: string): this;

  /**
   * Forces the player to call an emergency meeting.
   *
   * @param victim The body to be reported, or `undefined` to call an emergency meeting (default `undefined`)
   */
  startMeeting(victim?: PlayerInstance): this;

  /**
   * Forces the player to cast a vote to exile the given player.
   *
   * @param suspect The player to be voted for, or `undefined` to vote to skip (default `undefined)
   */
  castVote(suspect?: PlayerInstance): this;

  /**
   * Clears the player's vote during a meeting.
   */
  clearVote(): this;

  /**
   * Forces the player to cast a vote to kick the given player from the lobby.
   *
   * @param target The player who will be voted to be kicked from the lobby
   */
  castVotekick(target: PlayerInstance): this;

  /**
   * Clears the player's vote to kick the given player from the lobby.
   *
   * @param target The player whose vote to kick from the lobby will be cleared
   */
  clearVotekick(target: PlayerInstance): this;

  /**
   * Clears all of the player's votes to kick other players from the lobby.
   */
  clearVotekicksForMe(): this;

  /**
   * Clears all other player's votes to kick the player from the lobby.
   */
  clearVotekicksFromMe(): this;

  /**
   * Kicks the player from the lobby.
   *
   * @param reason The reason for why the player was kicked
   */
  kick(reason?: DisconnectReason): this;

  /**
   * Bans the player from the lobby.
   *
   * @param reason The reason for why the player was banned
   */
  ban(reason?: DisconnectReason): this;

  /**
   * Gets the player's PlayerData object from the GameData instance.
   */
  getGameDataEntry(): PlayerData;

  /**
   * Updates the player's PlayerData object in the GameData instance.
   */
  updateGameData(): void;
}
