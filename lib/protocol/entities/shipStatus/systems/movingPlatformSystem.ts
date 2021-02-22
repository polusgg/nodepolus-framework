import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

enum MovingPlatformSide {
  Left = 0x00,
  Right = 0x01,
}

export class MovingPlatformSystem extends BaseSystem {
  // TODO: Make protected with getter/setter
  public sequenceId = 0;
  // TODO: Make protected with getter/setter
  public innerPlayerControlNetId?: number;
  // TODO: Make protected with getter/setter
  public side: MovingPlatformSide = MovingPlatformSide.Left;

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.GapRoom);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
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
