import { FileAnnouncementDriver } from "../../../lib/announcementServer/drivers";
import { ServerLobbyJoinEvent } from "../../../lib/api/events/server";
import { AnnouncementServer } from "../../../lib/announcementServer";
import { BasePlugin, PluginMetadata } from "../../../lib/api/plugin";
import { PlayerJoinedEvent } from "../../../lib/api/events/player";
import { shuffleArrayClone } from "../../../lib/util/shuffle";
import { Server } from "../../../lib/server";
import { Vector2 } from "../../../lib/types";
import path from "path";
import { PlayerColor } from "../../../lib/types/enums";

/**
 * Grab the server and announcement server from the global object.
 */
declare const server: Server;
declare const announcementServer: AnnouncementServer;

/**
 * Define the plugin's metadata.
 */
const pluginMeta: PluginMetadata = {
  name: "Test Plugin",
  version: [1, 2, 3],
};

/**
 * Export the plugin as the default export.
 */
export default class extends BasePlugin {
  constructor() {
    super(server, pluginMeta);

    /**
     * Register some event handlers.
     */
    server.on("server.ready", this.demoLogger.bind(this));
    server.on("player.joined", this.logPlayerJoins.bind(this));
    server.on("server.lobby.join", this.joinRandomLobby.bind(this));

    /**
     * Set the announcement server's driver.
     */
    announcementServer.setDriver(new FileAnnouncementDriver(path.join(__dirname, "announcement.json")));

    server.on("player.joined", evt => {
      evt.getLobby().sendChat(Math.random().toString(), PlayerColor[PlayerColor[Math.random() * 11]], Math.random().toString(), Math.random() > 0.5);
    });
  }

  /**
   * Demonstrates log levels and object printing.
   */
  private demoLogger(): void {
    const meta = {
      some: "property",
    };

    /**
     * Use `%s` to print a value as a string, or `%d` to print a value as a
     * number. Extra arguments that don't have a corresponding `%s` or `%d` will
     * be logged as metadata at the end of the message.
     */
    this.getLogger().fatal("Test message 1", meta);
    this.getLogger().error("Test message 2", meta);
    this.getLogger().warn("Test message 3", meta);
    this.getLogger().info("Test message 4", meta);
    this.getLogger().info("Test message %d", 5, meta);
    this.getLogger().verbose("Test message 6", meta);
    this.getLogger().debug("Test message 7", meta);
    this.getLogger().debug("Number: %d", 42);
    this.getLogger().debug("BigInt: %d", 42n);
    this.getLogger().debug("Decimal: %d", 4.2);
    this.getLogger().debug("String: %s", "42");
    this.getLogger().debug("Boolean as string: %s", true);
    this.getLogger().debug("Boolean as number: %d", true);
    this.getLogger().debug("undefined: %s", undefined);
    this.getLogger().debug("Symbol: %s", Symbol("test"));
    this.getLogger().debug("Vector2: %s", new Vector2(1.234, 5.678));
  }

  /**
   * Logs when a player joins a lobby.
   */
  private logPlayerJoins(event: PlayerJoinedEvent): void {
    this.getLogger().info(
      "%s connected to lobby %s from connection %s",
      event.getPlayer(),
      event.getLobby(),
      event.getPlayer().getConnection(),
    );
  }

  /**
   * Lets players join a random public lobby by joining with the code "RANDOM".
   */
  private joinRandomLobby(event: ServerLobbyJoinEvent): void {
    if (event.getLobbyCode() !== "RANDOM") {
      return;
    }

    /**
     * Grab a random non-full public lobby.
     */
    const lobby = shuffleArrayClone(
      server.getLobbies().filter(lob => !lob.isFull() && lob.isPublic()),
    )[0];

    event.setLobby(lobby);
  }
}
