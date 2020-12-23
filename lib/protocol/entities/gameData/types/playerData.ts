import { PlayerColor, PlayerFlagMask, PlayerHat, PlayerPet, PlayerSkin } from "../../../../types/enums";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";

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
    // TODO: TaskType or map-specific task type (e.g. PolusTask)
    public tasks: [number, boolean][],
  ) {}

  static deserialize(reader: MessageReader, tag?: number): PlayerData {
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
      reader.readList(tasks => [tasks.readByte(), tasks.readBoolean()]),
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

  completeTask(index: number, isComplete: boolean = true): void {
    this.tasks[index][1] = isComplete;
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
