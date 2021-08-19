import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";
import { EntityMeetingHud } from "../../../protocol/entities/meetingHud";

/**
 * Fired when a meeting has begun, either by pressing the button or reporting a
 * dead body.
 */
export class MeetingStartedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param caller - The player that called the meeting
   * @param victim - The player whose dead body was found
   * @param activeSabotage - Whether a sabotage is active
   * @param meetingHud - The meeting hud to be used
   * @param repairSabotage - Whether to repair the sabotage
   */
  constructor(
    protected readonly game: Game,
    protected caller: PlayerInstance,
    protected victim: PlayerInstance | undefined,
    protected activeSabotage: boolean,
    protected meetingHud: EntityMeetingHud,
    protected repairSabotage: boolean = true,
  ) {
    super();
  }

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the player that called the meeting.
   */
  getCaller(): PlayerInstance {
    return this.caller;
  }

  /**
   * Sets the player that called the meeting.
   *
   * @param caller - The new player that called the meeting
   */
  setCaller(caller: PlayerInstance): this {
    this.caller = caller;

    return this;
  }

  /**
   * Gets the player whose dead body was found.
   *
   * @returns The player whose dead body was found, or `undefined` if the meeting was called by pressing the button.
   */
  getVictim(): PlayerInstance | undefined {
    return this.victim;
  }

  getMeetingHud(): EntityMeetingHud {
    return this.meetingHud;
  }

  /**
   * Sets the player whose dead body was found.
   *
   * @param victim - The new player whose dead body was found, or `undefined` to start the meeting as if the button was pressed
   */
  setVictim(victim?: PlayerInstance): this {
    this.victim = victim;

    return this;
  }

  /**
   * Gets whether or not a critical system is currently sabotaged.
   *
   * @returns `true` if a critical system is sabotaged, `false` if not
   */
  hasActiveSabotage(): boolean {
    return this.activeSabotage;
  }

  /**
   * Gets whether or not the sabotaged critical system should be repaired when
   * the meeting is started.
   *
   * @returns `true` to repair the critical system, `false` to leave it be
   */
  shouldRepairSabotage(): boolean {
    return this.repairSabotage;
  }

  /**
   * Sets whether or not the sabotaged critical system should be repaired when
   * the meeting is started.
   *
   * @param repairSabotage - `true` to repair the critical system, `false` to leave it be
   */
  setRepairSabotage(repairSabotage: boolean): this {
    this.repairSabotage = repairSabotage;

    return this;
  }
}
