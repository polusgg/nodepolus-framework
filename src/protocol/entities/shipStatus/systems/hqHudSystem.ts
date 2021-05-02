import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class HqHudSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected activeConsoles: Map<number, number> = new Map(),
    protected completedConsoles: Set<number> = new Set([0, 1]),
  ) {
    super(shipStatus, SystemType.Communications);
  }

  isSabotaged(): boolean {
    return this.completedConsoles.size < 2;
  }

  repair(): void {
    this.activeConsoles.clear();

    this.completedConsoles = new Set([0, 1]);
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
      .writeList(this.activeConsoles, (writer, pair) => writer.writeBytes(pair))
      .writeList(this.completedConsoles, (writer, con) => writer.writeByte(con));
  }

  equals(old: HqHudSystem): boolean {
    if (this.activeConsoles.size != old.activeConsoles.size) {
      return false;
    }

    if (this.completedConsoles.size != old.completedConsoles.size) {
      return false;
    }

    const activeConsoles = [...this.activeConsoles];

    for (let i = 0; i < activeConsoles.length; i++) {
      if (old.activeConsoles.get(activeConsoles[i][0]) != activeConsoles[i][1]) {
        return false;
      }
    }

    const completedConsoles = [...this.completedConsoles];

    for (let i = 0; i < completedConsoles.length; i++) {
      if (!old.completedConsoles.has(completedConsoles[i])) {
        return false;
      }
    }

    return true;
  }

  clone(): HqHudSystem {
    return new HqHudSystem(this.shipStatus, new Map(this.activeConsoles), new Set(this.completedConsoles));
  }
}
