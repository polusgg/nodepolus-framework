import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a lobby's privacy has been changed to either private or public
 */
export class LobbyPrivacyUpdatedEvent extends CancellableEvent {
  /**
   * @param lobby - The lobby from which this event was fired
   * @param publicity - `true` if the lobby is public, `false` if not
   */
  constructor(
    protected readonly lobby: LobbyInstance,
    protected publicity: boolean,
  ) {
    super();
  }

  /**
   * Gets the lobby from which this event was fired.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }

  /**
   * Gets whether or not the lobby is public.
   *
   * @returns `true` if public, `false` is private
   */
  isPublic(): boolean {
    return this.publicity;
  }

  /**
   * Sets whether or not the lobby is public.
   *
   * @param isPublic - `true` for public, `false` for private
   */
  setPublic(isPublic: boolean): this {
    this.publicity = isPublic;

    return this;
  }
}
