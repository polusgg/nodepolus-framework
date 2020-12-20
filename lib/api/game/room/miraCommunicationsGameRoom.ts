import { HqHudSystem } from "../../../protocol/entities/baseShipStatus/systems";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus";
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

      this.getInternalSystem().completedConsoles.clear();

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
