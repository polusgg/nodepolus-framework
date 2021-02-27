import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { DisconnectReasonType } from "./enums";
import { CanSerializeToHazel } from ".";

/**
 * A class used to store, serialize, and deserialize a disconnect reason.
 */
export class DisconnectReason implements CanSerializeToHazel {
  /**
   * @param type - The disconnect reason
   * @param message - The custom message to be displayed to the player when `type` is `DisconnectReasonType.Custom`
   */
  constructor(
    protected type: DisconnectReasonType,
    protected message: string = "",
  ) {}

  /**
   * Gets a new DisconnectReason by reading from the given MessageReader.
   *
   * @param reader - The MessageReader to read from
   * @param asInt - `true` if the type should be read as a UInt32, `false` if it should be read as a byte (default `false`)
   */
  static deserialize(reader: MessageReader, asInt: boolean = false): DisconnectReason {
    const type = reader[asInt ? "readUInt32" : "readByte"]();
    let message = "";

    if (type == DisconnectReasonType.Custom && reader.hasBytesLeft()) {
      message = reader.readString();
    }

    return new DisconnectReason(type, message);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.ExitGame`
   */
  static exitGame(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.ExitGame);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.GameFull`
   */
  static gameFull(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.GameFull);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.GameStarted`
   */
  static gameStarted(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.GameStarted);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.GameNotFound`
   */
  static gameNotFound(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.GameNotFound);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.IncorrectVersion`
   */
  static incorrectVersion(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.IncorrectVersion);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.Banned`
   */
  static banned(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Banned);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.Kicked`
   */
  static kicked(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Kicked);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.Custom`
   *
   * @param message - The custom message to be displayed to the player
   */
  static custom(message: string): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Custom, message);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.InvalidName`
   */
  static invalidName(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.InvalidName);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.Hacking`
   */
  static hacking(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Hacking);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.Destroy`
   */
  static destroy(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Destroy);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.Error`
   */
  static error(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.Error);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.IncorrectGame`
   */
  static incorrectGame(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.IncorrectGame);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.ServerRequest`
   */
  static serverRequest(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.ServerRequest);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.ServerFull`
   */
  static serverFull(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.ServerFull);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.IntentionalLeaving`
   */
  static intentionalLeaving(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.IntentionalLeaving);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.FocusLostBackground`
   */
  static focusLostBackground(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.FocusLostBackground);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.FocusLost`
   */
  static focusLost(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.FocusLost);
  }

  /**
   * Gets a new DisconnectReason whose type is `DisconnectReasonType.NewConnection`
   */
  static newConnection(): DisconnectReason {
    return new DisconnectReason(DisconnectReasonType.NewConnection);
  }

  /**
   * Gets the disconnect reason.
   */
  getType(): DisconnectReasonType {
    return this.type;
  }

  /**
   * Sets the disconnect reason.
   *
   * @param type - The disconnect reason
   */
  setType(type: DisconnectReasonType): this {
    this.type = type;

    return this;
  }

  /**
   * Gets the custom message to be displayed to the player when `type` is `DisconnectReasonType.Custom`.
   */
  getMessage(): string {
    return this.message;
  }

  /**
   * Sets the custom message to be displayed to the player when `type` is `DisconnectReasonType.Custom`.
   *
   * @param message - The custom message
   */
  setMessage(message: string): this {
    this.message = message;

    return this;
  }

  /**
   * Writes the DisconnectReason to the given MessageWriter
   *
   * @param reader - The MessageWriter to write to
   * @param asInt - `true` if the type should be written as a UInt32, `false` if it should be written as a byte (default `false`)
   */
  serialize(writer: MessageWriter, asInt: boolean = false): void {
    writer[asInt ? "writeUInt32" : "writeByte"](this.type);

    if (this.type == DisconnectReasonType.Custom && this.message.length > 0) {
      writer.writeString(this.message);
    }
  }

  /**
   * Gets a clone of the DisconnectReason instance.
   */
  clone(): DisconnectReason {
    return new DisconnectReason(this.type, this.message);
  }
}
