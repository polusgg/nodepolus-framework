import { SystemType, SubmergedSpawnState } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";
import { PlayerInstance } from "../../../../api/player";

export class SubmergedSpawnInSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected state: SubmergedSpawnState = SubmergedSpawnState.Done,
    protected players: Set<number> = new Set(),
    protected timer: number = 10,
  ) {
    super(shipStatus, SystemType.SubmergedSpawnIn);
  }

  setPlayerReady(p: number): this {
    this.players.add(p);

    return this;
  }

  allPlayersReady(): boolean {
    return this.getPlayers().length === this.players.size;
  }

  reset(): void {
    this.state = SubmergedSpawnState.Waiting;
    this.players = new Set<number>();
    this.timer = 10;
  }

  getPlayers(): PlayerInstance[] {
    return this.shipStatus.getLobby().getRealPlayers().filter(player => !player.isDead())
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeByte(this.state).writeBytesAndSize([...this.players.values()]).writeFloat32(this.timer);
  }

  clone(): SubmergedSpawnInSystem {
    return new SubmergedSpawnInSystem(this.shipStatus, this.state, new Set(this.players.values()), this.timer);
  }

  equals(old: SubmergedSpawnInSystem): boolean {
    if (this.allPlayersReady() !== old.allPlayersReady()) {
      return false;
    }

    if (this.players.size !== old.players.size) {
      return false;
    }

    const values = this.players.values();

    for (const value of values) {
      if (!old.players.has(value)) {
        return false;
      }
    }

    return true;
  }
}
