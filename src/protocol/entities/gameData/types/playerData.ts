import { Level, PlayerColor, PlayerFlagMask, PlayerHat, PlayerPet, PlayerSkin } from "../../../../types/enums";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { CanSerializeToHazel, LevelTask } from "../../../../types";
import { Tasks } from "../../../../static";

/**
 * A class used to store and modify a player's game data.
 */
export class PlayerData implements CanSerializeToHazel {
  /**
   * @param id - The ID of the player
   * @param name - The player's name
   * @param color - The player's color
   * @param hat - The player's hat
   * @param pet - The player's pet
   * @param skin - The player's skin
   * @param disconnected - `true` if the player has disconnected, `false` if not
   * @param impostor - `true` if the player is an impostor, `false` if not
   * @param dead - `true` if the player is dead, `false` if not
   * @param tasks - The player's task list
   */
  constructor(
    protected readonly id: number,
    protected name: string,
    protected color: PlayerColor,
    protected hat: PlayerHat,
    protected pet: PlayerPet,
    protected skin: PlayerSkin,
    protected disconnected: boolean,
    protected impostor: boolean,
    protected dead: boolean,
    protected tasks: [task: LevelTask, isComplete: boolean][],
  ) {}

  /**
   * Gets a new PlayerData by reading from the given MessageReader.
   *
   * @param reader - The MessageReader to read from
   */
  static deserialize(reader: MessageReader, level: Level, tag?: number): PlayerData {
    const id = tag ?? reader.readByte();
    const name = reader.readString();
    const color = reader.readPackedUInt32();
    const hat = reader.readPackedUInt32();
    const pet = reader.readPackedUInt32();
    const skin = reader.readPackedUInt32();
    const flags = reader.readByte();
    const isDisconnected = (flags & PlayerFlagMask.IsDisconnected) == PlayerFlagMask.IsDisconnected;
    const isImpostor = (flags & PlayerFlagMask.IsImpostor) == PlayerFlagMask.IsImpostor;
    const isDead = (flags & PlayerFlagMask.IsDead) == PlayerFlagMask.IsDead;

    return new PlayerData(
      id, name, color, hat, pet, skin, isDisconnected, isImpostor, isDead,
      reader.readList(list => [Tasks.forLevelFromId(level, [list.readByte()])[0], list.readBoolean()]),
    );
  }

  /**
   * Gets the ID of the player.
   */
  getId(): number {
    return this.id;
  }

  /**
   * Gets the player's name.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Sets the player's name.
   *
   * @param name - The player's new name
   */
  setName(name: string): this {
    this.name = name;

    return this;
  }

  /**
   * Gets the player's color.
   */
  getColor(): PlayerColor {
    return this.color;
  }

  /**
   * Sets the player's color.
   *
   * @param color - The player's new color
   */
  setColor(color: PlayerColor): this {
    this.color = color;

    return this;
  }

  /**
   * Gets the player's hat.
   */
  getHat(): PlayerHat {
    return this.hat;
  }

  /**
   * Sets the player's hat.
   *
   * @param hat - The player's new hat
   */
  setHat(hat: PlayerHat): this {
    this.hat = hat;

    return this;
  }

  /**
   * Gets the player's pet.
   */
  getPet(): PlayerPet {
    return this.pet;
  }

  /**
   * Sets the player's pet.
   *
   * @param pet - The player's new pet
   */
  setPet(pet: PlayerPet): this {
    this.pet = pet;

    return this;
  }

  /**
   * Gets the player's skin.
   */
  getSkin(): PlayerSkin {
    return this.skin;
  }

  /**
   * Sets the player's skin.
   *
   * @param skin - The player's new skin
   */
  setSkin(skin: PlayerSkin): this {
    this.skin = skin;

    return this;
  }

  isDisconnected(): boolean {
    return this.disconnected;
  }

  setDisconnected(disconnected: boolean): this {
    this.disconnected = disconnected;

    return this;
  }

  /**
   * Gets whether or not the player is an impostor.
   *
   * @returns `true` if the player is an impostor, `false` if not
   */
  isImpostor(): boolean {
    return this.impostor;
  }

  /**
   * Sets whether or not the player is an impostor.
   *
   * @param impostor - `true` if the player is an impostor, `false` if not
   */
  setImpostor(impostor: boolean): this {
    this.impostor = impostor;

    return this;
  }

