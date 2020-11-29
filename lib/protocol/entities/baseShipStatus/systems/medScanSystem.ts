import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class MedScanSystem extends BaseSystem<MedScanSystem> {
  playersInQueue!: Set<number>;

  constructor() {
    super(SystemType.Medbay);
  }

  getData(old: MedScanSystem): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeList(this.playersInQueue, (writer, player) => {
      writer.writeByte(player);
    });
  }

  setSpawn(data: MessageReader): void {
    this.playersInQueue = new Set(data.readList(reader => reader.readByte()));
  }

  equals(old: MedScanSystem): boolean {
    if (this.playersInQueue.size != old.playersInQueue.size) {
      return false;
    }

    let playersInQueueArray = new Array(this.playersInQueue);
    let oldPlayersInQueueArray = new Array(old.playersInQueue);

    for (let i = 0; i < playersInQueueArray.length; i++) {
      if (playersInQueueArray[i] != oldPlayersInQueueArray[i]) {
        return false;
      }
    }

    return true;
  }

  static spawn(data: MessageReader): MedScanSystem {
    let medScanSystem = new MedScanSystem();
    
    medScanSystem.setSpawn(data);
    
    return medScanSystem;
  }
}

