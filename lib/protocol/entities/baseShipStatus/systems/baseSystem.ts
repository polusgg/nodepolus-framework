import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";

export abstract class BaseSystem<T> {
  constructor(public readonly type: SystemType) {}

  abstract getData(old: this): MessageWriter;

  abstract setData(packet: MessageReader): void;

  abstract getSpawn(): MessageWriter;

  abstract setSpawn(packet: MessageReader): void;

  abstract equals(old: BaseSystem<T>): boolean;

  abstract clone(): T;

  data(packet: MessageReader): undefined;
  data(old: this): MessageWriter;
  data(arg0: MessageReader | this): MessageWriter | undefined {
    if (arg0 instanceof MessageReader) {
      this.setData(arg0);
    } else {
      return this.getData(arg0);
    }
  }

  spawn(packet: MessageReader): undefined;
  spawn(): MessageWriter;
  spawn(fromPacket?: MessageReader): MessageWriter | undefined {
    if (fromPacket) {
      this.setSpawn(fromPacket);
    } else {
      return this.getSpawn();
    }
  }
}
