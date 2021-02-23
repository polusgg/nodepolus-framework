import { SystemType } from "../../../../../types/enums";
import { RepairAmount } from ".";

export class SabotageAmount implements RepairAmount {
  constructor(
    protected systemType: SystemType,
  ) {}

  static deserialize(amount: number): SabotageAmount {
    return new SabotageAmount(amount);
  }

  getSystemType(): SystemType {
    return this.systemType;
  }

  setSystemType(system: SystemType): this {
    this.systemType = system;

    return this;
  }

  clone(): SabotageAmount {
    return new SabotageAmount(this.systemType);
  }

  serialize(): number {
    return this.systemType;
  }
}
