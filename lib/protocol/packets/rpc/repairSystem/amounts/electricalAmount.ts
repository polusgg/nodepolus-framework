import { RepairAmount } from ".";

export class ElectricalAmount implements RepairAmount {
  constructor(
    protected switchIndex: number,
  ) {}

  static deserialize(amount: number): ElectricalAmount {
    return new ElectricalAmount(amount);
  }

  getSwitchIndex(): number {
    return this.switchIndex;
  }

  setSwitchIndex(switchIndex: number): this {
    this.switchIndex = switchIndex;

    return this;
  }

  clone(): ElectricalAmount {
    return new ElectricalAmount(this.switchIndex);
  }

  serialize(): number {
    return this.switchIndex;
  }
}
