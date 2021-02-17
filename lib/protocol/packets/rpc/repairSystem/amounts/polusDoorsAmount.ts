import { RepairAmount } from ".";

export class PolusDoorsAmount implements RepairAmount {
  constructor(
    public doorId: number,
  ) {}

  static deserialize(amount: number): PolusDoorsAmount {
    return new PolusDoorsAmount(amount & 0x1f);
  }

  clone(): PolusDoorsAmount {
    return new PolusDoorsAmount(this.doorId);
  }

  serialize(): number {
    return this.doorId | 0x40;
  }
}
