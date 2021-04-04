import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export enum MovingPlatformSide {
  Right = 0x00,
  Left = 0x01,
}

export class MovingPlatformSystem extends BaseSystem {
  private inUse = false;

  constructor(
    shipStatus: BaseInnerShipStatus,
    protected sequenceId: number = 0,
    protected innerPlayerControlNetId?: number,
    protected side: MovingPlatformSide = MovingPlatformSide.Left,
  ) {
    super(shipStatus, SystemType.GapRoom);
  }

  ride(netId: number): void {
    this.setInnerPlayerControlNetId(netId);
    this.toggleSide();
    this.incrementSequenceId();
    this.inUse = true;

    setTimeout(() => {
      this.inUse = false;
    }, 5000);
  }

  isInUse(): boolean {
    return this.inUse;
  }

  getSequenceId(): number {
    return this.sequenceId;
  }

  setSequenceId(sequenceId: number): this {
    this.sequenceId = sequenceId;

    return this;
  }

  incrementSequenceId(amount: number = 1): this {
    this.sequenceId += amount;

    return this;
  }

  getInnerPlayerControlNetId(): number | undefined {
    return this.innerPlayerControlNetId;
  }

  setInnerPlayerControlNetId(innerPlayerControlNetId?: number): this {
    this.innerPlayerControlNetId = innerPlayerControlNetId;

    return this;
  }

  getSide(): MovingPlatformSide {
    return this.side;
  }

  setSide(side: MovingPlatformSide): this {
    this.side = side;

    return this;
  }

  toggleSide(): this {
    if (!(this.side in MovingPlatformSide)) {
      return this;
    }

    this.side = (this.side + 1) % 2;

    return this;
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
