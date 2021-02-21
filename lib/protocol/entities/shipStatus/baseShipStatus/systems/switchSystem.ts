import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { RoomElectricalInteractedEvent } from "../../../../../api/events/room";
import { SystemType } from "../../../../../types/enums";
import { Bitfield } from "../../../../../types";
import { BaseInnerShipStatus } from "..";
import { BaseSystem } from ".";

export class SwitchSystem extends BaseSystem {
  public expectedSwitches: Bitfield = new Bitfield(new Array(5).fill(0).map(() => !!Math.round(Math.random() * 1)));
  public actualSwitches: Bitfield = this.expectedSwitches.clone();
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
    const clone = new SwitchSystem(this.shipStatus);

    clone.actualSwitches = this.actualSwitches.clone();
    clone.expectedSwitches = this.expectedSwitches.clone();
    clone.visionModifier = this.visionModifier;

    return clone;
  }
}
