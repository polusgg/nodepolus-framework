import { ServerLobbyJoinEvent, ServerPacketCustomEvent, ServerPacketRpcCustomEvent } from "../../../lib/api/events/server";
import { FileAnnouncementDriver } from "../../../lib/announcementServer/drivers";
import { InnerNetObjectType } from "../../../lib/protocol/entities/types/enums";
import { AnnouncementServer } from "../../../lib/announcementServer";
import { BasePlugin, PluginMetadata } from "../../../lib/api/plugin";
import { RpcPacket } from "../../../lib/protocol/packets/gameData";
import { PlayerJoinedEvent } from "../../../lib/api/events/player";
import { RootPacket } from "../../../lib/protocol/packets/hazel";
import { shuffleArrayClone } from "../../../lib/util/shuffle";
import { ConnectionInfo, Vector2 } from "../../../lib/types";
import { AddressFamily } from "../../../lib/types/enums";
import { TestRpcPacket } from "./testRpcPacket";
import { Server } from "../../../lib/server";
import { TestPacket } from "./testPacket";
import path from "path";

/**
 * Registers a custom root packet with the ID 0x40 (64).
 */
RootPacket.registerPacket(0x40, TestPacket.deserialize);

/**
 * Registers a custom RPC packet with the ID 0x50 (80).
 */
RpcPacket.registerPacket(0x50, TestRpcPacket.deserialize);

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
     * Listens for custom root packets
     */
    server.on("server.packet.custom", (event: ServerPacketCustomEvent) => {
      const packet = event.getPacket();

      if (event.getConnection().lobby) {
        server.getLogger("Custom Packet").debug(
          "Received custom root packet from connection %s in lobby %s: %s",
          event.getConnection(),
          event.getConnection().lobby,
          packet,
        );
      } else {
        server.getLogger("Custom Packet").debug(
          "Received custom root packet from connection %s: %s",
          event.getConnection(),
          packet,
        );
      }

      if (packet instanceof TestPacket) {
        const data = packet as TestPacket;

        server.getLogger("Test Packet").debug("Message: %s", data.message);
      }
    });

    /**
     * Listens for custom RPC packets
     */
    server.on("server.packet.rpc.custom", (event: ServerPacketRpcCustomEvent) => {
      const packet = event.getPacket();
      const sender = event.getSender();

      if (sender === undefined) {
        return;
      }

      server.getLogger("Custom RPC").debug(
        "Received custom RPC packet from %s #%d: %s",
        InnerNetObjectType[sender.type],
        event.getNetId(),
        packet,
      );

      if (packet instanceof TestRpcPacket) {
        const data = packet as TestRpcPacket;

        if (sender.type !== InnerNetObjectType.PlayerControl) {
          return;
        }

        server.getLogger("Test RPC Packet").debug("Message: %s", data.message);
        // (sender as InnerPlayerControl).setName(data.message, event.getConnection().lobby?.getConnections() ?? []);
      }
    });

    /**
     * Set the announcement server's driver.
     */
    announcementServer.setDriver(new FileAnnouncementDriver(path.join(__dirname, "announcement.json")));
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

    // DEBUG: Simulates sending a TestPacket packet from a connection not in a lobby
    server.getConnection(new ConnectionInfo("127.0.0.1", 42069, AddressFamily.IPv4)).emit("message", Buffer.from([
      0x01, 0x00, 0x07, 0x06, 0x00, 0x40, 0x05, 0x68, 0x65, 0x6c, 0x6c, 0x6f,
    ]));
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

    // DEBUG: Simulates sending a TestPacket packet from a connection in a lobby
    event.getPlayer().getConnection()?.emit("message", Buffer.from([
      0x01, 0x00, 0x07, 0x06, 0x00, 0x40, 0x05, 0x68, 0x65, 0x6c, 0x6c, 0x6f,
    ]));

    // DEBUG: Simulates sending a TestRpcPacket packet
    event.getPlayer().getConnection()?.emit("message", Buffer.from([
      0x01, 0x00, 0x08, 0x0f, 0x00, 0x05, 0x9a, 0xa0, 0xb6, 0x80, 0x08, 0x00, 0x02, 0x04, 0x50, 0x05, 0x77, 0x6f, 0x72, 0x6c, 0x64,
    ]));
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
