import { KillDistance, Language, Level, TaskBarMode } from "../../types/enums";
import { Connection } from "../../protocol/connection";
import { GameOptionsData, Mutable } from "../../types";
import { LobbyInstance } from "./lobbyInstance";
import { InternalPlayer } from "../../player";
import { PlayerInstance } from "../player";

export class LobbySettings {
  protected isPov = false;
  protected connection?: Connection;
  protected povSpeed?: number;
  protected povCrewVision?: number;
  protected povImpostorVision?: number;
  protected povKillCooldown?: number;
  protected povEmergencyMeetingCount?: number;
  protected povKillDistance?: KillDistance;
  protected povDiscussionTime?: number;
  protected povVotingTime?: number;
  protected povEmergencyCooldown?: number;
  protected povConfirmEjects?: boolean;
  protected povVisualTasks?: boolean;
  protected povAnonymousVoting?: boolean;
  protected povTaskBarUpdates?: TaskBarMode;

  private static readonly povCache: Map<number, LobbySettings> = new Map();

  constructor(
    protected readonly lobby: LobbyInstance,
  ) {}

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  getMaxPlayers(): number {
    return this.lobby.getOptions().getMaxPlayers();
  }

  getLanguages(): readonly Language[] {
    return this.lobby.getOptions().getLanguages();
  }

  getLevel(): Level {
    return this.lobby.getOptions().getLevels()[0];
  }

  getSpeed(): number {
    return this.povSpeed ?? this.lobby.getOptions().getPlayerSpeedModifier();
  }

  getCrewateVision(): number {
    return this.povCrewVision ?? this.lobby.getOptions().getCrewmateLightModifier();
  }

  getImpostorVision(): number {
    return this.povImpostorVision ?? this.lobby.getOptions().getImpostorLightModifier();
  }

  getKillCooldown(): number {
    return this.povKillCooldown ?? this.lobby.getOptions().getKillCooldown();
  }

  getCommonTaskCount(): number {
    return this.lobby.getOptions().getCommonTaskCount();
  }

  getLongTaskCount(): number {
    return this.lobby.getOptions().getLongTaskCount();
  }

  getShortTaskCount(): number {
    return this.lobby.getOptions().getShortTaskCount();
  }

  getEmergencyMeetingCount(): number {
    return this.povEmergencyMeetingCount ?? this.lobby.getOptions().getEmergencyMeetingCount();
  }

  getImpostorCount(): number {
    return this.lobby.getOptions().getImpostorCount();
  }

  getKillDistance(): KillDistance {
    return this.povKillDistance ?? this.lobby.getOptions().getKillDistance();
  }

  getDiscussionTime(): number {
    return this.povDiscussionTime ?? this.lobby.getOptions().getDiscussionTime();
  }

  getVotingTime(): number {
    return this.povVotingTime ?? this.lobby.getOptions().getVotingTime();
  }

  getIsDefault(): boolean {
    return this.lobby.getOptions().getIsDefault();
  }

  getEmergencyCooldown(): number {
    return this.povEmergencyCooldown ?? this.lobby.getOptions().getEmergencyCooldown();
  }

  getConfirmEjects(): boolean {
    return this.povConfirmEjects ?? this.lobby.getOptions().getConfirmEjects();
  }

  getVisualTasks(): boolean {
    return this.povVisualTasks ?? this.lobby.getOptions().getVisualTasks();
  }

  getAnonymousVoting(): boolean {
    return this.povAnonymousVoting ?? this.lobby.getOptions().getAnonymousVoting();
  }

  getTaskBarUpdates(): TaskBarMode {
    return this.povTaskBarUpdates ?? this.lobby.getOptions().getTaskBarUpdates();
  }

  setMaxPlayers(param: number): void {
    if (this.isPov) {
      throw new Error("Cannot modify the MaxPlayers setting on a per-player basis");
    }

    this.lobby.getOptions().setMaxPlayers(param);
    this.syncSettingsOnLobby();
  }

  setLanguages(param: Language[]): void {
    if (this.isPov) {
      throw new Error("Cannot modify the Languages setting on a per-player basis");
    }

    this.lobby.getOptions().setLanguages(param);
    this.syncSettingsOnLobby();
  }

  setLevel(param: Level): void {
    if (this.isPov) {
      throw new Error("Cannot modify the Level setting on a per-player basis");
    }

    this.lobby.getOptions().setLevels([param]);
    this.syncSettingsOnLobby();
  }

  setSpeed(param: number): void {
    if (this.isPov) {
      this.povSpeed = param;
    } else {
      this.lobby.getOptions().setPlayerSpeedModifier(param);
    }

    this.syncSettingsOnLobby();
  }

  setCrewmateVision(param: number): void {
    if (this.isPov) {
      this.povCrewVision = param;
    } else {
      this.lobby.getOptions().setCrewmateLightModifier(param);
    }

    this.syncSettingsOnLobby();
  }

