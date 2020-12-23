import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class MedScanSystem extends BaseSystem {
  public playersInQueue: Set<number> = new Set();

  constructor() {
    super(SystemType.Medbay);
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.playersInQueue = new Set(data.readList(reader => reader.readByte()));
  }

  getSpawn(): MessageWriter {
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
    const clone = new MedScanSystem();

    clone.playersInQueue = new Set(this.playersInQueue);

    return clone;
  }
}

