import { RepairAmount } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { InnerLevel } from "../protocol/entities/types";
import { Connection } from "../protocol/connection";
import { PlayerColor } from "../types/playerColor";
import { SystemType } from "../types/systemType";
import { ClientInstance } from "../client/types";

export interface HostInstance extends ClientInstance {
  handleReady(sender: Connection): void;

  handleSceneChange(sender: Connection, sceneName: string): void;

  handleCheckName(sender: InnerPlayerControl, name: string): void;

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void;

  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): void;

  handleRepairSystem(sender: InnerLevel, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void;

  handleCloseDoorsOfType(sender: InnerLevel, systemId: SystemType): void;

  handleSetStartCounter(sequenceId: number, timeRemaining: number): void;

  setInfected(infectedCount: number): void;

  setTasks(): void;
}
