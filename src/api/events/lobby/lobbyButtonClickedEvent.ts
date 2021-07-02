import { Connection } from "../../../protocol/connection";
import { EntityButton } from "../../../protocol/polus/entities";
import { LobbyInstance } from "../../lobby";

/**
 * Fired when a button is clicked by a connection.
 */
export class LobbyButtonClickedEvent {
  /**
   * @param lobby - The lobby from which this event was fired
   * @param clicker - The connection that triggered "click" event
   * @param button - Button that was clicked
   */
  constructor(
    protected readonly lobby: LobbyInstance,
    protected readonly clicker: Connection,
    protected readonly button: EntityButton,
  ) {}

  /**
   * Gets the lobby from which this event was fired.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }

  /**
   * Gets the connection that clicked the button
   */
  getClicker(): Connection {
    return this.clicker;
  }

  /**
   * Gets the button that was clicked
   * @returns button that was clicked (EntityButton class)
   */
  getButton(): EntityButton {
    return this.button;
  }
}
