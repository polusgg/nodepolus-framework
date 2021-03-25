import { RepairAmount } from ".";

export class ElectricalAmount extends RepairAmount {
  constructor(
    protected switchIndex: number,
  ) {
    super();
  }

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

  getValue(): number {
    return this.switchIndex;
  }
}
