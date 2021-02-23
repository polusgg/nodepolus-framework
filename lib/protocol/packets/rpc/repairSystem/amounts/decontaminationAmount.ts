import { RepairAmount } from ".";

export class DecontaminationAmount implements RepairAmount {
  constructor(
    protected entering: boolean,
    protected headingUp: boolean,
  ) {}

  static deserialize(amount: number): DecontaminationAmount {
    return new DecontaminationAmount(
      amount == 1 || amount == 2,
      amount == 1 || amount == 3,
    );
  }

  isEntering(): boolean {
    return this.entering;
  }

  setEntering(entering: boolean): this {
    this.entering = entering;

    return this;
  }

  isHeadingUp(): boolean {
    return this.headingUp;
  }

  setHeadingUp(headingUp: boolean): this {
    this.headingUp = headingUp;

    return this;
  }

  clone(): DecontaminationAmount {
    return new DecontaminationAmount(this.entering, this.headingUp);
  }

  serialize(): number {
    return this.entering
      ? (this.headingUp ? 1 : 2)
      : (this.headingUp ? 3 : 4);
  }
}
