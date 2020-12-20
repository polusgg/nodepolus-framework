import { HudOverrideSystem } from "../../../protocol/entities/baseShipStatus/systems";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus";
import { SystemType } from "../../../types/enums";
import { BaseDoorGameRoom } from ".";
import { Game } from "..";

export class NormalCommunicationsGameRoom extends BaseDoorGameRoom {
  constructor(game: Game) {
    super(game, SystemType.Communications);
  }

  isSabotaged(): boolean {
    return this.getInternalSystem().sabotaged;
  }

  getInternalSystem(): HudOverrideSystem {
    return this.getInternalShipStatus().systems[InternalSystemType.HudOverride] as HudOverrideSystem;
  }

  sabotage(): void {
    if (!this.isSabotaged()) {
      this.internalBackupShipStatus();

      this.getInternalSystem().sabotaged = true;

      this.internalUpdateShipStatus();
    }
  }

  repair(): void {
    if (this.isSabotaged()) {
      this.internalBackupShipStatus();

      this.getInternalSystem().sabotaged = false;

      this.internalUpdateShipStatus();
    }
  }
}
