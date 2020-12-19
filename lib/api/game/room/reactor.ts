import { ReactorAmount, ReactorAction } from "../../../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { ReactorSystem } from "../../../protocol/entities/baseShipStatus/systems/reactorSystem";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { SystemType } from "../../../types/systemType";
import { BaseDoorGameRoom } from "./base";
import { Player } from "../../../player";
import { Game } from "..";

export class ReactorGameRoom extends BaseDoorGameRoom {
  get internalSystem(): ReactorSystem {
    return this.internalShipStatus.systems[InternalSystemType.Reactor] as ReactorSystem;
  }

  constructor(game: Game) {
    super(game, SystemType.Reactor);
  }

  sabotage(): void {
    this.internalBackupShipStatus();

    if (!this.game.lobby.internalLobby.customHostInstance.sabotageHandler) {
      throw new Error("Host has no SabotageHandler instance");
    }

    this.game.lobby.internalLobby.customHostInstance.sabotageHandler.sabotageReactor(this.internalSystem);

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
      this.internalSystem,
      new ReactorAmount(0, ReactorAction.Repaired),
    );
  }
}
