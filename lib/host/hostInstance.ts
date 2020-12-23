import { RepairAmount } from "../protocol/packets/rpc/repairSystem/amounts";
import { BaseInnerShipStatus } from "../protocol/entities/baseShipStatus";
import { InnerPlayerControl } from "../protocol/entities/player";
import { PlayerColor, SystemType } from "../types/enums";
import { Connection } from "../protocol/connection";
import { ClientInstance } from "../client";

export interface HostInstance extends ClientInstance {
  handleReady(sender: Connection): void;

  handleSceneChange(sender: Connection, sceneName: string): void;

  handleCheckName(sender: InnerPlayerControl, name: string): void;

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void;

  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): void;

  handleRepairSystem(sender: BaseInnerShipStatus, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void;

  handleCloseDoorsOfType(sender: BaseInnerShipStatus, systemId: SystemType): void;

  handleSetStartCounter(sequenceId: number, timeRemaining: number): void;

  handleCompleteTask(sender: InnerPlayerControl, taskIndex: number): void;

  handleMurderPlayer(sender: InnerPlayerControl, victimPlayerControlNetId: number): void;

  handleUsePlatform(sender: InnerPlayerControl): void;

  handleImpostorDeath(): void;

  handleCastVote(votingPlayerId: number, suspectPlayerId: number): void;

  setInfected(infectedCount: number): void;

  setTasks(): void;
}
