import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a meeting has begun, either by pressing the button or reporting a
 * dead body.
 */
export class MeetingStartedEvent extends CancellableEvent {
  /**
   * @param game The game from which this event was fired
   * @param caller The player that called the meeting
   * @param victim The player whose dead body was found
   */
  constructor(
    private readonly game: Game,
    private caller: PlayerInstance,
    private victim?: PlayerInstance,
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
   * @param caller The new player that called the meeting
   */
  setCaller(caller: PlayerInstance): void {
    this.caller = caller;
  }

  /**
   * Gets the player whose dead body was found.
   *
   * @returns The player whose dead body was found, or `undefined` if the meeting was called by pressing the button.
   */
  getVictim(): PlayerInstance | undefined {
    return this.victim;
  }

  /**
   * Sets the player whose dead body was found.
   *
   * @param victim The new player whose dead body was found, or `undefined` to start the meeting as if the button was pressed
   */
  setVictim(victim?: PlayerInstance): void {
    this.victim = victim;
  }
}
