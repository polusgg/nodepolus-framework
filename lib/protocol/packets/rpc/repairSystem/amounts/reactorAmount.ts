import { ReactorAction } from "../actions";
import { RepairAmount } from ".";

export class ReactorAmount implements RepairAmount {
  constructor(
    public consoleId: number,
    public action: ReactorAction,
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

  clone(): ReactorAmount {
    return new ReactorAmount(this.consoleId, this.action);
  }

  serialize(): number {
    return this.consoleId | this.action;
  }
}
