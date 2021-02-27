import { OxygenAction } from "../actions";
import { RepairAmount } from ".";

export class OxygenAmount extends RepairAmount {
  constructor(
    protected consoleId: number,
    protected action: OxygenAction,
  ) {
    super();
  }

  static deserialize(amount: number): OxygenAmount {
    let action = OxygenAction.Completed;

    if ((amount & OxygenAction.Completed) == OxygenAction.Completed) {
      action = OxygenAction.Completed;
    } else if ((amount & OxygenAction.Repaired) == OxygenAction.Repaired) {
      action = OxygenAction.Repaired;
    }

    return new OxygenAmount(amount & 3, action);
  }

  getConsoleId(): number {
    return this.consoleId;
  }

  setConsoleId(consoleId: number): this {
    this.consoleId = consoleId;

    return this;
  }

  getAction(): OxygenAction {
    return this.action;
  }

  setAction(action: OxygenAction): this {
    this.action = action;

    return this;
  }

  clone(): OxygenAmount {
    return new OxygenAmount(this.consoleId, this.action);
  }

  getValue(): number {
    return this.consoleId | this.action;
  }
}
