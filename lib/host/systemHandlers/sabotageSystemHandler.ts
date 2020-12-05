import { HudOverrideSystem } from "../../protocol/entities/baseShipStatus/systems/hudOverrideSystem";
import { LaboratorySystem } from "../../protocol/entities/baseShipStatus/systems/laboratorySystem";
import { LifeSuppSystem } from "../../protocol/entities/baseShipStatus/systems/lifeSuppSystem";
import { ReactorSystem } from "../../protocol/entities/baseShipStatus/systems/reactorSystem";
import { SwitchSystem } from "../../protocol/entities/baseShipStatus/systems/switchSystem";
import { HqHudSystem } from "../../protocol/entities/baseShipStatus/systems/hqHudSystem";
import { GameOverReason } from "../../types/gameOverReason";
import { Level } from "../../types/level";
import { CustomHost } from "..";

export class SabotageSystemHandler {
  private timer: NodeJS.Timeout | undefined;

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
    //  TODO: make actual and expected random
    //        the implementation of this should
    //        make certain it isn't setting
    //        actualSwitches to expectedSwitches

    system.actualSwitches = [false, false, false, false, false];
    system.expectedSwitches = [true, true, true, true, true];
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
