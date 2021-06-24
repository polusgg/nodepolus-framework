import { SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";

export class SubmergedOxygenSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected duration: number = 10000,
    protected playersWithMask: Set<number> = new Set(),
  ) {
    super(shipStatus, SystemType.Oxygen);
  }

  getDuration(): number {
    return this.duration;
  }

  setDuration(duration: number): this {
    this.duration = duration;

    return this;
  }

  clearPlayersWithMasks(): this {
    this.playersWithMask.clear();

    return this;
  }

  addPlayerWithMask(player: number): this {
    this.playersWithMask.add(player);

    return this;
  }

  decrementTimer(): this {
    this.duration--;

    return this;
  }

  isSabotaged(): boolean {
    return this.duration < 10000;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeFloat32(this.duration).writeBytesAndSize([...this.playersWithMask.values()]);
  }

  equals(old: SubmergedOxygenSystem): boolean {
    if (this.duration !== old.duration) {
      return false;
    }

    const playersWithMask = this.getPlayersWithMask();
    const oldPlayersWithMask = old.getPlayersWithMask();

    if (playersWithMask.length !== oldPlayersWithMask.length) {
      return false;
    }

    for (let i = 0; i < playersWithMask.length; i++) {
      if (!old.playerHasMask(playersWithMask[i])) {
        return false;
      }
    }

    return true;
  }

  clone(): SubmergedOxygenSystem {
    return new SubmergedOxygenSystem(this.shipStatus, this.duration);
  }

  repair(): void {
    this.duration = 10000;

    this.playersWithMask.clear();
  }

  playerHasMask(p: number): boolean {
    return this.playersWithMask.has(p);
  }

  getPlayersWithMask(): number[] {
    return [...this.playersWithMask.values()];
  }
}
