import { ServerLobbyJoinEvent, ServerPacketCustomEvent, ServerPacketRpcCustomEvent } from "../../../lib/api/events/server";
import { FileAnnouncementDriver } from "../../../lib/announcementServer/drivers";
import { InnerNetObjectType } from "../../../lib/protocol/entities/types/enums";
import { ConnectionInfo, DisconnectReason, Vector2 } from "../../../lib/types";
import { MessageReader, MessageWriter } from "../../../lib/util/hazelMessage";
import { JoinGameErrorPacket } from "../../../lib/protocol/packets/root";
import { AnnouncementServer } from "../../../lib/announcementServer";
import { BasePlugin, PluginMetadata } from "../../../lib/api/plugin";
import { RpcPacket } from "../../../lib/protocol/packets/gameData";
import { PlayerJoinedEvent } from "../../../lib/api/events/player";
import { RootPacket } from "../../../lib/protocol/packets/hazel";
import { Connection } from "../../../lib/protocol/connection";
import { shuffleArrayClone } from "../../../lib/util/shuffle";
import { AddressFamily } from "../../../lib/types/enums";
import { TestRpcPacket } from "./testRpcPacket";
import { Hmac } from "../../../lib/util/hmac";
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

// DEBUG
type User = {
  token: string;
  name: string;
};

// DEBUG
const KICK_UNAUTHENTICATED = process.env.NP_KICK_UNAUTHENTICATED !== undefined;
const AUTHENTICATION_BYTE = 0x69;
const CLIENT_ID_BYTE_LENGTH = 16;
const HASH_BYTE_LENGTH = 20;
const AUTHENTICATION_HEADER_LENGTH = 1 + CLIENT_ID_BYTE_LENGTH + HASH_BYTE_LENGTH;
const USERS: Map<string, User> = new Map([
  [
    "ec4435dfe404482b8e8a0946e12a9f9a",
    {
      token: "3a6adcf92fec282614f9a77b9ad5d24bcacab84522631eaa789c05090156ca5135a4753236142993",
      name: "Cody",
    },
  ],
  [
    "fc54bb9de1434234986b7bd873e93c86",
    {
      token: "07f34399f3162ad5baf871f41646259e7b9d8cebb045b6e4648222de0cb38fe1b9a28bc177794648",
      name: "Rose",
    },
  ],
  [
    "3af27ba3f117422fb399093a1393ec0e",
    {
      token: "5848db9438bf15b53703e00b4b37fa1df7088002e197a7bb6b8b241c403691a9faf13364b32d72b4",
      name: "Sanae",
    },
  ],
]);

/**
 * Export the plugin as the default export.
 */
export default class extends BasePlugin {
  constructor() {
    super(server, pluginMeta);

    /**
     * Sets the inbound packet transformer to one that authenticates packets
     * prefixed with a marker byte, client ID, and packet HMAC.
     */
    server.setInboundPacketTransformer((connection: Connection, reader: MessageReader): MessageReader => {
      if (reader.peek(0) != AUTHENTICATION_BYTE) {
        if (KICK_UNAUTHENTICATED) {
          connection.sendReliable([new JoinGameErrorPacket(DisconnectReason.custom("This server does not supported unauthenticated packets"))]);

          return new MessageReader();
        }

        return reader;
      }

      if (reader.getLength() < AUTHENTICATION_HEADER_LENGTH) {
        connection.sendReliable([new JoinGameErrorPacket(DisconnectReason.custom("Invalid packet length"))]);

        return new MessageReader();
      }

      if (reader.getLength() == AUTHENTICATION_HEADER_LENGTH) {
        // Short circuit since the packet has no body
        return new MessageReader();
      }

      reader.readByte();

      const clientId = reader.readBytes(CLIENT_ID_BYTE_LENGTH).getBuffer().toString("hex");
      const user = USERS.get(clientId);

      if (user === undefined) {
        connection.sendReliable([new JoinGameErrorPacket(DisconnectReason.custom("Unknown user"))]);

        return new MessageReader();
      }

      const hash = reader.readBytes(HASH_BYTE_LENGTH).getBuffer().toString("hex");
      const message = reader.readRemainingBytes();

      if (!Hmac.verify(message.getBuffer().toString("hex"), hash, user.token)) {
        connection.sendReliable([new JoinGameErrorPacket(DisconnectReason.custom("Signature mismatch"))]);

        return new MessageReader();
      }

      if (connection.hasMeta("clientId")) {
        if (connection.getMeta<string>("clientId") !== clientId) {
          connection.sendReliable([new JoinGameErrorPacket(DisconnectReason.custom("Wrong connection for user"))]);

          return new MessageReader();
        }
      } else {
        connection.setMeta({ clientId });
      }

      // Set other meta like purchases, display name, friends, etc:
      // connection.setMeta({
      //   friends: db.getFriends(clientId),
      //   purchases: db.getPurchases(clientId),
      // });

      this.getLogger().info("Authenticated packet from %s on connection %s: %s", user.name, connection, message);

      return message;
    });

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
    server.getConnection(new ConnectionInfo("127.0.0.1", 42069, AddressFamily.IPv4)).emit("message", MessageReader.fromRawBytes([
      0x01, 0x00, 0x07, 0x06, 0x00, 0x40, 0x05, 0x68, 0x65, 0x6c, 0x6c, 0x6f,
    ]));

    const user = [...USERS.entries()][0];
    const message = MessageReader.fromRawBytes([
      0x01, 0x00, 0x07, 0x06, 0x00, 0x40, 0x05, 0x68, 0x65, 0x6c, 0x6c, 0x6f,
    ]);

    // DEBUG: Simulates sending an authenticated packet from a connection
    server.getSocket().emit(
      "message",
      new MessageWriter()
        .writeByte(0x69)
        .writeBytes(Buffer.from(user[0], "hex"))
        .writeBytes(Buffer.from(Hmac.sign(message.getBuffer().toString("hex"), user[1].token), "hex"))
        .writeBytes(message)
        .getBuffer(),
      {
        address: "127.0.0.1",
        family: "IPv4",
        port: 42069,
        size: -1,
      },
    );
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
    event.getPlayer().getConnection()?.emit("message", MessageReader.fromRawBytes([
      0x01, 0x00, 0x07, 0x06, 0x00, 0x40, 0x05, 0x68, 0x65, 0x6c, 0x6c, 0x6f,
    ]));

    // DEBUG: Simulates sending a TestRpcPacket packet
    event.getPlayer().getConnection()?.emit("message", MessageReader.fromRawBytes([
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
