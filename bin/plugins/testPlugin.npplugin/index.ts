import { TextComponent } from "../../../lib/api/text";
import { Player } from "../../../lib/api/player";
import { Server } from "../../../lib/api/server";
import { Lobby } from "../../../lib/api/lobby";
import { Logger } from "../../../lib/logger";
import repl from "repl";

declare const server: Server;

const logger = new Logger("Debug");

server.on("lobbyCreated", (lobby: Lobby) => {
  lobby.on("player", (player: Player) => {
    logger.log(player, " Connected");

    player.on("spawned", () => {
      player.setName(
        new TextComponent()
          .setOpacity(127)
          .setColor(255, 0, 0)
          .add("content"),
      );
    });

    player.on("moved", ({ position, velocity }) => {
      logger.log(player, " Moved ", position, " Δ", velocity);
    });
  });
});

repl.start();
