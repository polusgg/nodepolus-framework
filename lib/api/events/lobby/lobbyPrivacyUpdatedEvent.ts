import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a lobby's privacy has been changed to either private or public
 */
export class LobbyPrivacyUpdatedEvent extends CancellableEvent {
  constructor(
    public readonly lobby: LobbyInstance,
    public isPublic: boolean,
  ) {
    super();
  }
}
