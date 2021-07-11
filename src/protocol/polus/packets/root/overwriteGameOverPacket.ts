import { BaseRootPacket } from "../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { WinSound, WinSoundType } from "../../../../types/enums/polus/polusWinSound";
import { Asset } from "../../assets";
import { RootPacketType } from "../../../../types/enums";

export class OverwriteGameOver extends BaseRootPacket {
  constructor(
    public readonly titleText: string,
    public readonly subtitleText: string,
    public readonly backgroundColor: [number, number, number, number],
    public readonly yourTeam: number[],
    public readonly displayQuit: boolean,
    public readonly displayPlayAgain: boolean,
    public readonly winSound: WinSound,
  ) {
    super(RootPacketType.PolusOverwriteGameOver as number);
  }

  static deserialize(reader: MessageReader): OverwriteGameOver {
    return new OverwriteGameOver(
      reader.readString(),
      reader.readString(),
      [...reader.readBytes(4).getBuffer()] as [number, number, number, number],
      [...reader.readBytes(reader.readByte()).getBuffer()],
      reader.readBoolean(),
      reader.readBoolean(),
      // todo write a deserializer for this smileW
      WinSoundType.NoSound,
    );
  }

  serialize(writer: MessageWriter): void {
    writer
      .writeString(this.titleText)
      .writeString(this.subtitleText)
      .writeBytes(this.backgroundColor)
      .writeByte(this.yourTeam.length)
      .writeBytes(this.yourTeam)
      .writeBoolean(this.displayQuit)
      .writeBoolean(this.displayPlayAgain);

    if (this.winSound instanceof Asset) {
      writer.writeByte(WinSoundType.CustomSound);
      writer.writePackedUInt32(this.winSound.getId());
    } else {
      writer.writeByte(this.winSound);
    }
  }

  clone(): OverwriteGameOver {
    return new OverwriteGameOver(
      this.titleText,
      this.subtitleText,
      this.backgroundColor,
      this.yourTeam,
      this.displayQuit,
      this.displayPlayAgain,
      this.winSound,
    );
  }
}
