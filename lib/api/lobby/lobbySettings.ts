import { KillDistance, Language, Level, TaskBarUpdate } from "../../types/enums";
import { Connection } from "../../protocol/connection";
import { LobbyInstance } from "./lobbyInstance";
import { InternalPlayer } from "../../player";
import { GameOptionsData } from "../../types";
import { InternalLobby } from "../../lobby";
import { PlayerInstance } from "../player";

// TODO: Rewrite: don't cast to an internal class from within the API folder
//       Options should just be a getter on the interface

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
      return (this.lobby as InternalLobby).options.maxPlayers;
    }

    return this.povModifiedMaxPlayers;
  }

  get languages(): Language[] {
    if (this.povModifiedLanguages === undefined) {
      return (this.lobby as InternalLobby).options.languages;
    }

    return this.povModifiedLanguages;
  }

  get level(): Level {
    if (this.povModifiedLevel === undefined) {
      return (this.lobby as InternalLobby).options.levels[0];
    }

    return this.povModifiedLevel;
  }

  get speed(): number {
    if (this.povModifiedSpeed === undefined) {
      return (this.lobby as InternalLobby).options.playerSpeedModifier;
    }

    return this.povModifiedSpeed;
  }

  get crewVision(): number {
    if (this.povModifiedCrewVision === undefined) {
      return (this.lobby as InternalLobby).options.crewmateLightModifier;
    }

    return this.povModifiedCrewVision;
  }

  get impostorVision(): number {
    if (this.povModifiedImpostorVision === undefined) {
      return (this.lobby as InternalLobby).options.impostorLightModifier;
    }

    return this.povModifiedImpostorVision;
  }

  get killCooldown(): number {
    if (this.povModifiedKillCooldown === undefined) {
      return (this.lobby as InternalLobby).options.killCooldown;
    }

    return this.povModifiedKillCooldown;
  }

  get commonTaskCount(): number {
    if (this.povModifiedCommonTaskCount === undefined) {
      return (this.lobby as InternalLobby).options.commonTaskCount;
    }

    return this.povModifiedCommonTaskCount;
  }

  get longTaskCount(): number {
    if (this.povModifiedLongTaskCount === undefined) {
      return (this.lobby as InternalLobby).options.longTaskCount;
    }

    return this.povModifiedLongTaskCount;
  }

  get shortTaskCount(): number {
    if (this.povModifiedShortTaskCount === undefined) {
      return (this.lobby as InternalLobby).options.shortTaskCount;
    }

    return this.povModifiedShortTaskCount;
  }

  get emergencyMeetingCount(): number {
    if (this.povModifiedEmergencyMeetingCount === undefined) {
      return (this.lobby as InternalLobby).options.emergencyMeetingCount;
    }

    return this.povModifiedEmergencyMeetingCount;
  }

  get impostorCount(): number {
    if (this.povModifiedImpostorCount === undefined) {
      return (this.lobby as InternalLobby).options.impostorCount;
    }

    return this.povModifiedImpostorCount;
  }

  get killDistance(): KillDistance {
    if (this.povModifiedKillDistance === undefined) {
      return (this.lobby as InternalLobby).options.killDistance;
    }

    return this.povModifiedKillDistance;
  }

  get discussionTime(): number {
    if (this.povModifiedDiscussionTime === undefined) {
      return (this.lobby as InternalLobby).options.discussionTime;
    }

    return this.povModifiedDiscussionTime;
  }

  get votingTime(): number {
    if (this.povModifiedVotingTime === undefined) {
      return (this.lobby as InternalLobby).options.votingTime;
    }

    return this.povModifiedVotingTime;
  }

  get isDefault(): boolean {
    if (this.povModifiedIsDefault === undefined) {
      return (this.lobby as InternalLobby).options.isDefault;
    }

    return this.povModifiedIsDefault;
  }

  get emergencyCooldown(): number {
    if (this.povModifiedEmergencyCooldown === undefined) {
      return (this.lobby as InternalLobby).options.emergencyCooldown;
    }

    return this.povModifiedEmergencyCooldown;
  }

  get confirmEjects(): boolean {
    if (this.povModifiedConfirmEjects === undefined) {
      return (this.lobby as InternalLobby).options.confirmEjects;
    }

    return this.povModifiedConfirmEjects;
  }

  get visualTasks(): boolean {
    if (this.povModifiedVisualTasks === undefined) {
      return (this.lobby as InternalLobby).options.visualTasks;
    }

    return this.povModifiedVisualTasks;
  }

  get anonymousVoting(): boolean {
    if (this.povModifiedAnonymousVoting === undefined) {
      return (this.lobby as InternalLobby).options.anonymousVoting;
    }

    return this.povModifiedAnonymousVoting;
  }

  get taskBarUpdates(): TaskBarUpdate {
    if (this.povModifiedTaskBarUpdates === undefined) {
      return (this.lobby as InternalLobby).options.taskBarUpdates;
    }

    return this.povModifiedTaskBarUpdates;
  }

  constructor(
    public lobby: LobbyInstance,
  ) {}

  setMaxPlayers(param: number): void {
    if (this.isFromPov) {
      this.povModifiedMaxPlayers = param;
    } else {
      (this.lobby as InternalLobby).options.maxPlayers = param;
    }

    this.syncSettingsOnLobby();
  }

  setLanguages(param: Language[]): void {
    if (this.isFromPov) {
      this.povModifiedLanguages = param;
    } else {
      (this.lobby as InternalLobby).options.languages = param;
    }

    this.syncSettingsOnLobby();
  }

  setLevel(param: Level): void {
    if (this.isFromPov) {
      this.povModifiedLevel = param;
    } else {
      (this.lobby as InternalLobby).options.levels = [param];
    }

    this.syncSettingsOnLobby();
  }

  setSpeed(param: number): void {
    if (this.isFromPov) {
      this.povModifiedSpeed = param;
    } else {
      (this.lobby as InternalLobby).options.playerSpeedModifier = param;
    }

    this.syncSettingsOnLobby();
  }

  setCrewVision(param: number): void {
    if (this.isFromPov) {
      this.povModifiedCrewVision = param;
    } else {
      (this.lobby as InternalLobby).options.crewmateLightModifier = param;
    }

    this.syncSettingsOnLobby();
  }

  setImpostorVision(param: number): void {
    if (this.isFromPov) {
      this.povModifiedImpostorVision = param;
    } else {
      (this.lobby as InternalLobby).options.impostorLightModifier = param;
    }

    this.syncSettingsOnLobby();
  }

  setKillCooldown(param: number): void {
    if (this.isFromPov) {
      this.povModifiedKillCooldown = param;
    } else {
      (this.lobby as InternalLobby).options.killCooldown = param;
    }

    this.syncSettingsOnLobby();
  }

  setCommonTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedCommonTaskCount = param;
    } else {
      (this.lobby as InternalLobby).options.commonTaskCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setLongTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedLongTaskCount = param;
    } else {
      (this.lobby as InternalLobby).options.longTaskCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setShortTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedShortTaskCount = param;
    } else {
      (this.lobby as InternalLobby).options.shortTaskCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setEmergencyMeetingCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedEmergencyMeetingCount = param;
    } else {
      (this.lobby as InternalLobby).options.emergencyMeetingCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setImpostorCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedImpostorCount = param;
    } else {
      (this.lobby as InternalLobby).options.impostorCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setKillDistance(param: KillDistance): void {
    if (this.isFromPov) {
      this.povModifiedKillDistance = param;
    } else {
      (this.lobby as InternalLobby).options.killDistance = param;
    }

    this.syncSettingsOnLobby();
  }

  setDiscussionTime(param: number): void {
    if (this.isFromPov) {
      this.povModifiedDiscussionTime = param;
    } else {
      (this.lobby as InternalLobby).options.discussionTime = param;
    }

    this.syncSettingsOnLobby();
  }

  setVotingTime(param: number): void {
    if (this.isFromPov) {
      this.povModifiedVotingTime = param;
    } else {
      (this.lobby as InternalLobby).options.votingTime = param;
    }

    this.syncSettingsOnLobby();
  }

  setIsDefault(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedIsDefault = param;
    } else {
      (this.lobby as InternalLobby).options.isDefault = param;
    }

    this.syncSettingsOnLobby();
  }

  setEmergencyCooldown(param: number): void {
    if (this.isFromPov) {
      this.povModifiedEmergencyCooldown = param;
    } else {
      (this.lobby as InternalLobby).options.emergencyCooldown = param;
    }

    this.syncSettingsOnLobby();
  }

  setConfirmEjects(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedConfirmEjects = param;
    } else {
      (this.lobby as InternalLobby).options.confirmEjects = param;
    }
    this.syncSettingsOnLobby();
  }

  setVisualTasks(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedVisualTasks = param;
    } else {
      (this.lobby as InternalLobby).options.visualTasks = param;
    }

    this.syncSettingsOnLobby();
  }

  setAnonymousVoting(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedAnonymousVoting = param;
    } else {
      (this.lobby as InternalLobby).options.anonymousVoting = param;
    }

    this.syncSettingsOnLobby();
  }

  setTaskBarUpdates(param: TaskBarUpdate): void {
    if (this.isFromPov) {
      this.povModifiedTaskBarUpdates = param;
    } else {
      (this.lobby as InternalLobby).options.taskBarUpdates = param;
    }

    this.syncSettingsOnLobby();
  }

  fromPov(player: PlayerInstance): LobbySettings {
    const connection = this.lobby.findConnectionByPlayer(player);

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
    if (this.lobby.getPlayers()[0]) {
      const customOptions = new GameOptionsData(
        4,
        this.maxPlayers,
        this.languages,
        [this.level],
        this.speed,
        this.crewVision,
        this.impostorVision,
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

      let sendToConnections: Connection[];

      if (this.isFromPov) {
        if (this.fromPovConnection) {
          sendToConnections = [this.fromPovConnection];
        } else {
          sendToConnections = [];

          console.warn("Attempted to sync lobby settings on a POV without a connection");
        }
      } else {
        sendToConnections = this.lobby.getConnections();
      }

      // TODO: Don't cast to an internal class from within the API folder
      (this.lobby.getPlayers()[0] as InternalPlayer).gameObject.playerControl.syncSettings(customOptions, sendToConnections);
    } else {
      console.warn("Attempted to sync lobby settings without a player");
    }
  }
}
