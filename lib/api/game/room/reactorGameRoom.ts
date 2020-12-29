import { ReactorAction } from "../../../protocol/packets/rpc/repairSystem/actions";
import { ReactorAmount } from "../../../protocol/packets/rpc/repairSystem/amounts";
import { ReactorSystem } from "../../../protocol/entities/baseShipStatus/systems";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus";
import { SystemType } from "../../../types/enums";
import { InternalPlayer } from "../../../player";
import { BaseDoorGameRoom } from ".";
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
      undefined as unknown as InternalPlayer,
      this.getInternalSystem(),
      new ReactorAmount(0, ReactorAction.Repaired),
    );
  }
}
