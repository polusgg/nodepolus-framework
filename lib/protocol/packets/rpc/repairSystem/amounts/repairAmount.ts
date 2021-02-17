export interface RepairAmount {
  clone(): RepairAmount;

  serialize(): number;
}
