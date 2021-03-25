import { RepairAmount } from ".";

export class PolusDoorsAmount extends RepairAmount {
  constructor(
    protected doorId: number,
  ) {
    super();
  }

  static deserialize(amount: number): PolusDoorsAmount {
    return new PolusDoorsAmount(amount & 0x1f);
  }

  getDoorId(): number {
    return this.doorId;
  }

  setDoorId(doorId: number): this {
    this.doorId = doorId;

    return this;
  }

  clone(): PolusDoorsAmount {
    return new PolusDoorsAmount(this.doorId);
  }

  getValue(): number {
    return this.doorId | 0x40;
  }
}
