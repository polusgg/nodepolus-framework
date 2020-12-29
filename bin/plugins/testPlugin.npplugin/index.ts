import { Player } from "../../../lib/api/player";
import { Server } from "../../../lib/server";
import { Logger } from "../../../lib/logger";
import repl from "repl";
import { LobbyCreatedEvent } from "../../../lib/api/events/server";

declare const server: Server;

const logger = new Logger("Debug");

server.on("lobbyCreated", (event: LobbyCreatedEvent) => {
  event.lobby.on("player", (player: Player) => {
    logger.log(player, " Connected");
  });
});

repl.start();
