import { RepairAmount } from "./repairAmount";

export class SubmergedSpawnInAmount extends RepairAmount {
  constructor(
    protected upperSelected: boolean,
  ) {
    super();
  }

  static deserialize(amount: number): SubmergedSpawnInAmount {
    return new SubmergedSpawnInAmount(amount === 1);
  }

  isUpperSelected(): boolean {
    return this.upperSelected;
  }

  isLowerSelected(): boolean {
    return !this.upperSelected;
  }

  setUpperSelected(bool: boolean = true): void {
    this.upperSelected = bool;
  }

  clone(): SubmergedSpawnInAmount {
    return new SubmergedSpawnInAmount(this.upperSelected);
  }

  getValue(): number {
    return this.isUpperSelected() ? 1 : 0;
  }
}
