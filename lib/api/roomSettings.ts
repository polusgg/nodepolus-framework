import { GameOptionsDataV4, GameOptionsData } from "../types/gameOptionsData";
import { TaskBarUpdate } from "../types/taskBarUpdate";
import { KillDistance } from "../types/killDistance";
import { Connection } from "../protocol/connection";
import { Language } from "../types/language";
import { Level } from "../types/level";
import { Player } from "./player";
import { Room } from "./room";

export class Settings {
  private readonly povCache: Map<number, Settings> = new Map();

  private isFromPov = false;
  private fromPovConnection: Connection | undefined;
  private povModifiedMaxPlayers: number | undefined;
  private povModifiedLanguages: Language[] | undefined;
  private povModifiedLevel: Level | undefined;
  private povModifiedSpeed: number | undefined;
  private povModifiedCrewVision: number | undefined;
  private povModifiedImpostorVision: number | undefined;
  private povModifiedKillCooldown: number | undefined;
  private povModifiedCommonTaskCount: number | undefined;
  private povModifiedLongTaskCount: number | undefined;
  private povModifiedShortTaskCount: number | undefined;
  private povModifiedEmergencyMeetingCount: number | undefined;
  private povModifiedImpostorCount: number | undefined;
  private povModifiedKillDistance: KillDistance | undefined;
  private povModifiedDiscussionTime: number | undefined;
  private povModifiedVotingTime: number | undefined;
  private povModifiedIsDefault: boolean | undefined;
  private povModifiedEmergencyCooldown: number | undefined;
  private povModifiedConfirmEjects: boolean | undefined;
  private povModifiedVisualTasks: boolean | undefined;
  private povModifiedAnonymousVoting: boolean | undefined;
  private povModifiedTaskBarUpdates: TaskBarUpdate | undefined;

  get maxPlayers(): number {
    if (this.povModifiedMaxPlayers === undefined) {
      return this.room.internalRoom.options.options.maxPlayers;
    }

    return this.povModifiedMaxPlayers;
  }

  get languages(): Language[] {
    if (this.povModifiedLanguages === undefined) {
      return this.room.internalRoom.options.options.languages;
    }

    return this.povModifiedLanguages;
  }

  get level(): Level {
    if (this.povModifiedLevel === undefined) {
      return this.room.internalRoom.options.options.levels[0];
    }

    return this.povModifiedLevel;
  }

  get speed(): number {
    if (this.povModifiedSpeed === undefined) {
      return this.room.internalRoom.options.options.playerSpeedModifier;
    }

    return this.povModifiedSpeed;
  }

  get crewVision(): number {
    if (this.povModifiedCrewVision === undefined) {
      return this.room.internalRoom.options.options.crewLightModifier;
    }

    return this.povModifiedCrewVision;
  }

  get impostorVision(): number {
    if (this.povModifiedImpostorVision === undefined) {
      return this.room.internalRoom.options.options.impostorLightModifier;
    }

    return this.povModifiedImpostorVision;
  }

  get killCooldown(): number {
    if (this.povModifiedKillCooldown === undefined) {
      return this.room.internalRoom.options.options.killCooldown;
    }

    return this.povModifiedKillCooldown;
  }

  get commonTaskCount(): number {
    if (this.povModifiedCommonTaskCount === undefined) {
      return this.room.internalRoom.options.options.commonTasks;
    }

    return this.povModifiedCommonTaskCount;
  }

  get longTaskCount(): number {
    if (this.povModifiedLongTaskCount === undefined) {
      return this.room.internalRoom.options.options.longTasks;
    }

    return this.povModifiedLongTaskCount;
  }

  get shortTaskCount(): number {
    if (this.povModifiedShortTaskCount === undefined) {
      return this.room.internalRoom.options.options.shortTasks;
    }

    return this.povModifiedShortTaskCount;
  }

  get emergencyMeetingCount(): number {
    if (this.povModifiedEmergencyMeetingCount === undefined) {
      return this.room.internalRoom.options.options.emergencies;
    }

    return this.povModifiedEmergencyMeetingCount;
  }

  get impostorCount(): number {
    if (this.povModifiedImpostorCount === undefined) {
      return this.room.internalRoom.options.options.impostorCount;
    }

    return this.povModifiedImpostorCount;
  }

  get killDistance(): KillDistance {
    if (this.povModifiedKillDistance === undefined) {
      return this.room.internalRoom.options.options.killDistance;
    }

    return this.povModifiedKillDistance;
  }

