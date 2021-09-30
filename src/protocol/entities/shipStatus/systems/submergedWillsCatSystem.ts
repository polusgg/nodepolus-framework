import { SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";

export class SubmergedWillsCatSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected catPosition: number = Math.floor(Math.random() * 2), // hardcoded 2, not changing right now
  ) {
    super(shipStatus, SystemType.SubmergedFloor);
  }

  clone(): SubmergedWillsCatSystem {
    return new SubmergedWillsCatSystem(this.shipStatus, this.catPosition);
  }

  equals(old: SubmergedWillsCatSystem): boolean {
    return this.catPosition === old.catPosition;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    const writer = new MessageWriter();

    writer.writeByte(this.catPosition);

    return writer;
  }

  setCatPosition(location: number) {
    this.catPosition = location;
  }
}
