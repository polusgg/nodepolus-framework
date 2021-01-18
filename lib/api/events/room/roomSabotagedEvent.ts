import { BaseGameRoom } from "../../game/room";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a room has been sabotaged.
 */
export class RoomSabotagedEvent extends CancellableEvent {
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
   * Gets the room that was sabotaged.
   */
  getRoom(): BaseGameRoom {
    return this.room;
  }
}
