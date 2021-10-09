import { SubmergedSpawnState, SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";
import { PlayerInstance } from "../../../../api/player";

export class SubmergedSpawnInSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected state: SubmergedSpawnState = SubmergedSpawnState.Waiting,
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
    return this.getUnreadyPlayers().length == 0;
  }

  reset(state: SubmergedSpawnState): void {
    this.state = state;
    this.players = new Set<number>();
    if (state === SubmergedSpawnState.Done) this.timer = 0;
    else this.timer = 10;
  }

  getAllPlayers(): PlayerInstance[] {
    return this.shipStatus.getLobby().getRealPlayers().filter(player => !player.isDead())
  }

  getReadyPlayers(): PlayerInstance[] {
    return this.getAllPlayers().filter(player => this.players.has(player.getId()));
  }

  getUnreadyPlayers(): PlayerInstance[] {
    return this.getAllPlayers().filter(player => !this.players.has(player.getId()));
  }

  getState(): SubmergedSpawnState {
    return this.state;
  }

  setState(state: SubmergedSpawnState) {
    state = SubmergedSpawnState.Spawning;
  }

  getTimer(): number {
    return this.timer;
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
