import { Bitfield } from "../../../../../types";
import { RepairAmount } from "./repairAmount";

export class HeliSabotageAmount extends RepairAmount {
  constructor(
    protected console: number,
    protected tags: Bitfield,
  ) {
    super();
  }

  static deserialize(amount: number): HeliSabotageAmount {
    return new HeliSabotageAmount(amount & 15, Bitfield.fromNumber(amount >> 4, 4));
  }

  getConsole(): number {
    return this.console;
  }

  setConsole(console: number): this {
    this.console = console;

    return this;
  }

  getTags(): Bitfield {
    return this.tags;
  }

  setTags(bitfield: Bitfield): this {
    this.tags = bitfield;

    return this;
  }

  clone(): HeliSabotageAmount {
    return new HeliSabotageAmount(this.console, this.tags.clone());
  }

  getValue(): number {
    return this.console | (this.tags.toNumber() << 4);
  }
}
