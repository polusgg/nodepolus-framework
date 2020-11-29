import { EntityPlayer } from "../protocol/entities/player";

export class Player {
  id: number;
  constructor(public gameObject: EntityPlayer) {
    this.id = gameObject.playerControl.id
  }
}
