import { RepairAmount } from ".";

export class NormalCommunicationsAmount implements RepairAmount {
  constructor(
    public isRepaired: boolean,
  ) {}

  static deserialize(amount: number): NormalCommunicationsAmount {
    return new NormalCommunicationsAmount(amount == 0);
  }

  clone(): NormalCommunicationsAmount {
    return new NormalCommunicationsAmount(this.isRepaired);
  }

  serialize(): number {
    return this.isRepaired ? 1 : 0;
  }
}
