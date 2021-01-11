import { HostGameResponsePacket } from "../../../lib/protocol/packets/root";
import { ServerLobbyJoinEvent } from "../../../lib/api/events/server";
import { PlayerJoinedEvent } from "../../../lib/api/events/player";
import { shuffleArrayClone } from "../../../lib/util/shuffle";
import { InternalPlayer } from "../../../lib/player";
import { InternalLobby } from "../../../lib/lobby";
import { Server } from "../../../lib/server";
import { Vector2 } from "../../../lib/types";

declare const server: Server;

server.on("server.ready", () => {
  server.getLogger().fatal("Test message", { extra: "metadata" });
  server.getLogger().child("test").error("Test message", { extra: "metadata" });
  server.getLogger().warn("Test message", { extra: "metadata" });
  server.getLogger().info("Test message", { extra: "metadata" });
  server.getLogger().verbose("Test message", { extra: "metadata" });
  server.getLogger().debug("Test message", { extra: "metadata" });
  server.getLogger().debug("Number: %d", 69420);
  server.getLogger().debug("BigInt: %d", 69420n);
  server.getLogger().debug("Decimal: %d", 69.420);
  server.getLogger().debug("String: %s", "69420");
  server.getLogger().debug("Boolean as string: %s", true);
  server.getLogger().debug("Boolean as number: %d", true);
  server.getLogger().debug("undefined: %s", undefined);
  server.getLogger().debug("Vector2: %s", new Vector2(69.101, 420.101));
});

server.on("player.joined", (event: PlayerJoinedEvent) => {
  server.getLogger().info(
    "%s connected to lobby %s from connection %s",
    event.getPlayer(),
    event.getLobby(),
    (event.getLobby() as InternalLobby).findConnectionByPlayer(event.getPlayer() as InternalPlayer),
  );
});

server.on("server.lobby.join", (event: ServerLobbyJoinEvent) => {
  if (event.getLobbyCode() !== "RANDOM") {
    return;
  }

  const lobby = shuffleArrayClone(server.lobbies.filter(lob => lob.getConnections().length < 10 && lob.isPublic()))[0];

  event.getConnection().sendReliable([new HostGameResponsePacket(lobby.getCode())]);
  event.setLobby(lobby);
});
