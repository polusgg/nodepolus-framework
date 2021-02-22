import { RepairAmount } from ".";

export class ElectricalAmount implements RepairAmount {
  constructor(
    // TODO: Make protected with getter/setter
    public switchIndex: number,
  ) {}

  static deserialize(amount: number): ElectricalAmount {
    return new ElectricalAmount(amount);
  }

  clone(): ElectricalAmount {
    return new ElectricalAmount(this.switchIndex);
  }

  serialize(): number {
    return this.switchIndex;
  }
}
