// TODO: Remove when finished
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RepairAmount } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { DisconnectReason } from "../types/disconnectReason";
import { InnerLevel } from "../protocol/entities/types";
import { Connection } from "../protocol/connection";
import { PlayerColor } from "../types/playerColor";
import { FakeHostId } from "../types/fakeHostId";
import { SystemType } from "../types/systemType";
import { HostInstance } from "./types";

export class CustomHost implements HostInstance {
  public readonly id: number = FakeHostId.ServerAsHost;

  sendKick(banned: boolean, reason: DisconnectReason): void {
    throw new Error("Method not implemented.");
  }

  sendLateRejection(disconnectReason: DisconnectReason): void {
    throw new Error("Method not implemented.");
  }

  sendWaitingForHost(): void {
    throw new Error("Method not implemented.");
  }

  handleReady(sender: Connection): void {
    throw new Error("Method not implemented.");
  }

  handleSceneChange(sender: Connection, sceneName: string): void {
    throw new Error("Method not implemented.");
  }

  handleCheckName(sender: InnerPlayerControl, name: string): void {
    throw new Error("Method not implemented.");
  }

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void {
    throw new Error("Method not implemented.");
  }

  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): void {
    throw new Error("Method not implemented.");
  }

  handleRepairSystem(sender: InnerLevel, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void {
    throw new Error("Method not implemented.");
  }

  handleCloseDoorsOfType(sender: InnerLevel, systemId: SystemType): void {
    throw new Error("Method not implemented.");
  }
}
