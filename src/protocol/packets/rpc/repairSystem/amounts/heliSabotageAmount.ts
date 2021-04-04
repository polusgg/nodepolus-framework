import { HeliSabotageAction } from "../actions";
import { RepairAmount } from ".";

export class HeliSabotageAmount extends RepairAmount {
  constructor(
    protected consoleId: number,
    protected action: HeliSabotageAction,
  ) {
    super();
  }

  static deserialize(amount: number): HeliSabotageAmount {
    let action = HeliSabotageAction.OpenedConsole;

    if ((amount & HeliSabotageAction.ClosedConsole) == HeliSabotageAction.ClosedConsole) {
      action = HeliSabotageAction.ClosedConsole;
    } else if ((amount & HeliSabotageAction.EnteredCode) == HeliSabotageAction.EnteredCode) {
      action = HeliSabotageAction.EnteredCode;
    }

    return new HeliSabotageAmount(amount & 0xf, action);
  }

  getConsoleId(): number {
    return this.consoleId;
  }

  setConsoleId(consoleId: number): this {
    this.consoleId = consoleId;

    return this;
  }

  getAction(): HeliSabotageAction {
    return this.action;
  }

  setAction(action: HeliSabotageAction): this {
    this.action = action;

    return this;
  }

  clone(): HeliSabotageAmount {
    return new HeliSabotageAmount(this.consoleId, this.action);
  }

  getValue(): number {
    return this.consoleId | this.action;
  }
}
