import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class LaboratorySystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected timer: number = 10000,
    protected userConsoles: Map<number, number> = new Map(),
  ) {
    super(shipStatus, SystemType.Laboratory);
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

  getUserConsoles(): Map<number, number> {
    return this.userConsoles;
  }

  setUserConsoles(userConsoles: Map<number, number>): this {
    this.userConsoles = userConsoles;

    return this;
  }

  clearUserConsoles(): this {
    this.userConsoles.clear();

    return this;
  }

  getUserConsole(playerId: number): number | undefined {
    return this.userConsoles.get(playerId);
  }

  setUserConsole(playerId: number, consoleId: number): this {
    this.userConsoles.set(playerId, consoleId);

    return this;
  }

  removeUserConsole(playerId: number): this {
    this.userConsoles.delete(playerId);

    return this;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter()
      .writeFloat32(this.timer)
      .writeList(this.userConsoles, (writer, pair) => {
        writer.writeByte(pair[0]);
        writer.writeByte(pair[1]);
      });
  }

  equals(old: LaboratorySystem): boolean {
    if (this.timer != old.timer) {
      return false;
    }

    if (this.userConsoles.size != old.userConsoles.size) {
      return false;
    }

    let testVal;

    for (const [key, val] of this.userConsoles) {
      testVal = old.userConsoles.get(key);

      if (testVal !== val) {
        return false;
      }

      if (!testVal && !old.userConsoles.has(key)) {
        return false;
      }
    }

    return true;
  }

  clone(): LaboratorySystem {
    return new LaboratorySystem(this.shipStatus, this.timer, new Map(this.userConsoles));
  }
}
