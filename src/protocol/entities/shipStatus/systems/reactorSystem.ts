import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class ReactorSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected countdown: number = 10000,
    protected userConsoles: Map<number, number> = new Map(),
  ) {
    super(shipStatus, SystemType.Reactor);
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
      .writeFloat32(this.countdown)
      .writeList(this.userConsoles, (writer, pair) => {
        writer.writeByte(pair[0]);
        writer.writeByte(pair[1]);
      });
  }

  equals(old: ReactorSystem): boolean {
    if (this.countdown != old.countdown) {
      return false;
    }

    if (this.userConsoles.size != old.userConsoles.size) {
      return false;
    }

    const userConsoles = [...this.userConsoles];

    for (let i = 0; i < userConsoles.length; i++) {
      if (old.userConsoles.get(userConsoles[i][0]) != userConsoles[i][1]) {
        return false;
      }
    }

    return true;
  }

  clone(): ReactorSystem {
    return new ReactorSystem(this.shipStatus, this.countdown, new Map(this.userConsoles));
  }
}
