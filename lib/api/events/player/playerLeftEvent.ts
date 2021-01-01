import { PlayerInstance } from "../../player";

/**
 * Fired when a player has left a lobby.
 */
export class PlayerLeftEvent {
  constructor(
    public player: PlayerInstance,
  ) {}
}
