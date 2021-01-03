import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a lobby's privacy has been changed to either private or public
 */
export class LobbyPrivacyUpdatedEvent extends CancellableEvent {
  constructor(
    private readonly lobby: LobbyInstance,
    private publicity: boolean,
  ) {
    super();
  }

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  isPublic(): boolean {
    return this.publicity;
  }

  setPublic(isPublic: boolean): void {
    this.publicity = isPublic;
  }
}
