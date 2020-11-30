import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerColor } from "../../../types/playerColor";
import { PlayerSkin } from "../../../types/playerSkin";
import { PlayerHat } from "../../../types/playerHat";
import { PlayerPet } from "../../../types/playerPet";

export enum PlayerFlags {
  IsDisconnected = 1 << 0,
  IsImpostor = 1 << 1,
  IsDead = 1 << 2,
}

export class PlayerData {
  constructor(
    readonly id: number,
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

  static deserialize(reader: MessageReader): PlayerData {
    const id = reader.readByte();
    const name = reader.readString();
    const color = reader.readPackedUInt32();
    const hat = reader.readPackedUInt32();
    const pet = reader.readPackedUInt32();
    const skin = reader.readPackedUInt32();
    const flags = reader.readByte();
    const isDisconnected = (flags & (1 << PlayerFlags.IsDisconnected)) == PlayerFlags.IsDisconnected;
    const isImpostor = (flags & (1 << PlayerFlags.IsImpostor)) == PlayerFlags.IsImpostor;
    const isDead = (flags & (1 << PlayerFlags.IsDead)) == PlayerFlags.IsDead;

    return new PlayerData(
      id, name, color, hat, pet, skin, isDisconnected, isImpostor, isDead,
      reader.readList(tasks => [tasks.readByte(), tasks.readBoolean()]),
    );
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.id)
      .writeString(this.name)
      .writePackedUInt32(this.color)
      .writePackedUInt32(this.hat)
      .writePackedUInt32(this.pet)
      .writePackedUInt32(this.skin)
      .writeByte(
        (this.isDisconnected ? PlayerFlags.IsDisconnected : 0) |
        (this.isImpostor ? PlayerFlags.IsImpostor : 0) |
        (this.isDead ? PlayerFlags.IsDead : 0),
      )
      .writeList(this.tasks, (sub, task) => {
        sub.writePackedUInt32(task[0]).writeBoolean(task[1]);
      });
  }
}
