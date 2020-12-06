import { HudOverrideSystem } from "../../protocol/entities/baseShipStatus/systems/hudOverrideSystem";
import { LaboratorySystem } from "../../protocol/entities/baseShipStatus/systems/laboratorySystem";
import { LifeSuppSystem } from "../../protocol/entities/baseShipStatus/systems/lifeSuppSystem";
import { ReactorSystem } from "../../protocol/entities/baseShipStatus/systems/reactorSystem";
import { SwitchSystem } from "../../protocol/entities/baseShipStatus/systems/switchSystem";
import { HqHudSystem } from "../../protocol/entities/baseShipStatus/systems/hqHudSystem";
import { GameOverReason } from "../../types/gameOverReason";
import { Level } from "../../types/level";
import { CustomHost } from "..";
import { randomInRange } from "../../util/functions";

export class SabotageSystemHandler {
  public timer: NodeJS.Timeout | undefined;

  constructor(
    public host: CustomHost,
  ) {}

  sabotageReactor(system: ReactorSystem | LaboratorySystem): void {
    switch (this.host.room.options.options.levels[0]) {
      case Level.TheSkeld:
        system.timer = 30;
        break;
      case Level.MiraHq:
        system.timer = 45;
        break;
      case Level.Polus:
        system.timer = 60;
        break;
    }

    this.timer = setInterval(() => {
      system.timer--;

      if (system.timer == 0) {
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
    system.actualSwitches = [false, false, false, false, false];
    system.expectedSwitches = [false, false, false, false, false];

    const brokenSwitches = randomInRange(2, 4);
    const swapIdxs = [0, 1, 2, 3, 4];

    for (let i = 0; i < brokenSwitches; i++) {
      const idxToSwap = randomInRange(0, swapIdxs.length - 1);
      const val = swapIdxs[idxToSwap];

      swapIdxs.splice(idxToSwap, 1);

      system.actualSwitches[val] = !system.expectedSwitches[val];
    }

    // TODO: Actually count down like every other system (like -85 every second)
    setTimeout(() => {
      system.visionModifier = 0;
    }, 3000);
  }

  sabotageOxygen(system: LifeSuppSystem): void {
    system.completedConsoles.clear();

    switch (this.host.room.options.options.levels[0]) {
      case Level.TheSkeld:
        system.timer = 30;
        break;
      case Level.MiraHq:
        system.timer = 45;
        break;
      case Level.Polus:
        throw new Error("Sabotage Oxygen sent when on Polus. This should be impossible");
    }

    this.timer = setInterval(() => {
      system.timer--;

      if (system.timer == 0) {
        this.host.endGame(GameOverReason.ImpostorsBySabotage);

        if (this.timer) {
          clearInterval(this.timer);
        }
      }
    }, 1000);
  }
}
