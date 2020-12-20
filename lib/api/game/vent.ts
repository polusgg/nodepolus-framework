import { Player } from "../player";
import { Lobby } from "../lobby";

export class Vent {
  public players: Player[] = [];

  constructor(
    public lobby: Lobby,
    public id: number,
  ) {}
}
