import { OxygenAction } from "../actions";
import { RepairAmount } from ".";

export class OxygenAmount implements RepairAmount {
  constructor(
    // TODO: Make protected with getter/setter
    public consoleId: number,
    // TODO: Make protected with getter/setter
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

  clone(): OxygenAmount {
    return new OxygenAmount(this.consoleId, this.action);
  }

  serialize(): number {
    return this.consoleId | this.action;
  }
}
