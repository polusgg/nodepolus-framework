import { SwitchSystem } from "../../../protocol/entities/baseShipStatus/systems";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus";
import { SystemType } from "../../../types/enums";
import { Bitfield } from "../../../types";
import { BaseDoorGameRoom } from ".";
import { Game } from "..";

// TODO: Extract to separate file
export class Switch {
  constructor(
    public room: ElectricalGameRoom,
    public readonly index: number,
  ) {}

  getState(): boolean {
    return this.room.getInternalSystem().actualSwitches.bits[this.index];
  }

  getPreferredState(): boolean {
    return this.room.getInternalSystem().expectedSwitches.bits[this.index];
  }

  flip(): void {
    this.room.internalBackupShipStatus();

    this.room.getInternalSystem().setSwitchState(this.index, !this.getState());

    this.room.internalUpdateShipStatus();
  }

  setOn(): void {
    if (!this.getState()) {
      this.flip();
    }
  }

  setOff(): void {
    if (this.getState()) {
      this.flip();
    }
  }

  repair(): void {
    if (this.getState() != this.getPreferredState()) {
      this.flip();
    }
  }

  flipPreferred(): void {
    this.room.internalBackupShipStatus();

    this.room.getInternalSystem().expectedSwitches.bits[this.index] = !this.getPreferredState();

    this.room.internalUpdateShipStatus();
  }

  setPreferredOn(): void {
    if (!this.getPreferredState()) {
      this.flipPreferred();
    }
  }

  setPreferredOff(): void {
    if (this.getPreferredState()) {
      this.flipPreferred();
    }
  }
}

export class ElectricalGameRoom extends BaseDoorGameRoom {
  private readonly internalSwitches = new Array(5).fill(0).map((_el, index) => new Switch(this, index));

  constructor(game: Game) {
    super(game, SystemType.Electrical);
  }

  getSwitches(): Switch[] {
    return this.internalSwitches;
  }

  isSabotaged(): boolean {
    for (let i = 0; i < this.getSwitches().length; i++) {
      if (this.getSwitches()[i].getState() != this.getSwitches()[i].getPreferredState()) {
        return true;
      }
    }

    return false;
  }

  getInternalSystem(): SwitchSystem {
    return this.getInternalShipStatus().systems[InternalSystemType.Switch] as SwitchSystem;
  }

  // TODO: Understand Airship's Electrical Doors, and add a serializer/deserializer

  sabotage(): void {
    if (!this.isSabotaged()) {
      this.internalBackupShipStatus();

      const sabotageHandler = this.game.lobby.getHostInstance().getSabotageHandler();

      if (!sabotageHandler) {
        throw new Error("Attempted to sabotage electrical without a SabotageHandler instance");
      }

      sabotageHandler.sabotageElectrical(this.getInternalSystem());

      this.internalUpdateShipStatus();
    }
  }

  repair(): void {
    if (this.isSabotaged()) {
      const system = this.getInternalSystem();

      this.internalBackupShipStatus();

      system.expectedSwitches = new Bitfield([false, false, false, false, false]);
      system.actualSwitches = new Bitfield([false, false, false, false, false]);

      this.internalUpdateShipStatus();
    }
  }
}
