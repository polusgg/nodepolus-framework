import { MessageWriter } from "../../../../../util/hazelMessage";
import { CanSerializeToHazel } from "../../../../../types";

export abstract class RepairAmount implements CanSerializeToHazel {
  abstract clone(): RepairAmount;

  abstract getValue(): number;

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.getValue());
  }
}
