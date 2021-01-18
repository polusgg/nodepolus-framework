import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { RoomElectricalInteractedEvent } from "../../../../api/events/room";
import { SystemType } from "../../../../types/enums";
import { Bitfield } from "../../../../types";
import { BaseInnerShipStatus } from "..";
import { BaseSystem } from ".";

export class SwitchSystem extends BaseSystem {
  public expectedSwitches: Bitfield = new Bitfield(new Array(5).fill(0).map(() => !!Math.round(Math.random() * 1)));
  public actualSwitches: Bitfield = new Bitfield([...this.expectedSwitches.bits]);
  public visionModifier = 0xff;

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.Electrical);
  }

  async setSwitchState(switchIndex: number, switchState: boolean): Promise<void> {
    const event = new RoomElectricalInteractedEvent(this.shipStatus.parent.lobby.getGame()!, switchIndex, switchState);

    await this.shipStatus.parent.lobby.getServer().emit("room.electrical.interacted", event);

    this.actualSwitches.update(switchIndex, event.isFlipped());
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.expectedSwitches = Bitfield.fromNumber(data.readByte(), 5);
    this.actualSwitches = Bitfield.fromNumber(data.readByte(), 5);
    this.visionModifier = data.readByte();
  }

  getSpawn(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.expectedSwitches.toNumber())
      .writeByte(this.actualSwitches.toNumber())
      .writeByte(this.visionModifier);
  }

  equals(old: SwitchSystem): boolean {
    for (let i = 0; i < this.actualSwitches.bits.length; i++) {
      if (this.actualSwitches.bits[i] != old.actualSwitches.bits[i]) {
        return false;
      }
    }

    for (let i = 0; i < this.expectedSwitches.bits.length; i++) {
      if (this.expectedSwitches.bits[i] != old.expectedSwitches.bits[i]) {
        return false;
      }
    }

    if (this.visionModifier != old.visionModifier) {
      return false;
    }

    return true;
  }

  clone(): SwitchSystem {
    const clone = new SwitchSystem(this.shipStatus);

    clone.actualSwitches = new Bitfield([...this.actualSwitches.bits]);
    clone.expectedSwitches = new Bitfield([...this.expectedSwitches.bits]);
    clone.visionModifier = this.visionModifier;

    return clone;
  }
}
