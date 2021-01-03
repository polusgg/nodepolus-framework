import { PlayerPositionUpdatedEvent } from "./playerPositionUpdatedEvent";

/**
 * Fired when a player has teleported to another location, typically by using vents.
 */
export class PlayerPositionTeleportedEvent extends PlayerPositionUpdatedEvent {}
