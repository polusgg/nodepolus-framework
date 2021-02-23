import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export enum MovingPlatformSide {
  Left = 0x00,
  Right = 0x01,
}

export class MovingPlatformSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter/setter
    public sequenceId: number = 0,
    // TODO: Make protected with getter/setter
    public innerPlayerControlNetId?: number,
    // TODO: Make protected with getter/setter
    public side: MovingPlatformSide = MovingPlatformSide.Left,
  ) {
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
    return new MovingPlatformSystem(this.shipStatus, this.sequenceId, this.innerPlayerControlNetId, this.side);
  }
}
