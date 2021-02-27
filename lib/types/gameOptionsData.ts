import { KillDistance, Language, Level, TaskBarMode } from "./enums";
import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { Bitfield, CanSerializeToHazel } from ".";

const VERSIONS = [1, 2, 3, 4];

const LENGTHS = [41, 42, 44, 46];

/**
 * A class used to store, serialize, and deserialize the options when creating
 * or searching for a lobby.
 */
export class GameOptionsData implements CanSerializeToHazel {
  /**
   * @param version - The version of the GameOptionsData (default `4`)
   * @param maxPlayers - The maximum number of players (default `10`)
   * @param languages - An array of languages (default `[Language.Other]`)
   * @param levels - An array of levels (default `[Level.TheSkeld]`)
   * @param playerSpeedModifier - A multiplicative number for the speed at which players will move (default `1.0`)
   * @param crewmateLightModifier - A multiplicative number for the size of the fog-of-war ring encircling Crewmates (default `1.0`)
   * @param impostorLightModifier - A multiplicative number for the size of the fog-of-war ring encircling Impostors (default `1.5`)
   * @param killCooldown - The number of seconds after the game starts, between kills, and after a meeting ends, that an Impostor must wait before being able to kill (default `45.0`)
   * @param commonTaskCount - The number of common tasks each Crewmate will have (default `1`)
   * @param longTaskCount - The number of long tasks each Crewmate will have (default `1`)
   * @param shortTaskCount - The number of short tasks each Crewmate will have (default `2`)
   * @param emergencyMeetingCount - The number of emergency meetings each player will be able to call (default `1`)
   * @param impostorCount - The maximum number of Impostors (default `1`)
   * @param killDistance - How far of a reach an Impostor has when killing Crewmates (default `KillDistance.Medium`)
   * @param discussionTime - How many seconds before voting starts during a meeting (default `15`)
   * @param votingTime - How many seconds players will have to cast a vote during a meeting (default `120`)
   * @param isDefault - `true` if the GameOptionsData is using the default options, `false` if not (default `true`)
   * @param emergencyCooldown - How many seconds Crewmates must wait between emergency meetings (default `15`)
   * @param confirmEjects - `true` if the game will say if the ejected player was or wasn't an Impostor, `false` if not (default `true`)
   * @param visualTasks - `true` if tasks which play animations (e.g. Clear Asteroids) will play those animations to other players, `false` if not (default `true`)
   * @param anonymousVoting - `true` if the votes on the meeting HUD will show the color of the players who voted, `false` if not (default `false`)
   * @param taskBarUpdates - When, if at all, the task bar will update to show how many tasks have been completed (default `TaskBarUpdate.Always`)
   */
  constructor(
    protected version: number = 4,
    protected maxPlayers: number = 10,
    protected languages: Language[] = [Language.Other],
    protected levels: Level[] = [Level.TheSkeld],
    protected playerSpeedModifier: number = 1.0,
    protected crewmateLightModifier: number = 1.0,
    protected impostorLightModifier: number = 1.5,
    protected killCooldown: number = 45.0,
    protected commonTaskCount: number = 1,
    protected longTaskCount: number = 1,
    protected shortTaskCount: number = 2,
    protected emergencyMeetingCount: number = 1,
    protected impostorCount: number = 1,
    protected killDistance: KillDistance = KillDistance.Medium,
    protected discussionTime: number = 15,
    protected votingTime: number = 120,
    protected isDefault: boolean = true,
    protected emergencyCooldown: number = 15,
    protected confirmEjects: boolean = true,
    protected visualTasks: boolean = true,
    protected anonymousVoting: boolean = false,
    protected taskBarUpdates: TaskBarMode = TaskBarMode.Normal,
  ) {}

  /**
   * Gets whether or not the given version is supported.
   *
   * @param version - The version to check
   * @returns `true` if `version` is supported, `false` if not
   */
  static isVersionSupported(version: number): boolean {
    return VERSIONS.includes(version);
  }

  /**
   * Gets whether or not the given length matches the expected value for the
   * given version.
   *
   * @param version - The version to check against
   * @param length - The length to check
   * @returns `true` if `length` matches the expected length of `version`, `false` if not
   */
  static isExpectedLength(version: number, length: number): boolean {
    return LENGTHS[version - 1] === length;
  }

