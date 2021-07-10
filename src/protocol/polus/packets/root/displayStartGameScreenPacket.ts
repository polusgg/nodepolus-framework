import { BaseRootPacket } from "../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";

export class DisplayStartGameScreenPacket extends BaseRootPacket {
  constructor(
    public readonly titleText: string,
    public readonly subtitleText: string,
    public readonly backgroundColor: readonly [number, number, number, number],
    public readonly yourTeam: number[],
  ) {
    super(0x82);
  }

  static deserialize(reader: MessageReader): DisplayStartGameScreenPacket {
    return new DisplayStartGameScreenPacket(
      reader.readString(),
      reader.readString(),
      [...reader.readBytes(4).getBuffer()] as [number, number, number, number],
      [...reader.readRemainingBytes().getBuffer()],
    );
  }

  serialize(writer: MessageWriter): void {
    writer
      .writeString(this.titleText)
      .writeString(this.subtitleText)
      .writeBytes(this.backgroundColor as [number, number, number, number])
      .writeBytes(this.yourTeam);
  }

  clone(): DisplayStartGameScreenPacket {
    return new DisplayStartGameScreenPacket(
      this.titleText,
      this.subtitleText,
      [...this.backgroundColor],
      [...this.yourTeam],
    );
  }
}