  get discussionTime(): number {
    if (this.povModifiedDiscussionTime === undefined) {
      return this.room.internalRoom.options.options.discussionTime;
    }

    return this.povModifiedDiscussionTime;
  }

  get votingTime(): number {
    if (this.povModifiedVotingTime === undefined) {
      return this.room.internalRoom.options.options.votingTime;
    }

    return this.povModifiedVotingTime;
  }

  get isDefault(): boolean {
    if (this.povModifiedIsDefault === undefined) {
      return this.room.internalRoom.options.options.isDefault;
    }

    return this.povModifiedIsDefault;
  }

  get emergencyCooldown(): number {
    if (this.povModifiedEmergencyCooldown === undefined) {
      return (this.room.internalRoom.options.options as GameOptionsDataV4).emergencyCooldown;
    }

    return this.povModifiedEmergencyCooldown;
  }

  get confirmEjects(): boolean {
    if (this.povModifiedConfirmEjects === undefined) {
      return (this.room.internalRoom.options.options as GameOptionsDataV4).confirmEjects;
    }

    return this.povModifiedConfirmEjects;
  }

  get visualTasks(): boolean {
    if (this.povModifiedVisualTasks === undefined) {
      return (this.room.internalRoom.options.options as GameOptionsDataV4).visualTasks;
    }

    return this.povModifiedVisualTasks;
  }

  get anonymousVoting(): boolean {
    if (this.povModifiedAnonymousVoting === undefined) {
      return (this.room.internalRoom.options.options as GameOptionsDataV4).anonymousVoting;
    }

    return this.povModifiedAnonymousVoting;
  }

  get taskBarUpdates(): TaskBarUpdate {
    if (this.povModifiedTaskBarUpdates === undefined) {
      return (this.room.internalRoom.options.options as GameOptionsDataV4).taskBarUpdates;
    }

    return this.povModifiedTaskBarUpdates;
  }

  constructor(
    public room: Room,
  ) {}

  setMaxPlayers(param: number): void {
    if (this.isFromPov) {
      this.povModifiedMaxPlayers = param;
    } else {
      this.room.internalRoom.options.options.maxPlayers = param;
    }

    this.syncSettingsOnRoom();
  }

  setLanguages(param: Language[]): void {
    if (this.isFromPov) {
      this.povModifiedLanguages = param;
    } else {
      this.room.internalRoom.options.options.languages = param;
    }

    this.syncSettingsOnRoom();
  }

  setLevel(param: Level): void {
    if (this.isFromPov) {
      this.povModifiedLevel = param;
    } else {
      this.room.internalRoom.options.options.levels = [param];
    }

    this.syncSettingsOnRoom();
  }

  setSpeed(param: number): void {
    if (this.isFromPov) {
      this.povModifiedSpeed = param;
    } else {
      this.room.internalRoom.options.options.playerSpeedModifier = param;
    }

    this.syncSettingsOnRoom();
  }

  setCrewVision(param: number): void {
    if (this.isFromPov) {
      this.povModifiedCrewVision = param;
    } else {
      this.room.internalRoom.options.options.crewLightModifier = param;
    }

    this.syncSettingsOnRoom();
  }

  setImpostorVision(param: number): void {
    if (this.isFromPov) {
      this.povModifiedImpostorVision = param;
    } else {
      this.room.internalRoom.options.options.impostorLightModifier = param;
    }

    this.syncSettingsOnRoom();
  }

  setKillCooldown(param: number): void {
    if (this.isFromPov) {
      this.povModifiedKillCooldown = param;
    } else {
      this.room.internalRoom.options.options.killCooldown = param;
    }

    this.syncSettingsOnRoom();
  }

  setCommonTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedCommonTaskCount = param;
    } else {
      this.room.internalRoom.options.options.commonTasks = param;
    }

    this.syncSettingsOnRoom();
  }

  setLongTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedLongTaskCount = param;
    } else {
      this.room.internalRoom.options.options.longTasks = param;
    }

    this.syncSettingsOnRoom();
  }

  setShortTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedShortTaskCount = param;
    } else {
      this.room.internalRoom.options.options.shortTasks = param;
    }

    this.syncSettingsOnRoom();
  }

  setEmergencyMeetingCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedEmergencyMeetingCount = param;
    } else {
      this.room.internalRoom.options.options.emergencies = param;
    }

    this.syncSettingsOnRoom();
  }

  setImpostorCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedImpostorCount = param;
    } else {
      this.room.internalRoom.options.options.impostorCount = param;
    }

    this.syncSettingsOnRoom();
  }

  setKillDistance(param: KillDistance): void {
    if (this.isFromPov) {
      this.povModifiedKillDistance = param;
    } else {
      this.room.internalRoom.options.options.killDistance = param;
    }

    this.syncSettingsOnRoom();
  }

  setDiscussionTime(param: number): void {
    if (this.isFromPov) {
      this.povModifiedDiscussionTime = param;
    } else {
      this.room.internalRoom.options.options.discussionTime = param;
    }

    this.syncSettingsOnRoom();
  }

  setVotingTime(param: number): void {
    if (this.isFromPov) {
      this.povModifiedVotingTime = param;
    } else {
      this.room.internalRoom.options.options.votingTime = param;
    }

    this.syncSettingsOnRoom();
  }

  setIsDefault(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedIsDefault = param;
    } else {
      this.room.internalRoom.options.options.isDefault = param;
    }

    this.syncSettingsOnRoom();
  }

  setEmergencyCooldown(param: number): void {
    if (this.isFromPov) {
      this.povModifiedEmergencyCooldown = param;
    } else {
      (this.room.internalRoom.options.options as GameOptionsDataV4).emergencyCooldown = param;
    }

    this.syncSettingsOnRoom();
  }

  setConfirmEjects(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedConfirmEjects = param;
    } else {
      (this.room.internalRoom.options.options as GameOptionsDataV4).confirmEjects = param;
    }
    this.syncSettingsOnRoom();
  }

  setVisualTasks(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedVisualTasks = param;
    } else {
      (this.room.internalRoom.options.options as GameOptionsDataV4).visualTasks = param;
    }

    this.syncSettingsOnRoom();
  }

  setAnonymousVoting(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedAnonymousVoting = param;
    } else {
      (this.room.internalRoom.options.options as GameOptionsDataV4).anonymousVoting = param;
    }

    this.syncSettingsOnRoom();
  }

  setTaskBarUpdates(param: TaskBarUpdate): void {
    if (this.isFromPov) {
      this.povModifiedTaskBarUpdates = param;
    } else {
      (this.room.internalRoom.options.options as GameOptionsDataV4).taskBarUpdates = param;
    }

    this.syncSettingsOnRoom();
  }

  fromPov(player: Player): Settings {
    const connection = this.room.internalRoom.findConnection(player.internalPlayer.gameObject.owner);

    if (connection && this.povCache.has(connection.id)) {
      return this.povCache.get(connection.id)!;
    }

    return Settings.fromPov(this, connection);
  }

  private static fromPov(baseSettings: Settings, connection?: Connection): Settings {
    const povSettings = new Settings(baseSettings.room);

    povSettings.isFromPov = true;
    povSettings.fromPovConnection = connection;

    return povSettings;
  }

  private syncSettingsOnRoom(): void {
    if (this.room.internalRoom.players[0]) {
      const customOptions = new GameOptionsData({
        version: 4,
        length: 46,
        maxPlayers: this.maxPlayers,
        languages: this.languages,
        levels: [this.level],
        playerSpeedModifier: this.speed,
        crewLightModifier: this.crewVision,
        impostorLightModifier: this.impostorVision,
        killCooldown: this.killCooldown,
        commonTasks: this.commonTaskCount,
        longTasks: this.longTaskCount,
        shortTasks: this.shortTaskCount,
        emergencies: this.emergencyMeetingCount,
        impostorCount: this.impostorCount,
        killDistance: this.killDistance,
        discussionTime: this.discussionTime,
        votingTime: this.votingTime,
        isDefault: this.isDefault,
        emergencyCooldown: this.emergencyCooldown,
        confirmEjects: this.confirmEjects,
        visualTasks: this.visualTasks,
        anonymousVoting: this.anonymousVoting,
        taskBarUpdates: this.taskBarUpdates,
      });

      let sendToConnections: Connection[];

      if (this.isFromPov) {
        if (this.fromPovConnection) {
          sendToConnections = [this.fromPovConnection];
        } else {
          sendToConnections = [];

          console.warn("Attempted to sync room settings on a POV without a connection");
        }
      } else {
        sendToConnections = this.room.internalRoom.connections;
      }

      this.room.internalRoom.players[0].gameObject.playerControl.syncSettings(customOptions, sendToConnections);
    } else {
      console.warn("Attempted to sync room settings without a player");
    }
  }
}
