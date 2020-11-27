import { MessageReader, MessageWriter } from "../util/hazelMessage";

export enum DisconnectionType {
  ExitGame = 0,
  GameFull = 1,
  GameStarted = 2,
  GameNotFound = 3,
  IncorrectVersion = 4,
  Banned = 6,
  Kicked = 7,
  Custom = 8,
  InvalidName = 9,
  Hacking = 10,
  Destroy = 16,
  Error = 17,
  IncorrectGame = 18,
  ServerRequest = 19,
  ServerFull = 20,
  IntentionalLeaving = 208,
  FocusLostBackground = 207,
  FocusLost = 209,
  NewConnection = 210,
}

export class DisconnectReason {
  constructor(
    public type: DisconnectionType,
    public message: string = ""
  ) {}

  static deserialize(reader: MessageReader, asInt: boolean = false): DisconnectReason {
    let type = reader[asInt ? "readUInt32" : "readByte"]();
    let message = "";

    if (type == DisconnectionType.Custom && reader.hasBytesLeft()) {
      message = reader.readString();
    }

    return new DisconnectReason(type, message);
  }

  serialize(writer: MessageWriter, asInt: boolean = false) {
    writer[asInt ? "writeUInt32" : "writeByte"](this.type);

    if (this.type == DisconnectionType.Custom && this.message.length > 0) {
      writer.writeString(this.message);
    }
  }

  static exitGame(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.ExitGame)
  }

  static gameFull(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.GameFull)
  }

  static gameStarted(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.GameStarted)
  }

  static gameNotFound(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.GameNotFound)
  }

  static incorrectVersion(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.IncorrectVersion)
  }

  static banned(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.Banned)
  }

  static kicked(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.Kicked)
  }

  static custom(message: string): DisconnectReason {
    return new DisconnectReason(DisconnectionType.Custom, message)
  }

  static invalidName(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.InvalidName)
  }

  static hacking(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.Hacking)
  }

  static destroy(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.Destroy)
  }

  static error(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.Error)
  }

  static incorrectGame(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.IncorrectGame)
  }

  static serverRequest(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.ServerRequest)
  }

  static serverFull(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.ServerFull)
  }

  static intentionalLeaving(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.IntentionalLeaving)
  }

  static focusLostBackground(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.FocusLostBackground)
  }

  static focusLost(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.FocusLost)
  }

  static newConnection(): DisconnectReason {
    return new DisconnectReason(DisconnectionType.NewConnection)
  }
}
