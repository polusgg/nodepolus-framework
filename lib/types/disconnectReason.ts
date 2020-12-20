import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { DisconnectReasonType } from "./enums";

export class DisconnectReason {
  constructor(
    public type: DisconnectReasonType,
    public message: string = "",
  ) {}

  static deserialize(reader: MessageReader, asInt: boolean = false): DisconnectReason {
    const type = reader[asInt ? "readUInt32" : "readByte"]();
    let message = "";

    if (type == DisconnectReasonType.Custom && reader.hasBytesLeft()) {
      message = reader.readString();
    }

    return new DisconnectReason(type, message);
  }

  static exitGame(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.ExitGame);
  }

  static gameFull(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.GameFull);
  }

  static gameStarted(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.GameStarted);
  }

  static gameNotFound(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.GameNotFound);
  }

  static incorrectVersion(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.IncorrectVersion);
  }

  static banned(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Banned);
  }

  static kicked(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Kicked);
  }

  static custom(message: string): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Custom, message);
  }

  static invalidName(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.InvalidName);
  }

  static hacking(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Hacking);
  }

  static destroy(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Destroy);
  }

  static error(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Error);
  }

  static incorrectGame(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.IncorrectGame);
  }

  static serverRequest(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.ServerRequest);
  }

  static serverFull(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.ServerFull);
  }

  static intentionalLeaving(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.IntentionalLeaving);
  }

  static focusLostBackground(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.FocusLostBackground);
  }

  static focusLost(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.FocusLost);
  }

  static newConnection(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.NewConnection);
  }

  serialize(writer: MessageWriter, asInt: boolean = false): void {
    writer[asInt ? "writeUInt32" : "writeByte"](this.type);

    if (this.type == DisconnectReasonType.Custom && this.message.length > 0) {
      writer.writeString(this.message);
    }
  }
}
