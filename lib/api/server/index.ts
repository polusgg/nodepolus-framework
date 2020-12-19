import { LobbyCreatedEvent } from "../events/server/lobbyCreated";
import { Server as InternalServer } from "../../server";
import { ServerConfig } from "./serverConfig";
import { Lobby } from "../lobby";
import Emittery from "emittery";

export type ServerEvents = {
  lobbyCreated: Lobby;
};

export class Server extends Emittery.Typed<ServerEvents> {
  public internalServer: InternalServer;
  public lobbies: Lobby[] = [];

  constructor(
    config?: ServerConfig,
  ) {
    super();

    this.internalServer = new InternalServer(config);

    this.internalServer.on("lobbyCreated", (lobby: LobbyCreatedEvent) => {
      const newLobby = new Lobby(lobby.lobby);

      this.lobbies.push(newLobby);
      this.emit("lobbyCreated", newLobby);
    });
  }

  async listen(): Promise<void> {
    return new Promise(resolve => {
      this.internalServer.listen(resolve);
    });
  }
}
