import { Game } from "../../game";

export class SubmergedSpawnInEvent {
  constructor(
    protected readonly game: Game,
  ) {}

  getGame(): Game {
    return this.game;
  }
}
