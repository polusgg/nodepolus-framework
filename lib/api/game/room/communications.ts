import { BaseDoorGameRoom } from "./base";
import { SystemType } from "../../../types/systemType";
import { Game } from "..";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { HudOverrideSystem } from "../../../protocol/entities/baseShipStatus/systems/hudOverrideSystem";
import { HqHudSystem } from "../../../protocol/entities/baseShipStatus/systems/hqHudSystem";

export class BasicCommunicationsRoom extends BaseDoorGameRoom {
  get isSabotaged(): boolean {
    return this.internalSystem.sabotaged;
  }

  get internalSystem(): HudOverrideSystem {
    return this.internalShipStatus.systems[InternalSystemType.HudOverride] as HudOverrideSystem;
  }

  constructor(game: Game) {
    super(game, SystemType.Communications);
  }

  sabotage(): void {
    if (!this.isSabotaged) {
      this.internalBackupShipStatus();

      this.internalSystem.sabotaged = true;

      this.internalUpdateShipStatus();
    }
  }

  repair(): void {
    if (this.isSabotaged) {
      this.internalBackupShipStatus();

      this.internalSystem.sabotaged = false;

      this.internalUpdateShipStatus();
    }
  }
}

export class MiraCommunicationsRoom extends BaseDoorGameRoom {
  get isSabotaged(): boolean {
    return this.internalSystem.completedConsoles.size != 2;
  }

  get internalSystem(): HqHudSystem {
    return this.internalShipStatus.systems[InternalSystemType.HqHud] as HqHudSystem;
  }

  constructor(game: Game) {
    super(game, SystemType.Communications);
  }

  sabotage(): void {
    if (!this.isSabotaged) {
      this.internalBackupShipStatus();

      this.internalSystem.completedConsoles.clear();

      this.internalUpdateShipStatus();
    }
  }

  repair(): void {
    if (this.isSabotaged) {
      this.internalBackupShipStatus();

      this.internalSystem.completedConsoles.add(0).add(1);

      this.internalUpdateShipStatus();
    }
  }
}
