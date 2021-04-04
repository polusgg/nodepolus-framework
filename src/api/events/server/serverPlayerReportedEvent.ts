import { ReportOutcome, ReportReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { LobbyInstance } from "../../lobby";
import { CancellableEvent } from "../types";

/**
 * Fired when a player reports another player in a lobby.
 */
export class ServerPlayerReportedEvent extends CancellableEvent {
  protected reportOutcome: ReportOutcome = ReportOutcome.NotReportedUnknown;

  /**
   * @param lobby - The lobby in which the player was reported
   * @param player - The player that was reported
   * @param reportingPlayer - The player that sent the report
   * @param reportReason - The reason for why the player was reported
   */
  constructor(
    protected readonly lobby: LobbyInstance,
    protected readonly player: PlayerInstance,
    protected readonly reportingPlayer: PlayerInstance,
    protected readonly reportReason: ReportReason,
  ) {
    super();
  }

  /**
   * Gets the lobby in which the player was reported.
   */
  getLobby(): LobbyInstance {
    return this.lobby;
  }

  /**
   * Gets the player that was reported.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player that sent the report.
   */
  getReportingPlayer(): PlayerInstance {
    return this.reportingPlayer;
  }

  /**
   * Gets the reason for why the player was reported.
   */
  getReportReason(): ReportReason {
    return this.reportReason;
  }

  /**
   * Gets the outcome of this player report.
   */
  getReportOutcome(): ReportOutcome {
    return this.reportOutcome;
  }

  /**
   * Sets the outcome of this player report.
   *
   * @param reportOutcome - The new outcome of this player report
   */
  setReportOutcome(reportOutcome?: ReportOutcome): this {
    this.reportOutcome = reportOutcome ?? ReportOutcome.NotReportedUnknown;

    return this;
  }
}