  /**
   * Gets whether or not the player is dead.
   *
   * @returns `true` if the player is dead, `false` if not
   */
  isDead(): boolean {
    return this.dead;
  }

  /**
   * Sets whether or not the player is dead.
   *
   * @param dead - `true` if the player is dead, `false` if not
   */
  setDead(dead: boolean): this {
    this.dead = dead;

    return this;
  }

  getTasks(): [task: LevelTask, isComplete: boolean][] {
    return this.tasks;
  }

  setTasks(tasks: [task: LevelTask, isComplete: boolean][]): this {
    this.tasks = tasks;

    return this;
  }

  /**
   * Gets whether or not the player is done with their tasks.
   *
   * @returns `true` if the player is done with their tasks, `false` if not
   */
  isDoneWithTasks(): boolean {
    for (let i = 0; i < this.tasks.length; i++) {
      if (!this.tasks[i][1]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Adds the given tasks to the player's task list.
   *
   * @param tasks - The tasks to be added
   */
  addTasks(tasks: Set<LevelTask>): this {
    const newTasks = [...this.tasks];

    for (let i = 0; i < tasks.size; i++) {
      if (this.tasks.findIndex(task => task[0] == tasks[i]) > -1) {
        continue;
      }

      newTasks.push(tasks[i]);
    }

    return this;
  }

  /**
   * Removes the given tasks from the player's task list.
   *
   * @param tasks - The tasks to be removed
   */
  removeTasks(tasks: Set<LevelTask>): this {
    for (let i = 0; i < tasks.size; i++) {
      const index = this.tasks.findIndex(task => task[0] == tasks[i]);

      if (index > -1) {
        this.tasks.splice(index, 1);
      }
    }

    return this;
  }

  /**
   * Gets whether or not the task at the given index is completed.
   *
   * @param index - The index of the task to be checked
   * @returns `true` if the task is completed, `false` if not
   */
  isTaskAtIndexCompleted(index: number): boolean {
    return this.tasks[index][1];
  }

  /**
   * Gets whether or not the given task is completed.
   *
   * @param index - The task to be checked
   * @returns `true` if the task is completed, `false` if not
   */
  isTaskCompleted(task: LevelTask): boolean {
    const tasks = this.tasks;
    const index = tasks.findIndex(t => t[0] == task);

    if (index == -1) {
      return false;
    }

    return this.tasks[index][1];
  }

  /**
   * Updates the completed state of the task at the given index.
   *
   * @param task - The index of the task whose completed state will be updated
   * @param isComplete - `true` if the task is completed, `false` if not (default `true`)
   * @returns `true` if the task was updated, `false` if not
   */
  completeTaskAtIndex(index: number, isComplete: boolean = true): boolean {
    if (index < 0 || this.tasks.length < index) {
      return false;
    }

    this.tasks[index][1] = isComplete;

    return true;
  }

  /**
   * Updates the completed state of the given task.
   *
   * @param task - The task whose completed state will be updated
   * @param isComplete - `true` if the task is completed, `false` if not (default `true`)
   * @returns `true` if the task was updated, `false` if not
   */
  completeTask(task: LevelTask, isComplete: boolean = true): boolean {
    const index = this.tasks.findIndex(t => t[0] == task);

    if (index == -1) {
      return false;
    }

    this.tasks[index][1] = isComplete;

    return true;
  }

  /**
   * Writes the PlayerData to the given MessageWriter
   *
   * @param writer - The MessageWriter to write to
   */
  serialize(writer: MessageWriter, includeId: boolean = true): void {
    if (includeId) {
      writer.writeByte(this.id);
    }

    writer.writeString(this.name)
      .writePackedUInt32(this.color)
      .writePackedUInt32(this.hat)
      .writePackedUInt32(this.pet)
      .writePackedUInt32(this.skin)
      .writeByte(
        (this.disconnected ? PlayerFlagMask.IsDisconnected : 0) |
        (this.impostor ? PlayerFlagMask.IsImpostor : 0) |
        (this.dead ? PlayerFlagMask.IsDead : 0),
      )
      .writeList(this.tasks, (sub, task, i) => sub.writePackedUInt32(i).writeBoolean(task[1]));
  }

  /**
   * Gets a clone of the PlayerData instance.
   */
  clone(): PlayerData {
    return new PlayerData(
      this.id,
      this.name,
      this.color,
      this.hat,
      this.pet,
      this.skin,
      this.disconnected,
      this.impostor,
      this.dead,
      [...this.tasks],
    );
  }
}
