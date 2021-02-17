import { RepairAmount } from ".";

export class NormalCommunicationsAmount implements RepairAmount {
  constructor(
    public isRepaired: boolean,
  ) {}

  static deserialize(amount: number): NormalCommunicationsAmount {
    return new NormalCommunicationsAmount(amount == 0);
  }

  serialize(): number {
    return this.isRepaired ? 1 : 0;
  }
}