  setImpostorVision(param: number): void {
    if (this.isPov) {
      this.povImpostorVision = param;
    } else {
      this.lobby.getOptions().setImpostorLightModifier(param);
    }

    this.syncSettingsOnLobby();
  }

  setKillCooldown(param: number): void {
    if (this.isPov) {
      this.povKillCooldown = param;
    } else {
      this.lobby.getOptions().setKillCooldown(param);
    }

    this.syncSettingsOnLobby();
  }

  setCommonTaskCount(param: number): void {
    if (this.isPov) {
      throw new Error("Cannot modify the CommonTaskCount setting on a per-player basis");
    }

    this.lobby.getOptions().setCommonTaskCount(param);
    this.syncSettingsOnLobby();
  }

  setLongTaskCount(param: number): void {
    if (this.isPov) {
      throw new Error("Cannot modify the LongTaskCount setting on a per-player basis");
    }

    this.lobby.getOptions().setLongTaskCount(param);
    this.syncSettingsOnLobby();
  }

  setShortTaskCount(param: number): void {
    if (this.isPov) {
      throw new Error("Cannot modify the ShortTaskCount setting on a per-player basis");
    }

    this.lobby.getOptions().setShortTaskCount(param);
    this.syncSettingsOnLobby();
  }

  setEmergencyMeetingCount(param: number): void {
    if (this.isPov) {
      this.povEmergencyMeetingCount = param;
    } else {
      this.lobby.getOptions().setEmergencyMeetingCount(param);
    }

    this.syncSettingsOnLobby();
  }

  setImpostorCount(param: number): void {
    if (this.isPov) {
      throw new Error("Cannot modify the ImpostorCount setting on a per-player basis");
    }

    this.lobby.getOptions().setImpostorCount(param);
    this.syncSettingsOnLobby();
  }

  setKillDistance(param: KillDistance): void {
    if (this.isPov) {
      this.povKillDistance = param;
    } else {
      this.lobby.getOptions().setKillDistance(param);
    }

    this.syncSettingsOnLobby();
  }

  setDiscussionTime(param: number): void {
    if (this.isPov) {
      this.povDiscussionTime = param;
    } else {
      this.lobby.getOptions().setDiscussionTime(param);
    }

    this.syncSettingsOnLobby();
  }

  setVotingTime(param: number): void {
    if (this.isPov) {
      this.povVotingTime = param;
    } else {
      this.lobby.getOptions().setVotingTime(param);
    }

    this.syncSettingsOnLobby();
  }

  setIsDefault(param: boolean): void {
    if (this.isPov) {
      throw new Error("Cannot modify the IsDefault setting on a per-player basis");
    }

    this.lobby.getOptions().setIsDefault(param);
    this.syncSettingsOnLobby();
  }

  setEmergencyCooldown(param: number): void {
    if (this.isPov) {
      this.povEmergencyCooldown = param;
    } else {
      this.lobby.getOptions().setEmergencyCooldown(param);
    }

    this.syncSettingsOnLobby();
  }

  setConfirmEjects(param: boolean): void {
    if (this.isPov) {
      this.povConfirmEjects = param;
    } else {
      this.lobby.getOptions().setConfirmEjects(param);
    }

    this.syncSettingsOnLobby();
  }

  setVisualTasks(param: boolean): void {
    if (this.isPov) {
      this.povVisualTasks = param;
    } else {
      this.lobby.getOptions().setVisualTasks(param);
    }

    this.syncSettingsOnLobby();
  }

  setAnonymousVoting(param: boolean): void {
    if (this.isPov) {
      this.povAnonymousVoting = param;
    } else {
      this.lobby.getOptions().setAnonymousVoting(param);
    }

    this.syncSettingsOnLobby();
  }

  setTaskBarUpdates(param: TaskBarMode): void {
    if (this.isPov) {
      this.povTaskBarUpdates = param;
    } else {
      this.lobby.getOptions().setTaskBarUpdates(param);
    }

    this.syncSettingsOnLobby();
  }

  fromPov(player: PlayerInstance): LobbySettings {
    if (this.isPov) {
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

    povSettings.isPov = true;
    povSettings.connection = connection;

    LobbySettings.povCache.set(connection.id, povSettings);

    return povSettings;
  }

  protected syncSettingsOnLobby(): void {
    if (this.lobby.getPlayers()[0]) {
      const customOptions = new GameOptionsData(
        4,
        this.getMaxPlayers(),
        this.getLanguages() as Mutable<Language[]>,
        [this.getLevel()],
        this.getSpeed(),
        this.getCrewateVision(),
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

      if (this.isPov) {
        if (this.connection) {
          sendToConnections = [this.connection];
        } else {
          this.lobby.getLogger().warn("Attempted to sync lobby settings on a POV without a connection");

          sendToConnections = [];
        }
      } else {
        sendToConnections = this.lobby.getConnections();
      }

      (this.lobby.getPlayers()[0] as InternalPlayer).entity.getPlayerControl().syncSettings(customOptions, sendToConnections);
    } else {
      this.lobby.getLogger().warn("Attempted to sync lobby settings without a player");
    }
  }
}
