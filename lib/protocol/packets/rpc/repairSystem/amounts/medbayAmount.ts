import { MedbayAction } from "../actions";
import { RepairAmount } from ".";

export class MedbayAmount implements RepairAmount {
  constructor(
    public playerId: number,
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

  serialize(): number {
    return this.playerId | this.action;
  }
}
