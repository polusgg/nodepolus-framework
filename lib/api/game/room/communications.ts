import { HudOverrideSystem } from "../../../protocol/entities/baseShipStatus/systems/hudOverrideSystem";
import { HqHudSystem } from "../../../protocol/entities/baseShipStatus/systems/hqHudSystem";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { SystemType } from "../../../types/systemType";
import { BaseDoorGameRoom } from "./base";
import { Game } from "..";

export class BasicCommunicationsRoom extends BaseDoorGameRoom {
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

export class MiraCommunicationsRoom extends BaseDoorGameRoom {
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
