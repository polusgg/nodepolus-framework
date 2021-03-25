import { SystemType } from "../../../../../types/enums";
import { RepairAmount } from ".";

export class SabotageAmount extends RepairAmount {
  constructor(
    protected systemType: SystemType,
  ) {
    super();
  }

  static deserialize(amount: number): SabotageAmount {
    return new SabotageAmount(amount);
  }

  getSystemType(): SystemType {
    return this.systemType;
  }

  setSystemType(systemType: SystemType): this {
    this.systemType = systemType;

    return this;
  }

  clone(): SabotageAmount {
    return new SabotageAmount(this.systemType);
  }

  getValue(): number {
    return this.systemType;
  }
}
