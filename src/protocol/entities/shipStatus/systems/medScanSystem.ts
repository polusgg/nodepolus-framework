import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class MedScanSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected playersInQueue: Set<number> = new Set(),
  ) {
    super(shipStatus, SystemType.Medbay);
  }

  getPlayersInQueue(): Set<number> {
    return this.playersInQueue;
  }

  setPlayersInQueue(playersInQueue: Set<number>): this {
    this.playersInQueue = playersInQueue;

    return this;
  }

  clearPlayersInQueue(): this {
    this.playersInQueue.clear();

    return this;
  }

  addPlayerInQueue(playerId: number): this {
    this.playersInQueue.add(playerId);

    return this;
  }

  removePlayerInQueue(playerId: number): this {
    this.playersInQueue.delete(playerId);

    return this;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeList(this.playersInQueue, (writer, player) => writer.writeByte(player));
  }

  equals(old: MedScanSystem): boolean {
    if (this.playersInQueue.size != old.playersInQueue.size) {
      return false;
    }

    const playersInQueue = [...this.playersInQueue];

    for (let i = 0; i < playersInQueue.length; i++) {
      if (!old.playersInQueue.has(playersInQueue[i])) {
        return false;
      }
    }

    return true;
  }

  clone(): MedScanSystem {
    return new MedScanSystem(this.shipStatus, new Set(this.playersInQueue));
  }
}
