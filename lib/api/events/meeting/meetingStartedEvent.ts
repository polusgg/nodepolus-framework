import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a meeting has begun.
 */
export class MeetingStartedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private caller: PlayerInstance,
    private victim?: PlayerInstance,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getCaller(): PlayerInstance {
    return this.caller;
  }

  setCaller(caller: PlayerInstance): void {
    this.caller = caller;
  }

  getVictim(): PlayerInstance | undefined {
    return this.victim;
  }

  setVictim(victim?: PlayerInstance): void {
    this.victim = victim;
  }
}
