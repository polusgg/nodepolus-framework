import { CancellableEvent } from "./cancellableEvent";
import { DisconnectReason } from "../../../types";

export abstract class DisconnectableEvent extends CancellableEvent {
  private disconnectReason?: DisconnectReason;

  constructor(
    private readonly defaultDisconnectReason: DisconnectReason,
  ) {
    super();
  }

  getDefaultDisconnecReason(): DisconnectReason {
    return this.defaultDisconnectReason;
  }

  getDisconnectReason(): DisconnectReason | undefined {
    return this.disconnectReason ?? this.defaultDisconnectReason;
  }

  setDisconnectReason(disconnectReason: DisconnectReason): this {
    this.disconnectReason = disconnectReason;

    return this;
  }
}
