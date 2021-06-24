import { RepairAmount } from "./repairAmount";

export class SubmergedElevatorAmount extends RepairAmount {
  static deserialize(): SubmergedElevatorAmount {
    return new SubmergedElevatorAmount();
  }

  clone(): SubmergedElevatorAmount {
    return new SubmergedElevatorAmount();
  }

  getValue(): number {
    // this is hardcoded as 2 since probablyadnf is a fucking idiot.
    return 2;
  }
}
