import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { LobbyCode } from "../../../../util/lobbyCode";
import { Level } from "../../../../types/enums";

export class LobbyListing {
  constructor(
    public readonly ipAddress: string,
    public readonly port: number,
    public readonly lobbyCode: string,
    public readonly hostName: string,
    public readonly playerCount: number,
    public readonly age: number,
    public readonly level: Level,
    public readonly impostorCount: number,
    public readonly maxPlayers: number,
  ) {}

  static deserialize(reader: MessageReader): LobbyListing {
    return new LobbyListing(
      reader.readBytes(4).buffer.join("."),
      reader.readUInt16(),
      LobbyCode.decode(reader.readInt32()),
      reader.readString(),
      reader.readByte(),
      reader.readPackedUInt32(),
      reader.readByte(),
      reader.readByte(),
      reader.readByte(),
    );
  }

  serialize(writer: MessageWriter): void {
    writer.writeBytes(this.ipAddress.split(".").map(octet => parseInt(octet, 10)))
      .writeUInt16(this.port)
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeString(this.hostName)
      .writeByte(this.playerCount)
      .writePackedUInt32(this.age)
      .writeByte(this.level)
      .writeByte(this.impostorCount)
      .writeByte(this.maxPlayers);
  }
}
