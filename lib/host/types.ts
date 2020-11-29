import { ClientInstance } from "../client/types";
import { Connection } from "../protocol/connection";
import { PlayerColor } from "../types/playerColor";
import { RepairAmount } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { SystemType } from "../types/systemType";
import { InnerLevel } from "../protocol/entities/types";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";

export interface HostInstance extends ClientInstance {
  handleReady(sender: Connection): void;
  handleSceneChange(sender: Connection, sceneName: string): void;
  handleCheckName(sender: InnerPlayerControl, name: string): void;
  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void;
  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): void;
  handleRepairSystem(sender: InnerLevel, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void;
  handleCloseDoorsOfType(sender: InnerLevel, systemId: SystemType): void;
}
