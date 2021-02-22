import { MedbayAction } from "../actions";
import { RepairAmount } from ".";

export class MedbayAmount implements RepairAmount {
  constructor(
    // TODO: Make protected with getter/setter
    public playerId: number,
    // TODO: Make protected with getter/setter
    public action: MedbayAction,
  ) {}

  static deserialize(amount: number): MedbayAmount {
    return new MedbayAmount(
      amount & 0x1f,
      (amount & MedbayAction.EnteredQueue) == MedbayAction.EnteredQueue
        ? MedbayAction.EnteredQueue
        : MedbayAction.LeftQueue,
    );
  }

  clone(): MedbayAmount {
    return new MedbayAmount(this.playerId, this.action);
  }

  serialize(): number {
    return this.playerId | this.action;
  }
}
