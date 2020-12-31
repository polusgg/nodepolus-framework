import { PlayerJoinEvent } from "../../../lib/api/events/lobby";
import { Logger } from "../../../lib/logger";
import { Server } from "../../../lib/server";
import repl from "repl";

declare const server: Server;

const logger = new Logger("Debug");

server.on("playerJoin", (event: PlayerJoinEvent) => {
  logger.log(event.player, " Connected");
});

repl.start();
