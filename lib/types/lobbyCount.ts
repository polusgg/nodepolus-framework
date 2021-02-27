import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { Level } from "./enums";

/**
 * A class used to represent the numbers displayed at the bottom of the game
 * list screen indicating how many lobbies exist for each level.
 */
export class LobbyCount {
  /**
   * @param skeld - The number of lobbies playing on The Skeld
   * @param mira - The number of lobbies playing on MIRA HQ
   * @param polus - The number of lobbies playing on Polus
   * @param airship - The number of lobbies playing on Airship
   */
  constructor(
    protected skeld: number = 0,
    protected mira: number = 0,
    protected polus: number = 0,
    protected airship: number = 0,
  ) {}

  /**
   * Gets a new LobbyCount by reading from the given MessageReader.
   *
   * @param reader - The MessageReader to read from
   */
  static deserialize(reader: MessageReader): LobbyCount {
    return new LobbyCount(
      reader.readUInt32(),
      reader.readUInt32(),
      reader.readUInt32(),
      reader.readUInt32(),
    );
  }

  /**
   * Gets the number of lobbies playing on The Skeld.
   */
  getSkeld(): number {
    return this.skeld;
  }

  /**
   * Gets the number of lobbies playing on MIRA HQ.
   */
  getMira(): number {
    return this.mira;
  }

  /**
   * Gets the number of lobbies playing on Polus.
   */
  getPolus(): number {
    return this.polus;
  }

  /**
   * Gets the number of lobbies playing on Airship.
   */
  getAirship(): number {
    return this.airship;
  }

  /**
   * Increments the count for the given level.
   *
   * @param level - The level whose count will be incremented
   */
  increment(level: Level): this {
    return this.add(level, 1);
  }

  /**
   * Decrements the count for the given level.
   *
   * @param level - The level whose count will be decremented
   */
  decrement(level: Level): this {
    return this.add(level, -1);
  }

  /**
   * Adds the given amount to the count for the given level.
   *
   * @param level - The level whose count will be modified
   * @param amount - The amount to add to the count for `level`
   */
  add(level: Level, amount: number): this {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        this.skeld += amount;
        break;
      case Level.MiraHq:
        this.mira += amount;
        break;
      case Level.Polus:
        this.polus += amount;
        break;
      case Level.Airship:
        this.airship += amount;
        break;
    }

    return this;
  }

  /**
   * Sets the count for the given level to the given amount.
   *
   * @param level - The level whose count will be set
   * @param amount - The amount that the count will be set to
   */
  set(level: Level, amount: number): this {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        this.skeld = amount;
        break;
      case Level.MiraHq:
        this.mira = amount;
        break;
      case Level.Polus:
        this.polus = amount;
        break;
      case Level.Airship:
        this.airship = amount;
        break;
    }

    return this;
  }

  /**
   * Writes the LobbyCount to the given MessageWriter
   *
   * @param reader - The MessageWriter to write to
   */
  serialize(writer: MessageWriter): void {
    writer.writeUInt32(this.skeld)
      .writeUInt32(this.mira)
      .writeUInt32(this.polus)
      .writeUInt32(this.airship);
  }

  /**
   * Gets a clone of the LobbyCounts instance.
   */
  clone(): LobbyCount {
    return new LobbyCount(this.skeld, this.mira, this.polus, this.airship);
  }
}
