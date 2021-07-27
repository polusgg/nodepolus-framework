import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType, StringNames } from "../../../types/enums";
import { BaseRpcPacket } from ".";

export enum QuickChatPacketType {
  Sentence,
  Phrase,
  Player,
  None,
}

class QuickChatPlayer {
  constructor(
    public playerId: number,
  ) { }

  static deserialize(reader: MessageReader): QuickChatPlayer {
    return new QuickChatPlayer(reader.readSByte());
  }

  serialize(writer: MessageWriter): void {
    writer.writeSByte(this.playerId);
  }

  clone(): QuickChatPlayer {
    return new QuickChatPlayer(this.playerId);
  }
}

class QuickChatSentence {
  constructor(
    public key: StringNames,
    public elements: (StringNames | QuickChatPlayer | string)[],
  ) {}

  static deserialize(reader: MessageReader): QuickChatSentence {
    const sentenceElements = new Array<StringNames | QuickChatPlayer | "">(reader.readPackedInt32());

    for (let i = 0; i < sentenceElements.length; i++) {
      const stringName = reader.readUInt16();

      if (stringName === StringNames.ANY) {
        const playerId = reader.readSByte();

        if (playerId < 0) {
          sentenceElements[i] = "";
        } else {
          sentenceElements[i] = new QuickChatPlayer(playerId);
        }
      } else {
        sentenceElements[i] = stringName as StringNames;
      }
    }

    const key = reader.readUInt16();

    return new QuickChatSentence(key, sentenceElements);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedInt32(this.elements.length);

    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i];

      if (typeof element === "number") {
        writer.writeUInt16(element);
      } else {
        writer.writeUInt16(StringNames.ANY);

        if (typeof element === "string") {
          writer.writeSByte(-1);
        } else {
          writer.writeSByte(element.playerId);
        }
      }
    }

    writer.writeUInt16(this.key);
  }

  clone(): QuickChatPhrase {
    return new QuickChatSentence(this.key, this.elements.map(e => e instanceof QuickChatPlayer ? e.clone() : e));
  }
}

class QuickChatPhrase {
  constructor(
    public key: StringNames,
  ) {}

  static deserialize(reader: MessageReader): QuickChatPhrase {
    return new QuickChatPhrase(reader.readUInt16());
  }

  serialize(writer: MessageWriter): void {
    writer.writeUInt16(this.key);
  }

  clone(): QuickChatPhrase {
    return new QuickChatPhrase(this.key);
  }
}

/**
 * RPC Packet ID: `0x21` (`33`)
 */
export class SendQuickChatPacket extends BaseRpcPacket {
  constructor(
    public contentsType: QuickChatPacketType,
    public value?: QuickChatPhrase | QuickChatPlayer | QuickChatSentence,
  ) {
    super(RpcPacketType.SendQuickChat);
  }

  static deserialize(reader: MessageReader): SendQuickChatPacket {
    const type = reader.readByte();

    switch (type) {
      case QuickChatPacketType.None:
        return new SendQuickChatPacket(type);
      case QuickChatPacketType.Phrase:
        return new SendQuickChatPacket(type, QuickChatPhrase.deserialize(reader));
      case QuickChatPacketType.Player:
        return new SendQuickChatPacket(type, QuickChatPlayer.deserialize(reader));
      case QuickChatPacketType.Sentence:
        return new SendQuickChatPacket(type, QuickChatSentence.deserialize(reader));
      default:
        throw new Error("Unknown quick chat subpacket type");
    }
  }

  clone(): SendQuickChatPacket {
    return new SendQuickChatPacket(this.contentsType, this.value?.clone());
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.contentsType);
    this.value?.serialize(writer);
  }
}
