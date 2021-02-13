import { CancellableEvent } from "./cancellableEvent";
import { DisconnectReason } from "../../../types";

/**
 * A special type of cancellable event that, when cancelled, disconnects the
 * connection from the server.
 */
export abstract class DisconnectableEvent extends CancellableEvent {
  private disconnectReason?: DisconnectReason;

  /**
   * @param defaultDisconnectReason - The default disconnect reason to be sent to the connection.
   */
  constructor(
    private readonly defaultDisconnectReason: DisconnectReason,
  ) {
    super();
  }

  /**
   * Gets the default disconnect reason to be sent to the connection.
   */
  getDefaultDisconnectReason(): DisconnectReason {
    return this.defaultDisconnectReason;
  }

  /**
   * Gets the disconnect reason to be sent to the connection.
   *
   * @defaultValue `getDefaultDisconnectReason()`
   */
  getDisconnectReason(): DisconnectReason {
    return this.disconnectReason ?? this.defaultDisconnectReason;
  }

  /**
   * Sets the disconnect reason to be sent to the connection.
   *
   * @param disconnectReason - The new disconnect reason to be sent to the conection
   */
  setDisconnectReason(disconnectReason: DisconnectReason): this {
    this.disconnectReason = disconnectReason;

    return this;
  }
}
