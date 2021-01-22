import { KillDistance, Language, Level, TaskBarMode } from "./enums";
import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { Bitfield } from "./bitfield";

const VERSIONS = [1, 2, 3, 4];

const LENGTHS = [41, 42, 44, 46];

/**
 * A class used to store, serialize, and deserialize the options when creating
 * or searching for a lobby.
 */
// TODO: Private properties with getters/setters
export class GameOptionsData {
  /**
   * @param version The version of the GameOptionsData (default `4`)
   * @param maxPlayers The maximum number of players (default `10`)
   * @param languages An array of languages (default `[Language.Other]`)
   * @param levels An array of levels (default `[Level.TheSkeld]`)
   * @param playerSpeedModifier A multiplicative number for the speed at which players will move (default `1.0`)
   * @param crewmateLightModifier A multiplicative number for the size of the fog-of-war ring encircling crewmates (default `1.0`)
   * @param impostorLightModifier A multiplicative number for the size of the fog-of-war ring encircling impostors (default `1.5`)
   * @param killCooldown The number of seconds after the game starts, between kills, and after a meeting ends, that an impostor must wait before being able to kill (default `45.0`)
   * @param commonTaskCount The number of common tasks each crewmate will have (default `1`)
   * @param longTaskCount The number of long tasks each crewmate will have (default `1`)
   * @param shortTaskCount The number of short tasks each crewmate will have (default `2`)
   * @param emergencyMeetingCount The number of emergency meetings each player will be able to call (default `1`)
   * @param impostorCount The maximum number of impostors (default `1`)
   * @param killDistance How far of a reach an impostor has when killing crewmates (default `KillDistance.Medium`)
   * @param discussionTime How many seconds before voting starts during a meeting (default `15`)
   * @param votingTime How many seconds players will have to cast a vote during a meeting (default `120`)
   * @param isDefault Whether or not the GameOptionsData is using the default options (default `true`)
   * @param emergencyCooldown How many seconds crewmates must wait between emergency meetings (default `15`)
   * @param confirmEjects Whether or not the game will say if the ejected player was or wasn't an impostor (default `true`)
   * @param visualTasks Whether or not tasks which play animations (e.g. Clear Asteroids) will play those animations to other players (default `true`)
   * @param anonymousVoting Whether or not the votes on the meeting HUD will show the color of the players who voted (default `false`)
   * @param taskBarUpdates When, if at all, the task bar will update to show how many tasks have been completed (default `TaskBarUpdate.Always`)
   */
  constructor(
    public version: number = 4,
    public maxPlayers: number = 10,
    public languages: Language[] = [Language.Other],
    public levels: Level[] = [Level.TheSkeld],
    public playerSpeedModifier: number = 1.0,
    public crewmateLightModifier: number = 1.0,
    public impostorLightModifier: number = 1.5,
    public killCooldown: number = 45.0,
    public commonTaskCount: number = 1,
    public longTaskCount: number = 1,
    public shortTaskCount: number = 2,
    public emergencyMeetingCount: number = 1,
    public impostorCount: number = 1,
    public killDistance: KillDistance = KillDistance.Medium,
    public discussionTime: number = 15,
    public votingTime: number = 120,
    public isDefault: boolean = true,
    public emergencyCooldown: number = 15,
    public confirmEjects: boolean = true,
    public visualTasks: boolean = true,
    public anonymousVoting: boolean = false,
    public taskBarUpdates: TaskBarMode = TaskBarMode.Normal,
  ) {}

  /**
   * Gets whether or not the given version is supported.
   *
   * @param version The version to check
   * @returns `true` if `version` is supported, `false` if not
   */
  static isVersionSupported(version: number): boolean {
    return VERSIONS.includes(version);
  }

  /**
   * Gets whether or not the given length matches the expected value for the
   * given version.
   *
   * @param version The version to check against
   * @param length The length to check
   * @returns `true` if `length` matches the expected length of `version`, `false` if not
   */
  static isExpectedLength(version: number, length: number): boolean {
    return LENGTHS[version - 1] == length;
  }

  /**
   * Gets a new GameOptionsGata by reading from the given MessageReader.
   *
   * @param reader The MessageReader to read from
   * @param isSearching `true` if the data is from a lobby search, `false` if it is from creating a lobby (default `false`)
   */
  static deserialize(reader: MessageReader, isSearching: boolean = false): GameOptionsData {
    const bytes = reader.readBytesAndSize();
    const version = bytes.readByte();

    if (!GameOptionsData.isVersionSupported(version)) {
      throw new Error(`Invalid GameOptionsData version: ${version}`);
    }

    const expectedLength = LENGTHS[version - 1];

    if (!GameOptionsData.isExpectedLength(version, bytes.getLength())) {
      throw new Error(`Invalid GameOptionsData length for version ${version}: expected ${expectedLength} but got ${bytes.getLength()}`);
    }

    return new GameOptionsData(
      version,
      bytes.readByte(),
      Bitfield.fromNumber(bytes.readUInt32(), 32).asNumbers<Language>(),
      isSearching
        ? Bitfield.fromNumber(bytes.readByte(), 8).asNumbers<Level>()
        : [bytes.readByte()],
      bytes.readFloat32(),
      bytes.readFloat32(),
      bytes.readFloat32(),
      bytes.readFloat32(),
      bytes.readByte(),
      bytes.readByte(),
      bytes.readByte(),
      bytes.readUInt32(),
      bytes.readByte(),
      bytes.readByte() as KillDistance,
      bytes.readUInt32(),
      bytes.readUInt32(),
      bytes.readBoolean(),
      version > 1 ? bytes.readByte() : 15,
      version > 2 ? bytes.readBoolean() : true,
      version > 2 ? bytes.readBoolean() : true,
      version > 3 ? bytes.readBoolean() : false,
      version > 3 ? bytes.readByte() as TaskBarMode : TaskBarMode.Normal,
    );
  }

  /**
   * Writes the GameOptionsData to the given MessageWriter
   *
   * @param reader The MessageWriter to write to
   * @param isSearching `true` if the data is from a lobby search, `false` if it is from creating a lobby (default `false`)
   */
  serialize(writer: MessageWriter, isSearching: boolean = false): void {
    writer.writePackedUInt32(LENGTHS[this.version - 1]);
    writer.writeByte(this.version);
    writer.writeByte(this.maxPlayers);
    writer.writeUInt32(this.languages.reduce((a, b) => a | b, 0));
    writer.writeByte(isSearching ? this.levels.reduce((a, b) => a | b) : this.levels[0]);
    writer.writeFloat32(this.playerSpeedModifier);
    writer.writeFloat32(this.crewmateLightModifier);
    writer.writeFloat32(this.impostorLightModifier);
    writer.writeFloat32(this.killCooldown);
    writer.writeByte(this.commonTaskCount);
    writer.writeByte(this.longTaskCount);
    writer.writeByte(this.shortTaskCount);
    writer.writeInt32(this.emergencyMeetingCount);
    writer.writeByte(this.impostorCount);
    writer.writeByte(this.killDistance);
    writer.writeInt32(this.discussionTime);
    writer.writeInt32(this.votingTime);
    writer.writeBoolean(this.isDefault);

    if (this.version > 1) {
      writer.writeByte(this.emergencyCooldown);
    }

    if (this.version > 2) {
      writer.writeBoolean(this.confirmEjects);
      writer.writeBoolean(this.visualTasks);
    }

    if (this.version > 3) {
      writer.writeBoolean(this.anonymousVoting);
      writer.writeByte(this.taskBarUpdates);
    }
  }
}
