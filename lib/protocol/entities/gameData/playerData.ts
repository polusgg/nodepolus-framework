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
    public readonly id: number,
    public name: string,
    public color: PlayerColor,
    public hat: PlayerHat,
    public pet: PlayerPet,
    public skin: PlayerSkin,
    public isDisconnected: boolean,
    public isImpostor: boolean,
    public isDead: boolean,
    public tasks: [number, boolean][], // TODO: TaskType or map-specific task type (e.g. PolusTask)
  ) {}

  static deserialize(reader: MessageReader): PlayerData {
    let id = reader.readByte();
    let name = reader.readString();
    let color = reader.readPackedUInt32();
    let hat = reader.readPackedUInt32();
    let pet = reader.readPackedUInt32();
    let skin = reader.readPackedUInt32();
    let flags = reader.readByte();
    let isDisconnected = (flags & (1 << PlayerFlags.IsDisconnected)) == PlayerFlags.IsDisconnected;
    let isImpostor = (flags & (1 << PlayerFlags.IsImpostor)) == PlayerFlags.IsImpostor;
    let isDead = (flags & (1 << PlayerFlags.IsDead)) == PlayerFlags.IsDead;

    return new PlayerData(
      id, name, color, hat, pet, skin, isDisconnected, isImpostor, isDead,
      reader.readList(tasks => [ tasks.readByte(), tasks.readBoolean() ]),
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
        (this.isDead ? PlayerFlags.IsDead : 0)
      ).writeList(this.tasks, (sub, task) => {
        sub.writePackedUInt32(task[0]).writeBoolean(task[1]);
      });
  }
}
