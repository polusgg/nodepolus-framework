import { GameOptionsData, Immutable } from "../../../types";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a lobby's options have been updated.
 */
export class LobbyOptionsUpdatedEvent extends CancellableEvent {
  /**
   * @param lobby - The lobby from which this event was fired
   * @param oldOptions - The old lobby options
   * @param newOptions - The new lobby options
   */
  constructor(
    private readonly lobby: LobbyInstance,
    private readonly oldOptions: Immutable<GameOptionsData>,
    private newOptions: GameOptionsData,
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
