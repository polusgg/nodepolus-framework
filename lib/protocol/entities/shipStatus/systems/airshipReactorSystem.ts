import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class AirshipReactorSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected activeConsoles: Map<number, number> = new Map(),
    protected completedConsoles: Set<number> = new Set([0, 1]),
  ) {
    super(shipStatus, SystemType.Reactor);
  }

  getActiveConsoles(): Map<number, number> {
    return this.activeConsoles;
  }

  setActiveConsoles(activeConsoles: Map<number, number>): this {
    this.activeConsoles = activeConsoles;

    return this;
  }

  clearActiveConsoles(): this {
    this.activeConsoles.clear();

    return this;
  }

  getActiveConsole(playerId: number): number | undefined {
    return this.activeConsoles.get(playerId);
  }

  setActiveConsole(playerId: number, consoleId: number): this {
    this.activeConsoles.set(playerId, consoleId);

    return this;
  }

  removeActiveConsole(playerId: number): this {
    this.activeConsoles.delete(playerId);

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
      .writeList(this.activeConsoles, (writer, pair) => {
        writer.writeByte(pair[0]);
        writer.writeByte(pair[1]);
      }).writeList(this.completedConsoles, (writer, con) => writer.writeByte(con));
  }

  equals(old: AirshipReactorSystem): boolean {
    if (this.activeConsoles.size != old.activeConsoles.size) {
      return false;
    }

    if (this.completedConsoles.size != old.completedConsoles.size) {
      return false;
    }

    const completedConsolesArray = [...this.completedConsoles];
    const oldCompletedConsolesArray = [...old.completedConsoles];

    for (let i = 0; i < completedConsolesArray.length; i++) {
      if (oldCompletedConsolesArray[i] != completedConsolesArray[i]) {
        return false;
      }
    }

    if (this.activeConsoles.size != old.activeConsoles.size) {
      return false;
    }

    let testVal: number | undefined;

    for (const [key, val] of this.activeConsoles) {
      testVal = old.activeConsoles.get(key);

      if (testVal !== val) {
        return false;
      }

      if (!testVal && !old.activeConsoles.has(key)) {
        return false;
      }
    }

    return true;
  }

  clone(): AirshipReactorSystem {
    return new AirshipReactorSystem(this.shipStatus, new Map(this.activeConsoles), new Set(this.completedConsoles));
  }
}
