import { ReactorAction } from "../actions";
import { RepairAmount } from ".";

export class ReactorAmount implements RepairAmount {
  constructor(
    protected consoleId: number,
    protected action: ReactorAction,
  ) {}

  static deserialize(amount: number): ReactorAmount {
    let action = ReactorAction.PlacedHand;

    if ((amount & ReactorAction.RemovedHand) == ReactorAction.RemovedHand) {
      action = ReactorAction.RemovedHand;
    } else if ((amount & ReactorAction.Repaired) == ReactorAction.Repaired) {
      action = ReactorAction.Repaired;
    }

    return new ReactorAmount(amount & 3, action);
  }

  getConsoleId(): number {
    return this.consoleId;
  }

  setConsoleId(consoleId: number): this {
    this.consoleId = consoleId;

    return this;
  }

  getAction(): ReactorAction {
    return this.action;
  }

  setAction(action: ReactorAction): this {
    this.action = action;

    return this;
  }

  clone(): ReactorAmount {
    return new ReactorAmount(this.consoleId, this.action);
  }

  serialize(): number {
    return this.consoleId | this.action;
  }
}
