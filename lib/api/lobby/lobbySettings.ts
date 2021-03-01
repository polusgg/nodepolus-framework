import { KillDistance, Language, Level, TaskBarMode } from "../../types/enums";
import { Connection } from "../../protocol/connection";
import { GameOptionsData, Mutable } from "../../types";
import { LobbyInstance } from "./lobbyInstance";
import { PlayerInstance } from "../player";
import { Player } from "../../player";

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

  setMaxPlayers(param: number): this {
    if (this.isPov) {
      throw new Error("Cannot modify the MaxPlayers setting on a per-player basis");
    }

    this.lobby.getOptions().setMaxPlayers(param);
    this.syncSettingsOnLobby();

    return this;
  }

  setLanguages(param: Language[]): this {
    if (this.isPov) {
      throw new Error("Cannot modify the Languages setting on a per-player basis");
    }

    this.lobby.getOptions().setLanguages(param);
    this.syncSettingsOnLobby();

    return this;
  }

  setLevel(param: Level): this {
    if (this.isPov) {
      throw new Error("Cannot modify the Level setting on a per-player basis");
    }

    this.lobby.getOptions().setLevels([param]);
    this.syncSettingsOnLobby();

    return this;
  }

  setSpeed(param: number): this {
    if (this.isPov) {
      this.povSpeed = param;
    } else {
      this.lobby.getOptions().setPlayerSpeedModifier(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setCrewmateVision(param: number): this {
    if (this.isPov) {
      this.povCrewVision = param;
    } else {
      this.lobby.getOptions().setCrewmateLightModifier(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setImpostorVision(param: number): this {
    if (this.isPov) {
      this.povImpostorVision = param;
    } else {
      this.lobby.getOptions().setImpostorLightModifier(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setKillCooldown(param: number): this {
    if (this.isPov) {
      this.povKillCooldown = param;
    } else {
      this.lobby.getOptions().setKillCooldown(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setCommonTaskCount(param: number): this {
    if (this.isPov) {
      throw new Error("Cannot modify the CommonTaskCount setting on a per-player basis");
    }

    this.lobby.getOptions().setCommonTaskCount(param);
    this.syncSettingsOnLobby();

    return this;
  }

  setLongTaskCount(param: number): this {
    if (this.isPov) {
      throw new Error("Cannot modify the LongTaskCount setting on a per-player basis");
    }

    this.lobby.getOptions().setLongTaskCount(param);
    this.syncSettingsOnLobby();

    return this;
  }

  setShortTaskCount(param: number): this {
    if (this.isPov) {
      throw new Error("Cannot modify the ShortTaskCount setting on a per-player basis");
    }

    this.lobby.getOptions().setShortTaskCount(param);
    this.syncSettingsOnLobby();

    return this;
  }

  setEmergencyMeetingCount(param: number): this {
    if (this.isPov) {
      this.povEmergencyMeetingCount = param;
    } else {
      this.lobby.getOptions().setEmergencyMeetingCount(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setImpostorCount(param: number): this {
    if (this.isPov) {
      throw new Error("Cannot modify the ImpostorCount setting on a per-player basis");
    }

    this.lobby.getOptions().setImpostorCount(param);
    this.syncSettingsOnLobby();

    return this;
  }

  setKillDistance(param: KillDistance): this {
    if (this.isPov) {
      this.povKillDistance = param;
    } else {
      this.lobby.getOptions().setKillDistance(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setDiscussionTime(param: number): this {
    if (this.isPov) {
      this.povDiscussionTime = param;
    } else {
      this.lobby.getOptions().setDiscussionTime(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setVotingTime(param: number): this {
    if (this.isPov) {
      this.povVotingTime = param;
    } else {
      this.lobby.getOptions().setVotingTime(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setIsDefault(param: boolean): this {
    if (this.isPov) {
      throw new Error("Cannot modify the IsDefault setting on a per-player basis");
    }

    this.lobby.getOptions().setIsDefault(param);
    this.syncSettingsOnLobby();

    return this;
  }

  setEmergencyCooldown(param: number): this {
    if (this.isPov) {
      this.povEmergencyCooldown = param;
    } else {
      this.lobby.getOptions().setEmergencyCooldown(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setConfirmEjects(param: boolean): this {
    if (this.isPov) {
      this.povConfirmEjects = param;
    } else {
      this.lobby.getOptions().setConfirmEjects(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setVisualTasks(param: boolean): this {
    if (this.isPov) {
      this.povVisualTasks = param;
    } else {
      this.lobby.getOptions().setVisualTasks(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setAnonymousVoting(param: boolean): this {
    if (this.isPov) {
      this.povAnonymousVoting = param;
    } else {
      this.lobby.getOptions().setAnonymousVoting(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  setTaskBarUpdates(param: TaskBarMode): this {
    if (this.isPov) {
      this.povTaskBarUpdates = param;
    } else {
      this.lobby.getOptions().setTaskBarUpdates(param);
    }

    this.syncSettingsOnLobby();

    return this;
  }

  fromPov(player: PlayerInstance): LobbySettings {
    if (this.isPov) {
      throw new Error("Cannot call fromPov on a LobbySettings instance that is already used as a POV instance");
    }

    const connection = player.getConnection();

    if (connection === undefined) {
      throw new Error(`Player ${player.getId()} does not have a connection on the lobby instance`);
    }

    if (LobbySettings.povCache.has(connection.getId())) {
      return LobbySettings.povCache.get(connection.getId())!;
    }

    const povSettings = new LobbySettings(this.lobby);

    povSettings.isPov = true;
    povSettings.connection = connection;

    LobbySettings.povCache.set(connection.getId(), povSettings);

    return povSettings;
  }

  protected syncSettingsOnLobby(): this {
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

      (this.lobby.getPlayers()[0] as Player).getEntity().getPlayerControl().syncSettings(customOptions, sendToConnections);
    } else {
      this.lobby.getLogger().warn("Attempted to sync lobby settings without a player");
    }

    return this;
  }
}
