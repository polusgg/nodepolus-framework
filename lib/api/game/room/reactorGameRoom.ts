import { ReactorSystem } from "../../../protocol/entities/baseShipStatus/systems";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus";
import { SystemType } from "../../../types/enums";
import { BaseDoorGameRoom } from ".";
import { Game } from "..";

export class ReactorGameRoom extends BaseDoorGameRoom {
  constructor(game: Game) {
    super(game, SystemType.Reactor);
  }

  isSabotaged(): boolean {
    return this.getInternalSystem().timer < 10000;
  }

  getInternalSystem(): ReactorSystem {
    return this.getInternalShipStatus().systems[InternalSystemType.Reactor] as ReactorSystem;
  }

  sabotage(): void {
    if (!this.isSabotaged()) {
      this.internalBackupShipStatus();

      const sabotageHandler = this.game.lobby.getHostInstance().getSabotageHandler();

      if (!sabotageHandler) {
        throw new Error("Attempted to sabotage reactor without a SabotageHandler instance");
      }

      sabotageHandler.sabotageReactor(this.getInternalSystem());

      this.internalUpdateShipStatus();
    }
  }

  repair(): void {
    if (this.isSabotaged()) {
      const system = this.getInternalSystem();

      this.internalBackupShipStatus();

      system.timer = 10000;

      system.userConsoles.clear();

      this.internalUpdateShipStatus();
    }
  }
}
