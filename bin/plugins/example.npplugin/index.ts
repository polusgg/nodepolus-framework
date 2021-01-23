import { FileAnnouncementDriver } from "../../../lib/announcementServer/drivers";
import { HostGameResponsePacket } from "../../../lib/protocol/packets/root";
import { ServerLobbyJoinEvent } from "../../../lib/api/events/server";
import { AnnouncementServer } from "../../../lib/announcementServer";
import { PlayerJoinedEvent } from "../../../lib/api/events/player";
import { shuffleArrayClone } from "../../../lib/util/shuffle";
import { Server } from "../../../lib/server";
import { Vector2 } from "../../../lib/types";
import path from "path";

declare const server: Server;
declare const announcementServer: AnnouncementServer;

announcementServer.setDriver(
  new FileAnnouncementDriver(path.join(__dirname, "announcement.json"))
    .setForceShowAnnouncement(false),
);

const logger = server.getLogger().child("TestPlugin");

server.on("server.ready", () => {
  logger.fatal("Test message", { extra: "metadata" });
  logger.error("Test message", { extra: "metadata" });
  logger.warn("Test message", { extra: "metadata" });
  logger.info("Test message", { extra: "metadata" });
  logger.verbose("Test message", { extra: "metadata" });
  logger.debug("Test message", { extra: "metadata" });
  logger.debug("Number: %d", 69420);
  logger.debug("BigInt: %d", 69420n);
  logger.debug("Decimal: %d", 69.420);
  logger.debug("String: %s", "69420");
  logger.debug("Boolean as string: %s", true);
  logger.debug("Boolean as number: %d", true);
  logger.debug("undefined: %s", undefined);
  logger.debug("Symbol: %s", Symbol("test"));
  logger.debug("Vector2: %s", new Vector2(69.101, 420.101));
});

server.on("player.joined", (event: PlayerJoinedEvent) => {
  logger.info(
    "%s connected to lobby %s from connection %s",
    event.getPlayer(),
    event.getLobby(),
    event.getPlayer().getConnection(),
  );
});

server.on("server.lobby.join", (event: ServerLobbyJoinEvent) => {
  if (event.getLobbyCode() !== "RANDOM") {
    return;
  }

  const lobby = shuffleArrayClone(server.getLobbies().filter(lob => lob.getConnections().length < 10 && lob.isPublic()))[0];

  event.getConnection().sendReliable([new HostGameResponsePacket(lobby.getCode())]);
  event.setLobby(lobby);
});
