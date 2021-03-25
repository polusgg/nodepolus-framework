import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class LifeSuppSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected timer: number = 10000,
    protected completedConsoles: Set<number> = new Set([0, 1]),
  ) {
    super(shipStatus, SystemType.Oxygen);
  }

  getTimer(): number {
    return this.timer;
  }

  setTimer(seconds: number): this {
    this.timer = seconds;

    return this;
  }

  decrementTimer(seconds: number = 1): this {
    this.timer -= Math.abs(seconds);

    if (this.timer < 0) {
      this.timer = 0;
    }

    return this;
  }

  getCompletedConsoles(): Set<number> {
    return this.completedConsoles;
  }

  setCompletedConsoles(completedConsoles: Set<number>): this {
    this.completedConsoles = completedConsoles;

    return this;
  }

  clearCompletedConsoles(): this {
    this.completedConsoles.clear();

    return this;
  }

  addCompletedConsole(consoleId: number): this {
    this.completedConsoles.add(consoleId);

    return this;
  }

  removeCompletedConsole(consoleId: number): this {
    this.completedConsoles.delete(consoleId);

    return this;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter()
      .writeFloat32(this.timer)
      .writeList(this.completedConsoles, (writer, con) => writer.writePackedUInt32(con));
  }

  equals(old: LifeSuppSystem): boolean {
    if (this.timer != old.timer) {
      return false;
    }

    if (this.completedConsoles.size != old.completedConsoles.size) {
      return false;
    }

    const completedConsoles = [...this.completedConsoles];

    for (let i = 0; i < completedConsoles.length; i++) {
      if (!old.completedConsoles.has(completedConsoles[i])) {
        return false;
      }
    }

    return true;
  }

  clone(): LifeSuppSystem {
    return new LifeSuppSystem(this.shipStatus, this.timer, new Set(this.completedConsoles));
  }
}
