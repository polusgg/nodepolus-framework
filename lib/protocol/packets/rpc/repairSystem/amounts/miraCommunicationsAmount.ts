import { MiraCommunicationsAction } from "../actions";
import { RepairAmount } from ".";

export class MiraCommunicationsAmount implements RepairAmount {
  constructor(
    public consoleId: number,
    public action: MiraCommunicationsAction,
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

  serialize(): number {
    return this.consoleId | this.action;
  }
}
