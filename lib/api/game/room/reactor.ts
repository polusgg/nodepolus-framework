import { ReactorAmount, ReactorAction } from "../../../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { ReactorSystem } from "../../../protocol/entities/baseShipStatus/systems/reactorSystem";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { SystemType } from "../../../types/systemType";
import { BaseDoorGameRoom } from "./base";
import { Player } from "../../../player";
import { Game } from "..";

export class ReactorGameRoom extends BaseDoorGameRoom {
  constructor(game: Game) {
    super(game, SystemType.Reactor);
  }

  getInternalSystem(): ReactorSystem {
    return this.getInternalShipStatus().systems[InternalSystemType.Reactor] as ReactorSystem;
  }

  sabotage(): void {
    this.internalBackupShipStatus();

    if (!this.game.lobby.internalLobby.customHostInstance.sabotageHandler) {
      throw new Error("Host has no SabotageHandler instance");
    }

    this.game.lobby.internalLobby.customHostInstance.sabotageHandler.sabotageReactor(this.getInternalSystem());

    this.internalUpdateShipStatus();
  }

  repair(): void {
    const host = this.game.lobby.internalLobby.customHostInstance;

    this.internalBackupShipStatus();

    if (!host.systemsHandler) {
      throw new Error("Host has no SystemsHandler instance");
    }

    host.systemsHandler.repairReactor(
      undefined as unknown as Player,
      this.getInternalSystem(),
      new ReactorAmount(0, ReactorAction.Repaired),
    );
  }
}
