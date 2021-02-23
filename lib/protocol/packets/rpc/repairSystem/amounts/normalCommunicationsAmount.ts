import { RepairAmount } from ".";

export class NormalCommunicationsAmount implements RepairAmount {
  constructor(
    protected repaired: boolean,
  ) {}

  static deserialize(amount: number): NormalCommunicationsAmount {
    return new NormalCommunicationsAmount(amount == 0);
  }

  isRepaired(): boolean {
    return this.repaired;
  }

  setRepaired(repaired: boolean): this {
    this.repaired = repaired;

    return this;
  }

  clone(): NormalCommunicationsAmount {
    return new NormalCommunicationsAmount(this.repaired);
  }

  serialize(): number {
    return this.repaired ? 1 : 0;
  }
}
