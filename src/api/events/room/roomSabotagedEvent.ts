// import { BaseGameRoom } from "../../game/room";
import { BaseSystem } from "../../../protocol/entities/shipStatus/systems";
import { Game } from "../../game";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

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
    protected readonly game: Game,
    // protected readonly room: BaseGameRoom,
    protected readonly system: BaseSystem,
    protected readonly player?: PlayerInstance,
  ) {
    super();
  }

  /**
   * Gets the game from which this event was fired.
   *
   * @returns Game which the event was fired from
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the room that was sabotaged.
   */
  // getRoom(): BaseGameRoom {
  //   return this.room;
  // }

  /**
   * Gets the SabotagSystem that was sabotaged.
   *
   * @returns Sabotaged SabotageSystem
   */
  getSystem(): BaseSystem {
    return this.system;
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
