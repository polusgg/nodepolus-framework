import { Level } from "../../../../types/enums";

export class LobbyCount {
  constructor(
    public skeld: number = 0,
    public mira: number = 0,
    public polus: number = 0,
    public airship: number = 0,
  ) {}

  increment(level: Level): void {
    this.add(level, 1);
  }

  decrement(level: Level): void {
    this.add(level, -1);
  }

  add(level: Level, amount: number): void {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        this.skeld += amount;
        break;
      case Level.MiraHq:
        this.mira += amount;
        break;
      case Level.Polus:
        this.polus += amount;
        break;
      case Level.Airship:
        this.airship += amount;
        break;
    }
  }

  set(level: Level, amount: number): void {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        this.skeld = amount;
        break;
      case Level.MiraHq:
        this.mira = amount;
        break;
      case Level.Polus:
        this.polus = amount;
        break;
      case Level.Airship:
        this.airship = amount;
        break;
    }
  }
}
