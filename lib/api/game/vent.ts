import { PlayerInstance } from "../player";
import { LobbyInstance } from "../lobby";

export class Vent {
  public players: PlayerInstance[] = [];

  constructor(
    public lobby: LobbyInstance,
    public id: number,
  ) {}
}
