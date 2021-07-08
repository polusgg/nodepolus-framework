import { Level } from "../../types/enums";
import { LobbyInstance } from "../lobby";

export class Game {
  constructor(
    protected readonly lobby: LobbyInstance,
  ) {
    switch (lobby.getLevel()) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        break;
      case Level.MiraHq:
        break;
      case Level.Polus:
        break;
      case Level.Airship:
        break;
      case Level.Submerged:
        break;
    }
  }

  getLobby(): LobbyInstance {
    return this.lobby;
  }
}
