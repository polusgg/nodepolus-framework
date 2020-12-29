import { EntityPlayer } from "../protocol/entities/player";

export class InternalPlayer {
  public readonly id: number;

  constructor(
    public gameObject: EntityPlayer,
  ) {
    this.id = gameObject.playerControl.playerId;
  }

  getId(): number {
    return this.id;
  }
}
