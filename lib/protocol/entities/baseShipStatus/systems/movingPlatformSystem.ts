import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";
import { BaseInnerShipStatus } from "..";

enum MovingPlatformSide {
  Left = 0x00,
  Right = 0x01,
}

export class MovingPlatformSystem extends BaseSystem {
  public sequenceId = 0;
  public innerPlayerControlNetId?: number;
  public side: MovingPlatformSide = MovingPlatformSide.Left;

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.GapRoom);
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.sequenceId = data.readByte();

    const innerPlayerControlNetId = data.readInt32();

    if (innerPlayerControlNetId > -1) {
      this.innerPlayerControlNetId = innerPlayerControlNetId;
    }

    this.side = data.readByte();
  }

  getSpawn(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.sequenceId % 256)
      .writeInt32(this.innerPlayerControlNetId ?? -1)
      .writeByte(this.side);
  }

  equals(old: MovingPlatformSystem): boolean {
    if (this.sequenceId != old.sequenceId) {
      return false;
    }

    if (this.innerPlayerControlNetId != old.innerPlayerControlNetId) {
      return false;
    }

    if (this.side != old.side) {
      return false;
    }

    return true;
  }

  clone(): MovingPlatformSystem {
    const clone = new MovingPlatformSystem(this.shipStatus);

    clone.sequenceId = this.sequenceId;
    clone.innerPlayerControlNetId = this.innerPlayerControlNetId;
    clone.side = this.side;

    return clone;
  }
}
