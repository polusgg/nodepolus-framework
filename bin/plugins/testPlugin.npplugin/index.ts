import { HostGameResponsePacket } from "../../../lib/protocol/packets/root";
import { LobbyJoinRequestEvent } from "../../../lib/api/events/server";
import { PlayerJoinEvent } from "../../../lib/api/events/lobby";
import { shuffleArrayClone } from "../../../lib/util/shuffle";
import { Logger } from "../../../lib/logger";
import { Server } from "../../../lib/server";
import repl from "repl";

declare const server: Server;

const logger = new Logger("Debug");

server.on("playerJoin", (event: PlayerJoinEvent) => {
  logger.log(event.player, " Connected");
});

server.on("joinLobbyRequest", (event: LobbyJoinRequestEvent) => {
  if (event.lobbyCode !== "RANDOM") {
    return;
  }

  const lobby = shuffleArrayClone(server.lobbies.filter(lob => lob.getConnections().length < 10 && lob.isPublic()))[0];

  event.connection.sendReliable([new HostGameResponsePacket(lobby.getCode())]);

  event.lobby = lobby;
});

repl.start();
