import { Level, PlayerColor, PlayerFlagMask, PlayerHat, PlayerPet, PlayerSkin } from "../../../../types/enums";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { LevelTask } from "../../../../types";
import { Tasks } from "../../../../static";

export class PlayerData {
  constructor(
    public readonly id: number,
    public name: string,
    public color: PlayerColor,
    public hat: PlayerHat,
    public pet: PlayerPet,
    public skin: PlayerSkin,
    public isDisconnected: boolean,
    public isImpostor: boolean,
    public isDead: boolean,
    public tasks: [task: LevelTask, isComplete: boolean][],
  ) {}

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

  isDoneWithTasks(): boolean {
    for (let i = 0; i < this.tasks.length; i++) {
      if (!this.tasks[i][1]) {
        return false;
      }
    }

    return true;
  }

  addTasks(tasks: Set<LevelTask>): void {
    const newTasks = [...this.tasks];

    for (let i = 0; i < tasks.size; i++) {
      if (this.tasks.findIndex(task => task[0] == tasks[i]) > -1) {
        continue;
      }

      newTasks.push(tasks[i]);
    }
  }

  removeTasks(tasks: Set<LevelTask>): void {
    for (let i = 0; i < tasks.size; i++) {
      const index = this.tasks.findIndex(task => task[0] == tasks[i]);

      if (index > -1) {
        this.tasks.splice(index, 1);
      }
    }
  }

  isTaskAtIndexCompleted(index: number): boolean {
    return this.tasks[index][1];
  }

  isTaskCompleted(task: LevelTask): boolean {
    const tasks = this.tasks;
    const index = tasks.findIndex(t => t[0] == task);

    if (index == -1) {
      return false;
    }

    return this.tasks[index][1];
  }

  completeTask(task: LevelTask, isComplete: boolean = true): boolean {
    const index = this.tasks.findIndex(t => t[0] == task);

    if (index == -1) {
      return false;
    }

    this.tasks[index][1] = isComplete;

    return true;
  }

  completeTaskAtIndex(index: number, isComplete: boolean = true): boolean {
    if (index < 0 || this.tasks.length < index) {
      return false;
    }

    this.tasks[index][1] = isComplete;

    return true;
  }

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
        (this.isDisconnected ? PlayerFlagMask.IsDisconnected : 0) |
        (this.isImpostor ? PlayerFlagMask.IsImpostor : 0) |
        (this.isDead ? PlayerFlagMask.IsDead : 0),
      )
      .writeList(this.tasks, (sub, task, i) => sub.writePackedUInt32(i).writeBoolean(task[1]));
  }
}
