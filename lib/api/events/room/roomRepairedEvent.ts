import { BaseGameRoom } from "../../game/room";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a sabotaged room has been repaired.
 */
export class RoomRepairedEvent extends CancellableEvent {
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
   * Gets the room that was repaired
   */
  getRoom(): BaseGameRoom {
    return this.room;
  }

  /**
   * Gets the player that repaired the room.
   *
   * @returns The player that repaired the room, or `undefined` if it was repaired via the API
   */
  getPlayer(): PlayerInstance | undefined {
    return this.player;
  }
}
