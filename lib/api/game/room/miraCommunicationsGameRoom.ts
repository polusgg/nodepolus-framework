import { HqHudSystem } from "../../../protocol/entities/shipStatus/baseShipStatus/systems";
import { InternalSystemType } from "../../../protocol/entities/shipStatus/baseShipStatus";
import { SystemType } from "../../../types/enums";
import { BaseDoorGameRoom } from ".";
import { Game } from "..";

export class MiraCommunicationsGameRoom extends BaseDoorGameRoom {
  constructor(game: Game) {
    super(game, SystemType.Communications);
  }

  isSabotaged(): boolean {
    return this.getInternalSystem().completedConsoles.size != 2;
  }

  getInternalSystem(): HqHudSystem {
    return this.getInternalShipStatus().systems[InternalSystemType.HqHud] as HqHudSystem;
  }

  sabotage(): void {
    if (!this.isSabotaged()) {
      this.internalBackupShipStatus();

      const sabotageHandler = this.game.lobby.getHostInstance().getSabotageHandler();

      if (!sabotageHandler) {
        throw new Error("Attempted to sabotage communications without a SabotageHandler instance");
      }

      sabotageHandler.sabotageCommunications(this.getInternalSystem());
      this.internalUpdateShipStatus();
    }
  }

  repair(): void {
    if (this.isSabotaged()) {
      this.internalBackupShipStatus();
      this.getInternalSystem().completedConsoles.add(0).add(1);
      this.internalUpdateShipStatus();
    }
  }
}
