import { RoomElectricalInteractedEvent } from "../../../../api/events/room";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { Bitfield } from "../../../../types";
import { BaseSystem } from ".";

export class SwitchSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected expectedSwitches: Bitfield = new Bitfield(new Array(5).fill(0).map(() => !!Math.round(Math.random() * 1))),
    protected actualSwitches: Bitfield = expectedSwitches.clone(),
    protected visionModifier: number = 0xff,
  ) {
    super(shipStatus, SystemType.Electrical);
  }

  getExpectedSwitches(): Bitfield {
    return this.expectedSwitches;
  }

  setExpectedSwitches(expectedSwitches: Bitfield): this {
    this.expectedSwitches = expectedSwitches;

    return this;
  }

  getActualSwitches(): Bitfield {
    return this.actualSwitches;
  }

  setActualSwitches(actualSwitches: Bitfield): this {
    this.actualSwitches = actualSwitches;

    return this;
  }

  getVisionModifier(): number {
    return this.visionModifier;
  }

  setVisionModifier(visionModifier: number): this {
    this.visionModifier = visionModifier;

    return this;
  }

  async setSwitchState(switchIndex: number, switchState: boolean): Promise<void> {
    const event = new RoomElectricalInteractedEvent(this.shipStatus.getParent().getLobby().getSafeGame(), switchIndex, switchState);

    await this.shipStatus.getParent().getLobby().getServer().emit("room.electrical.interacted", event);

    this.actualSwitches.update(switchIndex, event.isFlipped());
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.expectedSwitches.toNumber())
      .writeByte(this.actualSwitches.toNumber())
      .writeByte(this.visionModifier);
  }

  equals(old: SwitchSystem): boolean {
    if (!this.actualSwitches.equals(old.actualSwitches)) {
      return false;
    }

    if (!this.expectedSwitches.equals(old.expectedSwitches)) {
      return false;
    }

    if (this.visionModifier != old.visionModifier) {
      return false;
    }

    return true;
  }

  clone(): SwitchSystem {
    return new SwitchSystem(this.shipStatus, this.expectedSwitches.clone(), this.actualSwitches.clone(), this.visionModifier);
  }
}
