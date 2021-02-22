import { GameOptionsData, Immutable } from "../../../types";
import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a lobby's options have been updated.
 */
export class LobbyOptionsUpdatedEvent extends CancellableEvent {
  /**
   * @param lobby - The lobby from which this event was fired
   * @param host - The player that modified the options
   * @param oldOptions - The old lobby options
   * @param newOptions - The new lobby options
   */
  constructor(
    protected readonly lobby: LobbyInstance,
    protected readonly host: PlayerInstance,
    protected readonly oldOptions: Immutable<GameOptionsData>,
    protected newOptions: GameOptionsData,
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
   * Gets the player that modified the options.
   */
  getHost(): PlayerInstance {
    return this.host;
  }

  /**
   * Gets the old lobby options.
   */
  getOldOptions(): Immutable<GameOptionsData> {
    return this.oldOptions;
  }

  /**
   * Gets the new lobby options.
   */
  getNewOptions(): GameOptionsData {
    return this.newOptions;
  }

  /**
   * Sets the new lobby options.
   *
   * @param newOptions - The new lobby options
   */
  setNewOptions(newOptions: GameOptionsData): void {
    this.newOptions = newOptions;
  }
}
