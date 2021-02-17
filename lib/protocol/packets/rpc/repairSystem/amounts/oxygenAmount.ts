import { OxygenAction } from "../actions";
import { RepairAmount } from ".";

export class OxygenAmount implements RepairAmount {
  constructor(
    public consoleId: number,
    public action: OxygenAction,
  ) {}

  static deserialize(amount: number): OxygenAmount {
    let action = OxygenAction.Completed;

    if ((amount & OxygenAction.Completed) == OxygenAction.Completed) {
      action = OxygenAction.Completed;
    } else if ((amount & OxygenAction.Repaired) == OxygenAction.Repaired) {
      action = OxygenAction.Repaired;
    }

    return new OxygenAmount(amount & 3, action);
  }

  serialize(): number {
    return this.consoleId | this.action;
  }
}
