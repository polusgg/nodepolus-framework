import { DisconnectReason, GameOptionsData } from "../../../types";
import { Connection } from "../../../protocol/connection";
import { DisconnectableEvent } from "../types";
import { LobbyCode } from "../../../util/lobbyCode";

/**
 * Fired when a new lobby is being created.
 */
export class ServerLobbyCreatingEvent extends DisconnectableEvent {
  /**
   * @param connection - The connection that is creating the lobby
   * @param lobbyCode - The code to be used for the lobby
   * @param options - The options used to create the lobby
   */
  constructor(
    protected readonly connection: Connection,
    protected lobbyCode: string,
    protected options: GameOptionsData,
    protected _isMigrating: boolean,
  ) {
    super(DisconnectReason.custom("The server refused to create your game"));
  }

  /**
   * Gets the connection that is creating the lobby.
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Gets the code to be used for the lobby.
   */
  getLobbyCode(): string {
    return this.lobbyCode;
  }

  /**
   * Sets the code to be used for the lobby.
   *
   * @param lobbyCode - The new code to be used for the lobby
   */
  setLobbyCode(lobbyCode: string): this {
    if (LobbyCode.isValid(lobbyCode)) {
      this.lobbyCode = lobbyCode;
    }

    return this;
  }

  /**
   * Gets the options used to create the lobby
   */
  getOptions(): GameOptionsData {
    return this.options;
  }

  /**
   * Sets the options used to create the lobby.
   *
   * @param options - The new options used to create the lobby
   */
  setOptions(options: GameOptionsData): this {
    this.options = options;

    return this;
  }

  /**
   * Gets if the lobby was migrated from a different server.
   */
  isMigrating(): boolean {
    return this._isMigrating;
  }
}
