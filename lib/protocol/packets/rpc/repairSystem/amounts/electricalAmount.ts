import { RepairAmount } from ".";

export class ElectricalAmount implements RepairAmount {
  constructor(
    public readonly switchIndex: number,
  ) {}

  static deserialize(amount: number): ElectricalAmount {
    return new ElectricalAmount(amount);
  }

  serialize(): number {
    return this.switchIndex;
  }
}
