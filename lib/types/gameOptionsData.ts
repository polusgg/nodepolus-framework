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
    private version: number = 4,
    private maxPlayers: number = 10,
    private languages: Language[] = [Language.Other],
    private levels: Level[] = [Level.TheSkeld],
    private playerSpeedModifier: number = 1.0,
    private crewmateLightModifier: number = 1.0,
    private impostorLightModifier: number = 1.5,
    private killCooldown: number = 45.0,
    private commonTaskCount: number = 1,
    private longTaskCount: number = 1,
    private shortTaskCount: number = 2,
    private emergencyMeetingCount: number = 1,
    private impostorCount: number = 1,
    private killDistance: KillDistance = KillDistance.Medium,
    private discussionTime: number = 15,
    private votingTime: number = 120,
    private isDefault: boolean = true,
    private emergencyCooldown: number = 15,
    private confirmEjects: boolean = true,
    private visualTasks: boolean = true,
    private anonymousVoting: boolean = false,
    private taskBarUpdates: TaskBarMode = TaskBarMode.Normal,
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
  setVersion(version: number): void {
    this.version = version;
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
  setMaxPlayers(maxPlayers: number): void {
    this.maxPlayers = maxPlayers;
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
  setLanguages(languages: Language[]): void {
    this.languages = languages;
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
  setLevels(levels: Level[]): void {
    this.levels = levels;
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
  setPlayerSpeedModifier(playerSpeedModifier: number): void {
    this.playerSpeedModifier = playerSpeedModifier;
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
  setCrewmateLightModifier(crewmateLightModifier: number): void {
    this.crewmateLightModifier = crewmateLightModifier;
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
  setImpostorLightModifier(impostorLightModifier: number): void {
    this.impostorLightModifier = impostorLightModifier;
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
  setKillCooldown(killCooldown: number): void {
    this.killCooldown = killCooldown;
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
  setCommonTaskCount(commonTaskCount: number): void {
    this.commonTaskCount = commonTaskCount;
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
  setLongTaskCount(longTaskCount: number): void {
    this.longTaskCount = longTaskCount;
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
  setShortTaskCount(shortTaskCount: number): void {
    this.shortTaskCount = shortTaskCount;
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
  setEmergencyMeetingCount(emergencyMeetingCount: number): void {
    this.emergencyMeetingCount = emergencyMeetingCount;
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
  setImpostorCount(impostorCount: number): void {
    this.impostorCount = impostorCount;
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
  setKillDistance(killDistance: KillDistance): void {
    this.killDistance = killDistance;
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
  setDiscussionTime(discussionTime: number): void {
    this.discussionTime = discussionTime;
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
  setVotingTime(votingTime: number): void {
    this.votingTime = votingTime;
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
  setIsDefault(isDefault: boolean): void {
    this.isDefault = isDefault;
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
  setEmergencyCooldown(emergencyCooldown: number): void {
    this.emergencyCooldown = emergencyCooldown;
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
  setConfirmEjects(confirmEjects: boolean): void {
    this.confirmEjects = confirmEjects;
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
  setVisualTasks(visualTasks: boolean): void {
    this.visualTasks = visualTasks;
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
  setAnonymousVoting(anonymousVoting: boolean): void {
    this.anonymousVoting = anonymousVoting;
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
  setTaskBarUpdates(taskBarUpdates: TaskBarMode): void {
    this.taskBarUpdates = taskBarUpdates;
  }
}
