import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class MedScanSystem extends BaseSystem {
  // TODO: Make protected with getter/setter
  public playersInQueue: Set<number> = new Set();

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.Medbay);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeList(this.playersInQueue, (writer, player) => {
      writer.writeByte(player);
    });
  }

  equals(old: MedScanSystem): boolean {
    if (this.playersInQueue.size != old.playersInQueue.size) {
      return false;
    }

    const playersInQueueArray = [...this.playersInQueue];
    const oldPlayersInQueueArray = [...old.playersInQueue];

    for (let i = 0; i < playersInQueueArray.length; i++) {
      if (playersInQueueArray[i] != oldPlayersInQueueArray[i]) {
        return false;
      }
    }

    return true;
  }

  clone(): MedScanSystem {
    const clone = new MedScanSystem(this.shipStatus);

    clone.playersInQueue = new Set(this.playersInQueue);

    return clone;
  }
}
