import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";

export abstract class BaseSystem<T> {
  constructor(public readonly type: SystemType) {}
  
  abstract setData(packet: MessageReader): void;

  abstract getData(old: this): MessageWriter;

  data(packet: MessageReader): void;
  data(old: this): MessageWriter;
  data(arg0: MessageReader | this): MessageWriter | void {
    if (arg0 instanceof MessageReader) {
      this.setData(arg0);
    } else {
      return this.getData(arg0);
    }
  }

  abstract setSpawn(packet: MessageReader): void;

  abstract getSpawn(): MessageWriter;

  spawn(packet: MessageReader): void;
  spawn(): MessageWriter;
  spawn(fromPacket?: MessageReader): MessageWriter | void {
    if (fromPacket) {
      this.setSpawn(fromPacket);
    } else {
      return this.getSpawn();
    }
  }

  abstract equals(old: BaseSystem<T>): boolean;
}
