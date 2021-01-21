import { KillDistance, Language, Level, TaskBarMode } from "../../types/enums";
import { Connection } from "../../protocol/connection";
import { GameOptionsData, Mutable } from "../../types";
import { LobbyInstance } from "./lobbyInstance";
import { InternalPlayer } from "../../player";
import { InternalLobby } from "../../lobby";
import { PlayerInstance } from "../player";

export class LobbySettings {
  private static readonly povCache: Map<number, LobbySettings> = new Map();

  private isFromPov = false;
  private fromPovConnection: Connection | undefined;
  private povModifiedSpeed: number | undefined;
  private povModifiedCrewVision: number | undefined;
  private povModifiedImpostorVision: number | undefined;
  private povModifiedKillCooldown: number | undefined;
  private povModifiedEmergencyMeetingCount: number | undefined;
  private povModifiedKillDistance: KillDistance | undefined;
  private povModifiedDiscussionTime: number | undefined;
  private povModifiedVotingTime: number | undefined;
  private povModifiedEmergencyCooldown: number | undefined;
  private povModifiedConfirmEjects: boolean | undefined;
  private povModifiedVisualTasks: boolean | undefined;
  private povModifiedAnonymousVoting: boolean | undefined;
  private povModifiedTaskBarUpdates: TaskBarMode | undefined;

  constructor(
    public lobby: LobbyInstance,
  ) {}

  getMaxPlayers(): number {
    return this.lobby.getOptions().maxPlayers;
  }

  getLanguages(): readonly Language[] {
    return this.lobby.getOptions().languages;
  }

  getLevel(): Level {
    return this.lobby.getOptions().levels[0];
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
    return this.lobby.getOptions().commonTaskCount;
  }

  getLongTaskCount(): number {
    return this.lobby.getOptions().longTaskCount;
  }

  getShortTaskCount(): number {
    return this.lobby.getOptions().shortTaskCount;
  }

  getEmergencyMeetingCount(): number {
    return this.povModifiedEmergencyMeetingCount ?? this.lobby.getOptions().emergencyMeetingCount;
  }

  getImpostorCount(): number {
    return this.lobby.getOptions().impostorCount;
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
    return this.lobby.getOptions().isDefault;
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

  getTaskBarUpdates(): TaskBarMode {
    return this.povModifiedTaskBarUpdates ?? this.lobby.getOptions().taskBarUpdates;
  }

  setMaxPlayers(param: number): void {
    if (this.isFromPov) {
      throw new Error("Cannot modify the MaxPlayers setting on a per-player basis");
    }

    (this.lobby as InternalLobby).getMutableOptions().maxPlayers = param;

    this.syncSettingsOnLobby();
  }

  setLanguages(param: Language[]): void {
    if (this.isFromPov) {
      throw new Error("Cannot modify the Languages setting on a per-player basis");
    }

    (this.lobby as InternalLobby).getMutableOptions().languages = param;

    this.syncSettingsOnLobby();
  }

  setLevel(param: Level): void {
    if (this.isFromPov) {
      throw new Error("Cannot modify the Level setting on a per-player basis");
    }

    (this.lobby as InternalLobby).getMutableOptions().levels = [param];

    this.syncSettingsOnLobby();
  }

  setSpeed(param: number): void {
    if (this.isFromPov) {
      this.povModifiedSpeed = param;
    }

    (this.lobby as InternalLobby).getMutableOptions().playerSpeedModifier = param;

    this.syncSettingsOnLobby();
  }

  setCrewVision(param: number): void {
    if (this.isFromPov) {
      this.povModifiedCrewVision = param;
    }

    (this.lobby as InternalLobby).getMutableOptions().crewmateLightModifier = param;

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
      throw new Error("Cannot modify the CommonTaskCount setting on a per-player basis");
    }

    (this.lobby as InternalLobby).getMutableOptions().commonTaskCount = param;

    this.syncSettingsOnLobby();
  }

  setLongTaskCount(param: number): void {
    if (this.isFromPov) {
      throw new Error("Cannot modify the LongTaskCount setting on a per-player basis");
    }

    (this.lobby as InternalLobby).getMutableOptions().longTaskCount = param;

    this.syncSettingsOnLobby();
  }

  setShortTaskCount(param: number): void {
    if (this.isFromPov) {
      throw new Error("Cannot modify the ShortTaskCount setting on a per-player basis");
    }

    (this.lobby as InternalLobby).getMutableOptions().shortTaskCount = param;

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
      throw new Error("Cannot modify the ImpostorCount setting on a per-player basis");
    }

    (this.lobby as InternalLobby).getMutableOptions().impostorCount = param;

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
      throw new Error("Cannot modify the IsDefault setting on a per-player basis");
    }

    (this.lobby as InternalLobby).getMutableOptions().isDefault = param;

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

  setTaskBarUpdates(param: TaskBarMode): void {
    if (this.isFromPov) {
      this.povModifiedTaskBarUpdates = param;
    } else {
      (this.lobby as InternalLobby).getMutableOptions().taskBarUpdates = param;
    }

    this.syncSettingsOnLobby();
  }

  fromPov(player: PlayerInstance): LobbySettings {
    if (this.isFromPov) {
      throw new Error("Cannot call fromPov on a LobbySettings instance that is already used as a POV instance");
    }

    const connection = player.getConnection();

    if (connection === undefined) {
      throw new Error(`Player ${player.getId()} does not have a connection on the lobby instance`);
    }

    if (LobbySettings.povCache.has(connection.id)) {
      return LobbySettings.povCache.get(connection.id)!;
    }

    const povSettings = new LobbySettings(this.lobby);

    povSettings.isFromPov = true;
    povSettings.fromPovConnection = connection;

    LobbySettings.povCache.set(connection.id, povSettings);

    return povSettings;
  }

  private syncSettingsOnLobby(): void {
    if (this.lobby.getPlayers()[0]) {
      const customOptions = new GameOptionsData(
        4,
        this.getMaxPlayers(),
        this.getLanguages() as Mutable<Language[]>,
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
          (this.lobby as InternalLobby).getLogger().warn("Attempted to sync lobby settings on a POV without a connection");

          sendToConnections = [];
        }
      } else {
        sendToConnections = this.lobby.getConnections();
      }

      (this.lobby.getPlayers()[0] as InternalPlayer).gameObject.playerControl.syncSettings(customOptions, sendToConnections);
    } else {
      (this.lobby as InternalLobby).getLogger().warn("Attempted to sync lobby settings without a player");
    }
  }
}
