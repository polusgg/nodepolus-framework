import { BaseGameRoom } from "../../game/room";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a room has been sabotaged.
 */
export class RoomSabotagedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param room - The room that was sabotaged
   * @param player - The player that sabotaged the room
   */
  constructor(
    private readonly game: Game,
    private readonly room: BaseGameRoom,
    private readonly player?: PlayerInstance,
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

  /**
   * Gets the player that sabotaged the room.
   *
   * @returns The player that sabotaged the room, or `undefined` if it was sabotaged via the API
   */
  getPlayer(): PlayerInstance | undefined {
    return this.player;
  }
}
