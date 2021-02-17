import { RepairAmount } from ".";

export class DecontaminationAmount implements RepairAmount {
  constructor(
    public isEntering: boolean,
    public isHeadingUp: boolean,
  ) {}

  static deserialize(amount: number): DecontaminationAmount {
    return new DecontaminationAmount(
      amount == 1 || amount == 2,
      amount == 1 || amount == 3,
    );
  }

  serialize(): number {
    return this.isEntering
      ? (this.isHeadingUp ? 1 : 2)
      : (this.isHeadingUp ? 3 : 4);
  }
}
