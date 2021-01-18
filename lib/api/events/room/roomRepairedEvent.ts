import { BaseGameRoom } from "../../game/room";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a sabotaged room has been repaired.
 */
export class RoomRepairedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private readonly room: BaseGameRoom,
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
   * Gets the room that was repaired
   */
  getRoom(): BaseGameRoom {
    return this.room;
  }
}
