import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { LobbyCode } from "../util/lobbyCode";
import { Level } from "./enums";

/**
 * A class used to represent a lobby when searching for public games.
 */
export class LobbyListing {
  /**
   * @param ipAddress - The IP address to which the server hosting the lobby is bound
   * @param port - The port on which the server hosting the lobby listens for packets
   * @param lobbyCode - The code for the lobby
   * @param hostName - The display name of the lobby
   * @param playerCount - The number of players in the lobby
   * @param age - The age, in seconds, of the lobby
   * @param level - The level that the lobby is set to play on
   * @param impostorCount - The max number of Impostors in the lobby
   * @param maxPlayers - The max number of players allowed in the lobby
   */
  constructor(
    private readonly ipAddress: string,
    private readonly port: number,
    private readonly lobbyCode: string,
    private readonly hostName: string,
    private readonly playerCount: number,
    private readonly age: number,
    private readonly level: Level,
    private readonly impostorCount: number,
    private readonly maxPlayers: number,
  ) {}

  /**
   * Gets a new LobbyListing by reading from the given MessageReader.
   *
   * @param reader - The MessageReader to read from
   */
  static deserialize(reader: MessageReader): LobbyListing {
    return new LobbyListing(
      reader.readBytes(4).getBuffer().join("."),
      reader.readUInt16(),
      LobbyCode.decode(reader.readInt32()),
      reader.readString(),
      reader.readByte(),
      reader.readPackedUInt32(),
      reader.readByte(),
      reader.readByte(),
      reader.readByte(),
    );
  }

  /**
   * Gets the IP address to which the server hosting the lobby is bound.
   */
  getIpAddress(): string {
    return this.ipAddress;
  }

  /**
   * Gets the port on which the server hosting the lobby listens for packets.
   */
  getPort(): number {
    return this.port;
  }

  /**
   * Gets the code for the lobby.
   */
  getLobbyCode(): string {
    return this.lobbyCode;
  }

  /**
   * Gets the display name of the lobby.
   */
  getHostName(): string {
    return this.hostName;
  }

  /**
   * Gets the number of players in the lobby.
   */
  getPlayerCount(): number {
    return this.playerCount;
  }

  /**
   * Gets the age, in seconds, of the lobby.
   */
  getAge(): number {
    return this.age;
  }

  /**
   * Gets the level that the lobby is set to play on.
   */
  getLevel(): Level {
    return this.level;
  }

  /**
   * Gets the max number of Impostors in the lobby.
   */
  getImpostorCount(): number {
    return this.impostorCount;
  }

  /**
   * Gets the max number of players allowed in the lobby.
   */
  getMaxPlayers(): number {
    return this.maxPlayers;
  }

  /**
   * Gets whether or not the lobby has reached its maximum number of players.
   *
   * @returns `true` if `getPlayerCount() >= getMaxPlayers()`, `false` if not
   */
  isFull(): boolean {
    return this.playerCount >= this.maxPlayers;
  }

  /**
   * Writes the LobbyListing to the given MessageWriter
   *
   * @param reader - The MessageWriter to write to
   */
  serialize(writer: MessageWriter): void {
    writer.writeBytes(this.ipAddress.split(".").map(octet => parseInt(octet, 10)))
      .writeUInt16(this.port)
      .writeInt32(LobbyCode.encode(this.lobbyCode))
      .writeString(this.hostName)
      .writeByte(this.playerCount)
      .writePackedUInt32(this.age)
      .writeByte(this.level)
      .writeByte(this.impostorCount)
      .writeByte(this.maxPlayers);
  }

  /**
   * Gets a clone of the LobbyListing instance.
   */
  clone(): LobbyListing {
    return new LobbyListing(
      this.ipAddress,
      this.port,
      this.lobbyCode,
      this.hostName,
      this.playerCount,
      this.age,
      this.level,
      this.impostorCount,
      this.maxPlayers,
    );
  }
}
