import { RepairAmount } from ".";

export class DecontaminationAmount extends RepairAmount {
  constructor(
    protected entering: boolean,
    protected headingUp: boolean,
  ) {
    super();
  }

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

  getValue(): number {
    return this.entering
      ? (this.headingUp ? 1 : 2)
      : (this.headingUp ? 3 : 4);
  }
}
