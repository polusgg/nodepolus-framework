import { Player } from "../player";
import { Room } from "../room";

export default class Vent {
  public players: Player[] = [];

  constructor(
    public room: Room,
    public id: number,
  ) {}
}
