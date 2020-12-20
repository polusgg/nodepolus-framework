import { EntityPlayer } from "../protocol/entities/player";

export class Player {
  public readonly id: number;

  constructor(
    public gameObject: EntityPlayer,
  ) {
    this.id = gameObject.playerControl.playerId;
  }
}
