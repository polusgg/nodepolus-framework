import { SystemType } from "../../../../../types/enums";
import { RepairAmount } from ".";

export class SabotageAmount implements RepairAmount {
  constructor(
    public system: SystemType,
  ) {}

  static deserialize(amount: number): SabotageAmount {
    return new SabotageAmount(amount);
  }

  clone(): SabotageAmount {
    return new SabotageAmount(this.system);
  }

  serialize(): number {
    return this.system;
  }
}