  /**
   * Gets a new GameOptionsGata by reading from the given MessageReader.
   *
   * @param reader - The MessageReader to read from
   * @param isSearching - `true` if the data is from a lobby search, `false` if it is from creating a lobby (default `false`)
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
   * @param reader - The MessageWriter to write to
   * @param isSearching - `true` if the data is from a lobby search, `false` if it is from creating a lobby (default `false`)
   */
  serialize(writer: MessageWriter, isSearching: boolean = false): void {
    writer.writePackedUInt32(LENGTHS[this.version - 1])
      .writeByte(this.version)
      .writeByte(this.maxPlayers)
      .writeUInt32(this.languages.reduce((a, b) => a | b, 0))
      .writeByte(isSearching ? this.levels.reduce((a, b) => a | b) : this.levels[0])
      .writeFloat32(this.playerSpeedModifier)
      .writeFloat32(this.crewmateLightModifier)
      .writeFloat32(this.impostorLightModifier)
      .writeFloat32(this.killCooldown)
      .writeByte(this.commonTaskCount)
      .writeByte(this.longTaskCount)
      .writeByte(this.shortTaskCount)
      .writeInt32(this.emergencyMeetingCount)
      .writeByte(this.impostorCount)
      .writeByte(this.killDistance)
      .writeInt32(this.discussionTime)
      .writeInt32(this.votingTime)
      .writeBoolean(this.isDefault);

    if (this.version > 1) {
      writer.writeByte(this.emergencyCooldown);
    }

    if (this.version > 2) {
      writer.writeBoolean(this.confirmEjects)
        .writeBoolean(this.visualTasks);
    }

    if (this.version > 3) {
      writer.writeBoolean(this.anonymousVoting)
        .writeByte(this.taskBarUpdates);
    }
  }

  /**
   * Gets the version of the GameOptionsData.
   */
  getVersion(): number {
    return this.version;
  }

  /**
   * Sets the version of the GameOptionsData.
   *
   * @param version - The version of the GameOptionsData
   */
  setVersion(version: number): this {
    this.version = version;

    return this;
  }

  /**
   * Gets the maximum number of players.
   */
  getMaxPlayers(): number {
    return this.maxPlayers;
  }

  /**
   * Sets the maximum number of players.
   *
   * @param maxPlayers - The maximum number of players
   */
  setMaxPlayers(maxPlayers: number): this {
    this.maxPlayers = maxPlayers;

    return this;
  }

  /**
   * Gets the array of languages.
   */
  getLanguages(): Language[] {
    return this.languages;
  }

  /**
   * Sets the array of languages.
   *
   * @param languages - The array of languages
   */
  setLanguages(languages: Language[]): this {
    this.languages = languages;

    return this;
  }

  /**
   * Gets the array of levels.
   */
  getLevels(): Level[] {
    return this.levels;
  }

  /**
   * Sets the array of levels.
   *
   * @param levels - The array of levels
   */
  setLevels(levels: Level[]): this {
    this.levels = levels;

    return this;
  }

  /**
   * Gets the multiplicative number for the speed at which players will move.
   */
  getPlayerSpeedModifier(): number {
    return this.playerSpeedModifier;
  }

  /**
   * Sets the multiplicative number for the speed at which players will move.
   *
   * @param playerSpeedModifier - The multiplicative number for the speed at which players will move
   */
  setPlayerSpeedModifier(playerSpeedModifier: number): this {
    this.playerSpeedModifier = playerSpeedModifier;

    return this;
  }

  /**
   * Gets the multiplicative number for the size of the fog-of-war ring
   * encircling Crewmates.
   */
  getCrewmateLightModifier(): number {
    return this.crewmateLightModifier;
  }

  /**
   * Sets the multiplicative number for the size of the fog-of-war ring
   * encircling Crewmates
   *
   * @param crewmateLightModifier - The multiplicative number for the size of the fog-of-war ring encircling Crewmates
   */
  setCrewmateLightModifier(crewmateLightModifier: number): this {
    this.crewmateLightModifier = crewmateLightModifier;

    return this;
  }

  /**
   * Gets the multiplicative number for the size of the fog-of-war ring
   * encircling Impostors.
   */
  getImpostorLightModifier(): number {
    return this.impostorLightModifier;
  }

