import { SabotageAmount, ElectricalAmount } from "../../../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { SwitchSystem } from "../../../protocol/entities/baseShipStatus/systems/switchSystem";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { Connection } from "../../../protocol/connection";
import { SystemType } from "../../../types/systemType";
import { CustomHost } from "../../../host";
import { BaseDoorGameRoom } from "./base";
import { Player } from "../../../player";
import { Game } from "..";

export class Switch {
  get state(): boolean {
    return this.room.internalSystem.actualSwitches[this.index];
  }

  get preferredState(): boolean {
    return this.room.internalSystem.expectedSwitches[this.index];
  }

  constructor(
    public room: ElectricalGameRoom,
    public readonly index: number,
  ) {}

  flip(): void {
    this.room.internalBackupShipStatus();

    this.room.internalSystem.actualSwitches[this.index] = !this.state;

    this.room.internalUpdateShipStatus();
  }

  setOn(): void {
    if (!this.state) {
      this.flip();
    }
  }

  setOff(): void {
    if (this.state) {
      this.flip();
    }
  }

  repair(): void {
    if (this.state != this.preferredState) {
      this.flip();
    }
  }

  flipPreferred(): void {
    this.room.internalBackupShipStatus();

    this.room.internalSystem.expectedSwitches[this.index] = !this.preferredState;

    this.room.internalUpdateShipStatus();
  }

  setPreferredOn(): void {
    if (!this.preferredState) {
      this.flipPreferred();
    }
  }

  setPreferredOff(): void {
    if (this.preferredState) {
      this.flipPreferred();
    }
  }
}

export class ElectricalGameRoom extends BaseDoorGameRoom {
  get switches(): Switch[] {
    return this.internalSwitches;
  }

  get isSabotaged(): boolean {
    for (let i = 0; i < this.switches.length; i++) {
      if (this.switches[i].state != this.switches[i].preferredState) {
        return true;
      }
    }

    return false;
  }

  get internalSystem(): SwitchSystem {
    return this.internalShipStatus.systems[InternalSystemType.Switch] as SwitchSystem;
  }

  private readonly internalSwitches = [
    new Switch(this, 0),
    new Switch(this, 1),
    new Switch(this, 2),
    new Switch(this, 3),
    new Switch(this, 4),
  ];

  constructor(game: Game) {
    super(game, SystemType.Electrical);
  }

  //TODO: Understand Airship's Electrical Doors, and add a serializer/deserializer

  sabotage(): void {
    if (this.game.room.internalRoom.host instanceof CustomHost) {
      this.internalBackupShipStatus();

      if (!this.game.room.internalRoom.host.sabotageHandler) {
        throw new Error("Host has no SabotageHandler instance");
      }

      this.game.room.internalRoom.host.sabotageHandler.sabotageElectrical(this.internalSystem);

      this.internalUpdateShipStatus();
    } else if (this.game.room.internalRoom.host instanceof Connection) {
      this.internalShipStatus.repairSystem(
        SystemType.Sabotage,
        this.game.room.players[0].internalPlayer.gameObject.playerControl.id,
        new SabotageAmount(SystemType.Electrical),
      );
    } else {
      //TODO: Throw error about unknown host?
    }
  }

  repair(): void {
    if (this.game.room.internalRoom.host instanceof CustomHost) {
      this.internalBackupShipStatus();

      if (!this.game.room.internalRoom.host.systemsHandler) {
        throw new Error("Host has no SystemsHandler instance");
      }

      for (let i = 0; i < this.internalSystem.actualSwitches.length; i++) {
        const actualSwitch = this.internalSystem.actualSwitches[i];
        const expectedSwitch = this.internalSystem.actualSwitches[i];

        if (actualSwitch != expectedSwitch) {
          this.game.room.internalRoom.host.systemsHandler.repairSwitch(
            undefined as unknown as Player,
            this.internalSystem,
            new ElectricalAmount(i),
          );
        }
      }

      this.internalUpdateShipStatus();
    } else if (this.game.room.internalRoom.host instanceof Connection) {
      for (let i = 0; i < this.internalSystem.actualSwitches.length; i++) {
        const actualSwitch = this.internalSystem.actualSwitches[i];
        const expectedSwitch = this.internalSystem.actualSwitches[i];

        if (actualSwitch != expectedSwitch) {
          this.internalShipStatus.repairSystem(
            SystemType.Electrical,
            this.game.room.players[0].internalPlayer.gameObject.playerControl.id,
            new ElectricalAmount(i),
          );
        }
      }
    } else {
      //TODO: Throw error about unknown host?
    }
  }
}
