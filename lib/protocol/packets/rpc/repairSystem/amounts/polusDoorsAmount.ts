import { RepairAmount } from ".";

export class PolusDoorsAmount implements RepairAmount {
  constructor(
    protected doorId: number,
  ) {}

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

  serialize(): number {
    return this.doorId | 0x40;
  }
}