  /**
   * Sets the multiplicative number for the size of the fog-of-war ring
   * encircling Impostors.
   *
   * @param impostorLightModifier - The multiplicative number for the size of the fog-of-war ring encircling Impostors
   */
  setImpostorLightModifier(impostorLightModifier: number): this {
    this.impostorLightModifier = impostorLightModifier;

    return this;
  }

  /**
   * Gets the number of seconds after the game starts, between kills, and after
   * a meeting ends, that an Impostor must wait before being able to kill.
   */
  getKillCooldown(): number {
    return this.killCooldown;
  }

  /**
   * Sets the number of seconds after the game starts, between kills, and after
   * a meeting ends, that an Impostor must wait before being able to kill
   *
   * @param killCooldown - The number of seconds after the game starts, between kills, and after a meeting ends, that an Impostor must wait before being able to kill
   */
  setKillCooldown(killCooldown: number): this {
    this.killCooldown = killCooldown;

    return this;
  }

  /**
   * Gets the number of common tasks each Crewmate will have.
   */
  getCommonTaskCount(): number {
    return this.commonTaskCount;
  }

  /**
   * Sets the number of common tasks each Crewmate will have.
   *
   * @param commonTaskCount - The number of common tasks each Crewmate will have
   */
  setCommonTaskCount(commonTaskCount: number): this {
    this.commonTaskCount = commonTaskCount;

    return this;
  }

  /**
   * Gets the number of long tasks each Crewmate will have.
   */
  getLongTaskCount(): number {
    return this.longTaskCount;
  }

  /**
   * Sets the number of long tasks each Crewmate will have.
   *
   * @param longTaskCount - The number of long tasks each Crewmate will have
   */
  setLongTaskCount(longTaskCount: number): this {
    this.longTaskCount = longTaskCount;

    return this;
  }

  /**
   * Gets the number of short tasks each Crewmate will have.
   */
  getShortTaskCount(): number {
    return this.shortTaskCount;
  }

  /**
   * Sets the number of short tasks each Crewmate will have.
   *
   * @param shortTaskCount - The number of short tasks each Crewmate will have
   */
  setShortTaskCount(shortTaskCount: number): this {
    this.shortTaskCount = shortTaskCount;

    return this;
  }

  /**
   * Gets the number of emergency meetings each player will be able to call.
   */
  getEmergencyMeetingCount(): number {
    return this.emergencyMeetingCount;
  }

  /**
   * Sets the number of emergency meetings each player will be able to call.
   *
   * @param emergencyMeetingCount - The number of emergency meetings each player will be able to call
   */
  setEmergencyMeetingCount(emergencyMeetingCount: number): this {
    this.emergencyMeetingCount = emergencyMeetingCount;

    return this;
  }

  /**
   * Gets the maximum number of Impostors.
   */
  getImpostorCount(): number {
    return this.impostorCount;
  }

  /**
   * Sets the maximum number of Impostors.
   *
   * @param impostorCount - The maximum number of Impostors
   */
  setImpostorCount(impostorCount: number): this {
    this.impostorCount = impostorCount;

    return this;
  }

  /**
   * Gets how far of a reach an Impostor has when killing Crewmates.
   */
  getKillDistance(): KillDistance {
    return this.killDistance;
  }

  /**
   * Sets how far of a reach an Impostor has when killing Crewmates.
   *
   * @param killDistance - How far of a reach an Impostor has when killing Crewmates
   */
  setKillDistance(killDistance: KillDistance): this {
    this.killDistance = killDistance;

    return this;
  }

  /**
   * Gets how many seconds before voting starts during a meeting.
   */
  getDiscussionTime(): number {
    return this.discussionTime;
  }

  /**
   * Sets how many seconds before voting starts during a meeting.
   *
   * @param discussionTime - How many seconds before voting starts during a meeting
   */
  setDiscussionTime(discussionTime: number): this {
    this.discussionTime = discussionTime;

    return this;
  }

  /**
   * Gets how many seconds players will have to cast a vote during a meeting.
   */
  getVotingTime(): number {
    return this.votingTime;
  }

  /**
   * Sets how many seconds players will have to cast a vote during a meeting.
   *
   * @param votingTime - How many seconds players will have to cast a vote during a meeting
   */
  setVotingTime(votingTime: number): this {
    this.votingTime = votingTime;

    return this;
  }

