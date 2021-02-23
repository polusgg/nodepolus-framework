import { MedbayAction } from "../actions";
import { RepairAmount } from ".";

export class MedbayAmount implements RepairAmount {
  constructor(
    protected playerId: number,
    protected action: MedbayAction,
  ) {}

  static deserialize(amount: number): MedbayAmount {
    return new MedbayAmount(
      amount & 0x1f,
      (amount & MedbayAction.EnteredQueue) == MedbayAction.EnteredQueue
        ? MedbayAction.EnteredQueue
        : MedbayAction.LeftQueue,
    );
  }

  getPlayerId(): number {
    return this.playerId;
  }

  setPlayerId(playerId: number): this {
    this.playerId = playerId;

    return this;
  }

  getAction(): MedbayAction {
    return this.action;
  }

  setAction(action: MedbayAction): this {
    this.action = action;

    return this;
  }

  clone(): MedbayAmount {
    return new MedbayAmount(this.playerId, this.action);
  }

  serialize(): number {
    return this.playerId | this.action;
  }
}
