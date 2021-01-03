import { RepairAmount } from "../../protocol/packets/rpc/repairSystem/amounts";
import { BaseInnerShipStatus } from "../../protocol/entities/baseShipStatus";
import { GameOverReason, PlayerColor, SystemType } from "../../types/enums";
import { InnerPlayerControl } from "../../protocol/entities/player";
import { Connection } from "../../protocol/connection";
import { PlayerInstance } from "../player";
import {
  AutoDoorsHandler,
  DecontaminationHandler,
  DoorsHandler,
  SabotageSystemHandler,
  SystemsHandler,
} from "../../host/systemHandlers";

export interface HostInstance {
  getId(): number;

  getNextNetId(): number;

  handleReady(sender: Connection): void;

  handleSceneChange(sender: Connection, sceneName: string): Promise<void>;

  handleCheckName(sender: InnerPlayerControl, name: string): void;

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void;

  handleCompleteTask(sender: InnerPlayerControl, taskIndex: number): void;

  handleMurderPlayer(sender: InnerPlayerControl, victimPlayerControlNetId: number): void;

  handleImpostorDeath(): void;

  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): void;

  handleCastVote(votingPlayerId: number, suspectPlayerId: number): void;

  handleRepairSystem(sender: BaseInnerShipStatus, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void;

  handleCloseDoorsOfType(sender: BaseInnerShipStatus, systemId: SystemType): void;

  handleSetStartCounter(player: PlayerInstance, sequenceId: number, timeRemaining: number): void;

  handleDisconnect(connection: Connection): void;

  handleUsePlatform(sender: InnerPlayerControl): void;

  startCountdown(count: number, starter?: PlayerInstance): void;

  stopCountdown(): void;

  startGame(): void;

  setInfected(infectedCount: number): void;

  setTasks(): void;

  endMeeting(): void;

  endGame(reason: GameOverReason): void;

  getSystemsHandler(): SystemsHandler | undefined;

  getSabotageHandler(): SabotageSystemHandler | undefined;

  getDoorHandler(): DoorsHandler | AutoDoorsHandler | undefined;

  getDecontaminationHandlers(): DecontaminationHandler[];
}
