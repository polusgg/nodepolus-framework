import { GameOverReason, Level } from "../../types/enums";
import { CustomHost } from "..";
import {
  HqHudSystem,
  HudOverrideSystem,
  LaboratorySystem,
  LifeSuppSystem,
  ReactorSystem,
  SwitchSystem,
} from "../../protocol/entities/baseShipStatus/systems";

export class SabotageSystemHandler {
  public timer: NodeJS.Timeout | undefined;

  constructor(
    public host: CustomHost,
  ) {}

  sabotageReactor(system: ReactorSystem | LaboratorySystem): void {
    switch (this.host.lobby.options.options.levels[0]) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        system.timer = 30;
        break;
      case Level.MiraHq:
        system.timer = 45;
        break;
      case Level.Polus:
        system.timer = 60;
        break;
      case Level.Airship:
        system.timer = 100;
        break;
    }

    this.timer = setInterval(() => {
      system.timer--;

      if (system.timer <= 0) {
        this.host.endGame(GameOverReason.ImpostorsBySabotage);

        if (this.timer) {
          clearInterval(this.timer);
        }
      }
    }, 1000);
  }

  sabotageCommunications(system: HudOverrideSystem | HqHudSystem): void {
    if (system instanceof HudOverrideSystem) {
      system.sabotaged = true;
    } else {
      system.activeConsoles.clear();
      system.completedConsoles.clear();
    }
  }

  sabotageElectrical(system: SwitchSystem): void {
    system.expectedSwitches = Array(5).fill(false).map(() => Math.random() < 0.5);
    system.actualSwitches = [...system.expectedSwitches];

    for (let i = 0; i < system.expectedSwitches.length; i++) {
      const pos = Math.floor(Math.random() * (system.expectedSwitches.length - i)) * i;

      system.actualSwitches[pos] = !system.expectedSwitches[pos];
    }

    // TODO: Actually count down like every other system (like -85 every second)
    setTimeout(() => {
      system.visionModifier = 0;
    }, 3000);
  }

  sabotageOxygen(system: LifeSuppSystem): void {
    system.completedConsoles.clear();

    const level = this.host.lobby.options.options.levels[0];

    switch (level) {
      case Level.TheSkeld:
        system.timer = 30;
        break;
      case Level.MiraHq:
        system.timer = 45;
        break;
      default:
        throw new Error(`Attempted to sabotage oxygen on an unsupported map: ${level} (${Level[level]})`);
    }

    this.timer = setInterval(() => {
      system.timer--;

      if (system.timer <= 0) {
        this.host.endGame(GameOverReason.ImpostorsBySabotage);

        if (this.timer) {
          clearInterval(this.timer);
        }
      }
    }, 1000);
  }
}
