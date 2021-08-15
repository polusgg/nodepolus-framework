import { SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";

export class SubmergedSpawnInSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected readyPlayers: Set<number> = new Set(),
    protected readyToSpawnIn: boolean = false,
  ) {
    super(shipStatus, SystemType.SubmergedSpawnIn);
  }

  setPlayerReady(p: number): this {
    this.readyPlayers.add(p);

    this.readyToSpawnIn = this.shipStatus.getLobby().getRealPlayers().length === this.readyPlayers.size;

    return this;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeBytesAndSize([...this.readyPlayers.values()]).writeBoolean(this.readyToSpawnIn);
  }

  clone(): SubmergedSpawnInSystem {
    return new SubmergedSpawnInSystem(this.shipStatus, new Set(this.readyPlayers.values()));
  }

  equals(old: SubmergedSpawnInSystem): boolean {
    if (this.readyToSpawnIn !== old.readyToSpawnIn) {
      return false;
    }

    if (this.readyPlayers.size !== old.readyPlayers.size) {
      return false;
    }

    const values = this.readyPlayers.values();

    for (const value of values) {
      if (!old.readyPlayers.has(value)) {
        return false;
      }
    }

    return true;
  }

  getReadyToSpawnIn(): boolean {
    return this.readyToSpawnIn;
  }
}
