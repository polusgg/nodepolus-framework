import { SabotageAmount, ReactorAmount, ReactorAction } from "../../../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { ReactorSystem } from "../../../protocol/entities/baseShipStatus/systems/reactorSystem";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { Connection } from "../../../protocol/connection";
import { SystemType } from "../../../types/systemType";
import { CustomHost } from "../../../host";
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
    if (this.game.lobby.internalLobby.host instanceof CustomHost) {
      this.internalBackupShipStatus();

      if (!this.game.lobby.internalLobby.host.sabotageHandler) {
        throw new Error("Host has no SabotageHandler instance");
      }

      this.game.lobby.internalLobby.host.sabotageHandler.sabotageReactor(this.internalSystem);

      this.internalUpdateShipStatus();
    } else if (this.game.lobby.internalLobby.host instanceof Connection) {
      this.internalShipStatus.repairSystem(
        SystemType.Sabotage,
        this.game.lobby.players[0].internalPlayer.gameObject.playerControl.id,
        new SabotageAmount(SystemType.Reactor),
      );
    } else {
      throw new Error("Attempted to sabotage reactor with an unsupported host instance");
    }
  }

  repair(): void {
    const host = this.game.lobby.internalLobby.host;

    if (host instanceof CustomHost) {
      this.internalBackupShipStatus();

      if (!host.systemsHandler) {
        throw new Error("Host has no SystemsHandler instance");
      }

      host.systemsHandler.repairReactor(
        undefined as unknown as Player,
        this.internalSystem,
        new ReactorAmount(0, ReactorAction.Repaired),
      );
    } else {
      this.internalShipStatus.repairSystem(
        SystemType.Reactor,
        this.game.lobby.players[0].internalPlayer.gameObject.playerControl.id,
        new ReactorAmount(0, ReactorAction.Repaired),
      );
    }
  }
}
