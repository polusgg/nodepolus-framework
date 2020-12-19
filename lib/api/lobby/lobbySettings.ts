import { GameOptionsDataV4, GameOptionsData } from "../../types/gameOptionsData";
import { TaskBarUpdate } from "../../types/taskBarUpdate";
import { KillDistance } from "../../types/killDistance";
import { Connection } from "../../protocol/connection";
import { Language } from "../../types/language";
import { Level } from "../../types/level";
import { Player } from "../player";
import { Lobby } from ".";

export class LobbySettings {
  private readonly povCache: Map<number, LobbySettings> = new Map();

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
      return this.lobby.internalLobby.options.options.maxPlayers;
    }

    return this.povModifiedMaxPlayers;
  }

  get languages(): Language[] {
    if (this.povModifiedLanguages === undefined) {
      return this.lobby.internalLobby.options.options.languages;
    }

    return this.povModifiedLanguages;
  }

  get level(): Level {
    if (this.povModifiedLevel === undefined) {
      return this.lobby.internalLobby.options.options.levels[0];
    }

    return this.povModifiedLevel;
  }

  get speed(): number {
    if (this.povModifiedSpeed === undefined) {
      return this.lobby.internalLobby.options.options.playerSpeedModifier;
    }

    return this.povModifiedSpeed;
  }

  get crewVision(): number {
    if (this.povModifiedCrewVision === undefined) {
      return this.lobby.internalLobby.options.options.crewLightModifier;
    }

    return this.povModifiedCrewVision;
  }

  get impostorVision(): number {
    if (this.povModifiedImpostorVision === undefined) {
      return this.lobby.internalLobby.options.options.impostorLightModifier;
    }

    return this.povModifiedImpostorVision;
  }

  get killCooldown(): number {
    if (this.povModifiedKillCooldown === undefined) {
      return this.lobby.internalLobby.options.options.killCooldown;
    }

    return this.povModifiedKillCooldown;
  }

  get commonTaskCount(): number {
    if (this.povModifiedCommonTaskCount === undefined) {
      return this.lobby.internalLobby.options.options.commonTasks;
    }

    return this.povModifiedCommonTaskCount;
  }

  get longTaskCount(): number {
    if (this.povModifiedLongTaskCount === undefined) {
      return this.lobby.internalLobby.options.options.longTasks;
    }

    return this.povModifiedLongTaskCount;
  }

  get shortTaskCount(): number {
    if (this.povModifiedShortTaskCount === undefined) {
      return this.lobby.internalLobby.options.options.shortTasks;
    }

    return this.povModifiedShortTaskCount;
  }

  get emergencyMeetingCount(): number {
    if (this.povModifiedEmergencyMeetingCount === undefined) {
      return this.lobby.internalLobby.options.options.emergencies;
    }

    return this.povModifiedEmergencyMeetingCount;
  }

  get impostorCount(): number {
    if (this.povModifiedImpostorCount === undefined) {
      return this.lobby.internalLobby.options.options.impostorCount;
    }

    return this.povModifiedImpostorCount;
  }

  get killDistance(): KillDistance {
    if (this.povModifiedKillDistance === undefined) {
      return this.lobby.internalLobby.options.options.killDistance;
    }

    return this.povModifiedKillDistance;
  }

  get discussionTime(): number {
    if (this.povModifiedDiscussionTime === undefined) {
      return this.lobby.internalLobby.options.options.discussionTime;
    }

    return this.povModifiedDiscussionTime;
  }

  get votingTime(): number {
    if (this.povModifiedVotingTime === undefined) {
      return this.lobby.internalLobby.options.options.votingTime;
    }

    return this.povModifiedVotingTime;
  }

  get isDefault(): boolean {
    if (this.povModifiedIsDefault === undefined) {
      return this.lobby.internalLobby.options.options.isDefault;
    }

    return this.povModifiedIsDefault;
  }

  get emergencyCooldown(): number {
    if (this.povModifiedEmergencyCooldown === undefined) {
      return (this.lobby.internalLobby.options.options as GameOptionsDataV4).emergencyCooldown;
    }

    return this.povModifiedEmergencyCooldown;
  }

  get confirmEjects(): boolean {
    if (this.povModifiedConfirmEjects === undefined) {
      return (this.lobby.internalLobby.options.options as GameOptionsDataV4).confirmEjects;
    }

    return this.povModifiedConfirmEjects;
  }

  get visualTasks(): boolean {
    if (this.povModifiedVisualTasks === undefined) {
      return (this.lobby.internalLobby.options.options as GameOptionsDataV4).visualTasks;
    }

    return this.povModifiedVisualTasks;
  }

  get anonymousVoting(): boolean {
    if (this.povModifiedAnonymousVoting === undefined) {
      return (this.lobby.internalLobby.options.options as GameOptionsDataV4).anonymousVoting;
    }

    return this.povModifiedAnonymousVoting;
  }

  get taskBarUpdates(): TaskBarUpdate {
    if (this.povModifiedTaskBarUpdates === undefined) {
      return (this.lobby.internalLobby.options.options as GameOptionsDataV4).taskBarUpdates;
    }

    return this.povModifiedTaskBarUpdates;
  }

  constructor(
    public lobby: Lobby,
  ) {}

  setMaxPlayers(param: number): void {
    if (this.isFromPov) {
      this.povModifiedMaxPlayers = param;
    } else {
      this.lobby.internalLobby.options.options.maxPlayers = param;
    }

    this.syncSettingsOnLobby();
  }

  setLanguages(param: Language[]): void {
    if (this.isFromPov) {
      this.povModifiedLanguages = param;
    } else {
      this.lobby.internalLobby.options.options.languages = param;
    }

    this.syncSettingsOnLobby();
  }

  setLevel(param: Level): void {
    if (this.isFromPov) {
      this.povModifiedLevel = param;
    } else {
      this.lobby.internalLobby.options.options.levels = [param];
    }

    this.syncSettingsOnLobby();
  }

  setSpeed(param: number): void {
    if (this.isFromPov) {
      this.povModifiedSpeed = param;
    } else {
      this.lobby.internalLobby.options.options.playerSpeedModifier = param;
    }

    this.syncSettingsOnLobby();
  }

  setCrewVision(param: number): void {
    if (this.isFromPov) {
      this.povModifiedCrewVision = param;
    } else {
      this.lobby.internalLobby.options.options.crewLightModifier = param;
    }

    this.syncSettingsOnLobby();
  }

  setImpostorVision(param: number): void {
    if (this.isFromPov) {
      this.povModifiedImpostorVision = param;
    } else {
      this.lobby.internalLobby.options.options.impostorLightModifier = param;
    }

    this.syncSettingsOnLobby();
  }

  setKillCooldown(param: number): void {
    if (this.isFromPov) {
      this.povModifiedKillCooldown = param;
    } else {
      this.lobby.internalLobby.options.options.killCooldown = param;
    }

    this.syncSettingsOnLobby();
  }

  setCommonTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedCommonTaskCount = param;
    } else {
      this.lobby.internalLobby.options.options.commonTasks = param;
    }

    this.syncSettingsOnLobby();
  }

  setLongTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedLongTaskCount = param;
    } else {
      this.lobby.internalLobby.options.options.longTasks = param;
    }

    this.syncSettingsOnLobby();
  }

  setShortTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedShortTaskCount = param;
    } else {
      this.lobby.internalLobby.options.options.shortTasks = param;
    }

    this.syncSettingsOnLobby();
  }

  setEmergencyMeetingCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedEmergencyMeetingCount = param;
    } else {
      this.lobby.internalLobby.options.options.emergencies = param;
    }

    this.syncSettingsOnLobby();
  }

  setImpostorCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedImpostorCount = param;
    } else {
      this.lobby.internalLobby.options.options.impostorCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setKillDistance(param: KillDistance): void {
    if (this.isFromPov) {
      this.povModifiedKillDistance = param;
    } else {
      this.lobby.internalLobby.options.options.killDistance = param;
    }

    this.syncSettingsOnLobby();
  }

  setDiscussionTime(param: number): void {
    if (this.isFromPov) {
      this.povModifiedDiscussionTime = param;
    } else {
      this.lobby.internalLobby.options.options.discussionTime = param;
    }

    this.syncSettingsOnLobby();
  }

  setVotingTime(param: number): void {
    if (this.isFromPov) {
      this.povModifiedVotingTime = param;
    } else {
      this.lobby.internalLobby.options.options.votingTime = param;
    }

    this.syncSettingsOnLobby();
  }

  setIsDefault(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedIsDefault = param;
    } else {
      this.lobby.internalLobby.options.options.isDefault = param;
    }

    this.syncSettingsOnLobby();
  }

  setEmergencyCooldown(param: number): void {
    if (this.isFromPov) {
      this.povModifiedEmergencyCooldown = param;
    } else {
      (this.lobby.internalLobby.options.options as GameOptionsDataV4).emergencyCooldown = param;
    }

    this.syncSettingsOnLobby();
  }

  setConfirmEjects(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedConfirmEjects = param;
    } else {
      (this.lobby.internalLobby.options.options as GameOptionsDataV4).confirmEjects = param;
    }
    this.syncSettingsOnLobby();
  }

  setVisualTasks(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedVisualTasks = param;
    } else {
      (this.lobby.internalLobby.options.options as GameOptionsDataV4).visualTasks = param;
    }

    this.syncSettingsOnLobby();
  }

  setAnonymousVoting(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedAnonymousVoting = param;
    } else {
      (this.lobby.internalLobby.options.options as GameOptionsDataV4).anonymousVoting = param;
    }

    this.syncSettingsOnLobby();
  }

  setTaskBarUpdates(param: TaskBarUpdate): void {
    if (this.isFromPov) {
      this.povModifiedTaskBarUpdates = param;
    } else {
      (this.lobby.internalLobby.options.options as GameOptionsDataV4).taskBarUpdates = param;
    }

    this.syncSettingsOnLobby();
  }

  fromPov(player: Player): LobbySettings {
    const connection = this.lobby.internalLobby.findConnection(player.getInternalPlayer().gameObject.owner);

    if (connection && this.povCache.has(connection.id)) {
      return this.povCache.get(connection.id)!;
    }

    return LobbySettings.fromPov(this, connection);
  }

  private static fromPov(baseSettings: LobbySettings, connection?: Connection): LobbySettings {
    const povSettings = new LobbySettings(baseSettings.lobby);

    povSettings.isFromPov = true;
    povSettings.fromPovConnection = connection;

    return povSettings;
  }

  private syncSettingsOnLobby(): void {
    if (this.lobby.internalLobby.players[0]) {
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

          console.warn("Attempted to sync lobby settings on a POV without a connection");
        }
      } else {
        sendToConnections = this.lobby.internalLobby.connections;
      }

      this.lobby.internalLobby.players[0].gameObject.playerControl.syncSettings(customOptions, sendToConnections);
    } else {
      console.warn("Attempted to sync lobby settings without a player");
    }
  }
}
