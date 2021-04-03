import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class HeliSabotageSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected countdown: number = 10000,
    protected timer: number = -1,
    protected activeConsoles: Map<number, number> = new Map(),
    protected completedConsoles: Set<number> = new Set([0, 1]),
  ) {
    super(shipStatus, SystemType.Reactor);
  }

  getTimer(): number {
    return this.timer;
  }

  setTimer(seconds: number): this {
    this.timer = seconds;

    return this;
  }

  getCountdown(): number {
    return this.countdown;
  }

  setCountdown(seconds: number): this {
    this.countdown = seconds;

    return this;
  }

  decrementCountdown(seconds: number = 1): this {
    this.countdown -= Math.abs(seconds);

    if (this.countdown < 0) {
      this.countdown = 0;
    }

    return this;
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
      .writeFloat32(this.countdown)
      .writeFloat32(this.timer)
      .writeList(this.activeConsoles, (writer, pair) => writer.writeBytes(pair), true)
      .writeList(this.completedConsoles, (writer, con) => writer.writeByte(con), true);
  }

  equals(old: HeliSabotageSystem): boolean {
    if (this.timer != old.timer) {
      return false;
    }

    if (this.countdown != old.countdown) {
      return false;
    }

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

  clone(): HeliSabotageSystem {
    return new HeliSabotageSystem(this.shipStatus, this.countdown, this.timer, new Map(this.activeConsoles), new Set(this.completedConsoles));
  }
}
