import { SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";

export class SubmergedPlayerFloorSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected playerFloors: Map<number, boolean> = new Map(),
  ) {
    super(shipStatus, SystemType.SubmergedFloor);
  }

  clone(): SubmergedPlayerFloorSystem {
    return new SubmergedPlayerFloorSystem(this.shipStatus, new Map(this.playerFloors.entries()));
  }

  equals(old: SubmergedPlayerFloorSystem): boolean {
    if (this.playerFloors.size !== old.playerFloors.size) {
      return false;
    }

    const allPlayers = this.playerFloors.keys();

    for (const key of allPlayers) {
      if (this.playerFloors.get(key) !== old.playerFloors.get(key)) {
        return false;
      }
    }

    return true;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    const writer = new MessageWriter();

    writer.writeByte(this.playerFloors.size);

    const entries = this.playerFloors.entries();

    for (const entry of entries) {
      writer.writeByte(entry[0]);
      writer.writeBoolean(entry[1]);
    }

    return writer;
  }

  setPlayerFloor(player: number, isOnUpper: boolean): void {
    this.playerFloors.set(player, isOnUpper);
  }

  isPlayerOnUpperFloor(player: number): boolean {
    if (!this.playerFloors.has(player)) {
      throw new Error("Player not in PlayerFloorSystem");
    }

    return this.playerFloors.get(player)!;
  }
}