  /**
   * Gets whether or not the GameOptionsData is using the default options.
   *
   * @returns `true` if the GameOptionsData is using the default options, `false` if not
   */
  getIsDefault(): boolean {
    return this.isDefault;
  }

  /**
   * Sets whether or not the GameOptionsData is using the default options.
   *
   * @param isDefault - `true` if the GameOptionsData is using the default options, `false` if not
   */
  setIsDefault(isDefault: boolean): this {
    this.isDefault = isDefault;

    return this;
  }

  /**
   * Gets how many seconds Crewmates must wait between emergency meetings.
   */
  getEmergencyCooldown(): number {
    return this.emergencyCooldown;
  }

  /**
   * Sets how many seconds Crewmates must wait between emergency meetings.
   *
   * @param emergencyCooldown - How many seconds Crewmates must wait between emergency meetings
   */
  setEmergencyCooldown(emergencyCooldown: number): this {
    this.emergencyCooldown = emergencyCooldown;

    return this;
  }

  /**
   * Gets whether or not the game will say if the ejected player was or wasn't
   * an Impostor.
   *
   * @returns `true` if the game will say if the ejected player was or wasn't an Impostor, `false` if not
   */
  getConfirmEjects(): boolean {
    return this.confirmEjects;
  }

  /**
   * Sets whether or not the game will say if the ejected player was or wasn't
   * an Impostor.
   *
   * @param confirmEjects - `true` if the game will say if the ejected player was or wasn't an Impostor, `false` if not
   */
  setConfirmEjects(confirmEjects: boolean): this {
    this.confirmEjects = confirmEjects;

    return this;
  }

  /**
   * Gets whether or not tasks which play animations (e.g. Clear Asteroids) will
   * play those animations to other players.
   *
   * @returns `true` if tasks which play animations will play those animations to other players, `false` if not
   */
  getVisualTasks(): boolean {
    return this.visualTasks;
  }

  /**
   * Sets whether or not tasks which play animations (e.g. Clear Asteroids) will
   * play those animations to other players.
   *
   * @param visualTasks - `true` if tasks which play animations will play those animations to other players, `false` if not
   */
  setVisualTasks(visualTasks: boolean): this {
    this.visualTasks = visualTasks;

    return this;
  }

  /**
   * Gets whether or not the votes on the meeting HUD will show the color of the
   * players who voted.
   *
   * @returns `true` if the votes on the meeting HUD will show the color of the players who voted, `false` if not
   */
  getAnonymousVoting(): boolean {
    return this.anonymousVoting;
  }

  /**
   * Sets whether or not the votes on the meeting HUD will show the color of the
   * players who voted.
   *
   * @param anonymousVoting - `true` if the votes on the meeting HUD will show the color of the players who voted, `false` if not
   */
  setAnonymousVoting(anonymousVoting: boolean): this {
    this.anonymousVoting = anonymousVoting;

    return this;
  }

  /**
   * Gets when, if at all, the task bar will update to show how many tasks have
   * been completed.
   */
  getTaskBarUpdates(): TaskBarMode {
    return this.taskBarUpdates;
  }

  /**
   * Sets when, if at all, the task bar will update to show how many tasks have
   * been completed.
   *
   * @param taskBarUpdates - When, if at all, the task bar will update to show how many tasks have been completed
   */
  setTaskBarUpdates(taskBarUpdates: TaskBarMode): this {
    this.taskBarUpdates = taskBarUpdates;

    return this;
  }

  /**
   * Gets a clone of the GameOptionsData instance.
   */
  clone(): GameOptionsData {
    return new GameOptionsData(
      this.version,
      this.maxPlayers,
      [...this.languages],
      [...this.levels],
      this.playerSpeedModifier,
      this.crewmateLightModifier,
      this.impostorLightModifier,
      this.killCooldown,
      this.commonTaskCount,
      this.longTaskCount,
      this.shortTaskCount,
      this.emergencyMeetingCount,
      this.impostorCount,
      this.killDistance,
      this.discussionTime,
      this.votingTime,
      this.isDefault,
      this.emergencyCooldown,
      this.confirmEjects,
      this.visualTasks,
      this.anonymousVoting,
      this.taskBarUpdates,
    );
  }
}
