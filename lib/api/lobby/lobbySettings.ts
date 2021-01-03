import { KillDistance, Language, Level, TaskBarUpdate } from "../../types/enums";
import { Connection } from "../../protocol/connection";
import { GameOptionsData, Mutable } from "../../types";
import { LobbyInstance } from "./lobbyInstance";
import { InternalPlayer } from "../../player";
import { InternalLobby } from "../../lobby";
import { PlayerInstance } from "../player";

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

  constructor(
    public lobby: LobbyInstance,
  ) {}

  getMaxPlayers(): number {
    return this.povModifiedMaxPlayers ?? this.lobby.getOptions().maxPlayers;
  }

  getLanguages(): Language[] {
    return this.povModifiedLanguages ?? (this.lobby.getOptions().languages as Mutable<Language[]>);
  }

  getLevel(): Level {
    return this.povModifiedLevel ?? this.lobby.getOptions().levels[0];
  }

  getSpeed(): number {
    return this.povModifiedSpeed ?? this.lobby.getOptions().playerSpeedModifier;
  }

  getCrewVision(): number {
    return this.povModifiedCrewVision ?? this.lobby.getOptions().crewmateLightModifier;
  }

  getImpostorVision(): number {
    return this.povModifiedImpostorVision ?? this.lobby.getOptions().impostorLightModifier;
  }

  getKillCooldown(): number {
    return this.povModifiedKillCooldown ?? this.lobby.getOptions().killCooldown;
  }

  getCommonTaskCount(): number {
    return this.povModifiedCommonTaskCount ?? this.lobby.getOptions().commonTaskCount;
  }

  getLongTaskCount(): number {
    return this.povModifiedLongTaskCount ?? this.lobby.getOptions().longTaskCount;
  }

  getShortTaskCount(): number {
    return this.povModifiedShortTaskCount ?? this.lobby.getOptions().shortTaskCount;
  }

  getEmergencyMeetingCount(): number {
    return this.povModifiedEmergencyMeetingCount ?? this.lobby.getOptions().emergencyMeetingCount;
  }

  getImpostorCount(): number {
    return this.povModifiedImpostorCount ?? this.lobby.getOptions().impostorCount;
  }

  getKillDistance(): KillDistance {
    return this.povModifiedKillDistance ?? this.lobby.getOptions().killDistance;
  }

  getDiscussionTime(): number {
    return this.povModifiedDiscussionTime ?? this.lobby.getOptions().discussionTime;
  }

  getVotingTime(): number {
    return this.povModifiedVotingTime ?? this.lobby.getOptions().votingTime;
  }

  getIsDefault(): boolean {
    return this.povModifiedIsDefault ?? this.lobby.getOptions().isDefault;
  }

  getEmergencyCooldown(): number {
    return this.povModifiedEmergencyCooldown ?? this.lobby.getOptions().emergencyCooldown;
  }

  getConfirmEjects(): boolean {
    return this.povModifiedConfirmEjects ?? this.lobby.getOptions().confirmEjects;
  }

  getVisualTasks(): boolean {
    return this.povModifiedVisualTasks ?? this.lobby.getOptions().visualTasks;
  }

  getAnonymousVoting(): boolean {
    return this.povModifiedAnonymousVoting ?? this.lobby.getOptions().anonymousVoting;
  }

  getTaskBarUpdates(): TaskBarUpdate {
    return this.povModifiedTaskBarUpdates ?? this.lobby.getOptions().taskBarUpdates;
  }

  setMaxPlayers(param: number): void {
    if (this.isFromPov) {
      this.povModifiedMaxPlayers = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().maxPlayers = param;
    }

    this.syncSettingsOnLobby();
  }

  setLanguages(param: Language[]): void {
    if (this.isFromPov) {
      this.povModifiedLanguages = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().languages = param;
    }

    this.syncSettingsOnLobby();
  }

  setLevel(param: Level): void {
    if (this.isFromPov) {
      this.povModifiedLevel = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().levels = [param];
    }

    this.syncSettingsOnLobby();
  }

  setSpeed(param: number): void {
    if (this.isFromPov) {
      this.povModifiedSpeed = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().playerSpeedModifier = param;
    }

    this.syncSettingsOnLobby();
  }

  setCrewVision(param: number): void {
    if (this.isFromPov) {
      this.povModifiedCrewVision = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().crewmateLightModifier = param;
    }

    this.syncSettingsOnLobby();
  }

  setImpostorVision(param: number): void {
    if (this.isFromPov) {
      this.povModifiedImpostorVision = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().impostorLightModifier = param;
    }

    this.syncSettingsOnLobby();
  }

  setKillCooldown(param: number): void {
    if (this.isFromPov) {
      this.povModifiedKillCooldown = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().killCooldown = param;
    }

    this.syncSettingsOnLobby();
  }

  setCommonTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedCommonTaskCount = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().commonTaskCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setLongTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedLongTaskCount = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().longTaskCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setShortTaskCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedShortTaskCount = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().shortTaskCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setEmergencyMeetingCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedEmergencyMeetingCount = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().emergencyMeetingCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setImpostorCount(param: number): void {
    if (this.isFromPov) {
      this.povModifiedImpostorCount = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().impostorCount = param;
    }

    this.syncSettingsOnLobby();
  }

  setKillDistance(param: KillDistance): void {
    if (this.isFromPov) {
      this.povModifiedKillDistance = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().killDistance = param;
    }

    this.syncSettingsOnLobby();
  }

  setDiscussionTime(param: number): void {
    if (this.isFromPov) {
      this.povModifiedDiscussionTime = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().discussionTime = param;
    }

    this.syncSettingsOnLobby();
  }

  setVotingTime(param: number): void {
    if (this.isFromPov) {
      this.povModifiedVotingTime = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().votingTime = param;
    }

    this.syncSettingsOnLobby();
  }

  setIsDefault(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedIsDefault = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().isDefault = param;
    }

    this.syncSettingsOnLobby();
  }

  setEmergencyCooldown(param: number): void {
    if (this.isFromPov) {
      this.povModifiedEmergencyCooldown = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().emergencyCooldown = param;
    }

    this.syncSettingsOnLobby();
  }

  setConfirmEjects(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedConfirmEjects = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().confirmEjects = param;
    }
    this.syncSettingsOnLobby();
  }

  setVisualTasks(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedVisualTasks = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().visualTasks = param;
    }

    this.syncSettingsOnLobby();
  }

  setAnonymousVoting(param: boolean): void {
    if (this.isFromPov) {
      this.povModifiedAnonymousVoting = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().anonymousVoting = param;
    }

    this.syncSettingsOnLobby();
  }

  setTaskBarUpdates(param: TaskBarUpdate): void {
    if (this.isFromPov) {
      this.povModifiedTaskBarUpdates = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().taskBarUpdates = param;
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
        this.getMaxPlayers(),
        this.getLanguages(),
        [this.getLevel()],
        this.getSpeed(),
        this.getCrewVision(),
        this.getImpostorVision(),
        this.getKillCooldown(),
        this.getCommonTaskCount(),
        this.getLongTaskCount(),
        this.getShortTaskCount(),
        this.getEmergencyMeetingCount(),
        this.getImpostorCount(),
        this.getKillDistance(),
        this.getDiscussionTime(),
        this.getVotingTime(),
        this.getIsDefault(),
        this.getEmergencyCooldown(),
        this.getConfirmEjects(),
        this.getVisualTasks(),
        this.getAnonymousVoting(),
        this.getTaskBarUpdates(),
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

      (this.lobby.getPlayers()[0] as InternalPlayer).gameObject.playerControl.syncSettings(customOptions, sendToConnections);
    } else {
      console.warn("Attempted to sync lobby settings without a player");
    }
  }
}
