import { MiraCommunicationsAction } from "../actions";
import { RepairAmount } from ".";

export class MiraCommunicationsAmount implements RepairAmount {
  constructor(
    protected consoleId: number,
    protected action: MiraCommunicationsAction,
  ) {}

  static deserialize(amount: number): MiraCommunicationsAmount {
    let action = MiraCommunicationsAction.OpenedConsole;

    if ((amount & MiraCommunicationsAction.ClosedConsole) == MiraCommunicationsAction.ClosedConsole) {
      action = MiraCommunicationsAction.ClosedConsole;
    } else if ((amount & MiraCommunicationsAction.EnteredCode) == MiraCommunicationsAction.EnteredCode) {
      action = MiraCommunicationsAction.EnteredCode;
    }

    return new MiraCommunicationsAmount(amount & 0xf, action);
  }

  getConsoleId(): number {
    return this.consoleId;
  }

  setConsoleId(consoleId: number): this {
    this.consoleId = consoleId;

    return this;
  }

  getAction(): MiraCommunicationsAction {
    return this.action;
  }

  setAction(action: MiraCommunicationsAction): this {
    this.action = action;

    return this;
  }

  clone(): MiraCommunicationsAmount {
    return new MiraCommunicationsAmount(this.consoleId, this.action);
  }

  serialize(): number {
    return this.consoleId | this.action;
  }
}
