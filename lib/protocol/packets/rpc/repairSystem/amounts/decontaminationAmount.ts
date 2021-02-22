import { RepairAmount } from ".";

export class DecontaminationAmount implements RepairAmount {
  constructor(
    // TODO: Make protected with getter/setter
    public isEntering: boolean,
    // TODO: Make protected with getter/setter
    public isHeadingUp: boolean,
  ) {}

  static deserialize(amount: number): DecontaminationAmount {
    return new DecontaminationAmount(
      amount == 1 || amount == 2,
      amount == 1 || amount == 3,
    );
  }

  clone(): DecontaminationAmount {
    return new DecontaminationAmount(this.isEntering, this.isHeadingUp);
  }

  serialize(): number {
    return this.isEntering
      ? (this.isHeadingUp ? 1 : 2)
      : (this.isHeadingUp ? 3 : 4);
  }
}
