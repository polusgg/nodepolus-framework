import { DeconSystem, DecontaminationDoorState } from "../../protocol/entities/baseShipStatus/systems/deconSystem";
import { SecurityCameraSystem } from "../../protocol/entities/baseShipStatus/systems/securityCameraSystem";
import { HudOverrideSystem } from "../../protocol/entities/baseShipStatus/systems/hudOverrideSystem";
import { LaboratorySystem } from "../../protocol/entities/baseShipStatus/systems/laboratorySystem";
import { DeconTwoSystem } from "../../protocol/entities/baseShipStatus/systems/deconTwoSystem";
import { LifeSuppSystem } from "../../protocol/entities/baseShipStatus/systems/lifeSuppSystem";
import { SabotageSystem } from "../../protocol/entities/baseShipStatus/systems/sabotageSystem";
import { MedScanSystem } from "../../protocol/entities/baseShipStatus/systems/medScanSystem";
import { ReactorSystem } from "../../protocol/entities/baseShipStatus/systems/reactorSystem";
import { SwitchSystem } from "../../protocol/entities/baseShipStatus/systems/switchSystem";
import { DoorsSystem } from "../../protocol/entities/baseShipStatus/systems/doorsSystem";
import { HqHudSystem } from "../../protocol/entities/baseShipStatus/systems/hqHudSystem";
import { GameDataPacket } from "../../protocol/packets/rootGamePackets/gameData";
import { EntityLevel } from "../../protocol/entities/types";
import { SystemType } from "../../types/systemType";
import cloneDeep from "lodash/clonedeep";
import { Player } from "../../player";
import { CustomHost } from "..";
import {
  NormalCommunicationsAmount,
  MiraCommunicationsAmount,
  DecontaminationAmount,
  ElectricalAmount,
  PolusDoorsAmount,
  SabotageAmount,
  SecurityAmount,
  ReactorAmount,
  MedbayAmount,
  OxygenAmount,
  MedbayAction,
  OxygenAction,
  MiraCommunicationsAction,
  ReactorAction,
} from "../../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";

export class SystemsHandler {
  private oldShipStatus: EntityLevel = this.host.room.shipStatus!;

  private get shipStatus(): EntityLevel {
    return this.host.room.shipStatus!;
  }

  constructor(
    public readonly host: CustomHost,
  ) {}

  repairDecon<T extends DeconSystem | DeconTwoSystem>(repairer: Player, system: T, amount: DecontaminationAmount): void {
    let state = 0;

    if (amount.isEntering) {
      state |= DecontaminationDoorState.Enter;
    } else {
      state |= DecontaminationDoorState.Exit;
    }

    if (amount.isHeadingUp) {
      state |= DecontaminationDoorState.HeadingUp;
    }

    system.state = state;
  }

  repairDoors<T extends DoorsSystem>(repairer: Player, system: T, amount: PolusDoorsAmount): void {
    this.setOldShipStatus();

    // TODO: Door timers

    this.sendDataUpdate();
  }

  repairHqHud<T extends HqHudSystem>(repairer: Player, system: T, amount: MiraCommunicationsAmount): void {
    this.setOldShipStatus();

    switch (amount.action) {
      case MiraCommunicationsAction.OpenedConsole:
        system.activeConsoles.set(repairer.id, amount.consoleId);
        break;
      case MiraCommunicationsAction.ClosedConsole:
        system.activeConsoles.delete(repairer.id);
        break;
      case MiraCommunicationsAction.EnteredCode:
        system.completedConsoles.add(amount.consoleId);
        break;
    }

    this.sendDataUpdate();
  }

  repairHudOverride<T extends HudOverrideSystem>(repairer: Player, system: T, amount: NormalCommunicationsAmount): void {
    this.setOldShipStatus();

    system.sabotaged = !amount.isRepaired;

    this.sendDataUpdate();
  }

  repairOxygen<T extends LifeSuppSystem>(repairer: Player, system: T, amount: OxygenAmount): void {
    this.setOldShipStatus();

    switch (amount.action) {
      case OxygenAction.Completed:
        system.completedConsoles.add(repairer.id);
        break;
      case OxygenAction.Repaired:
        system.completedConsoles.clear();

        system.timer = 10000;
        break;
    }

    this.sendDataUpdate();
  }

  repairMedbay<T extends MedScanSystem>(repairer: Player, system: T, amount: MedbayAmount): void {
    this.setOldShipStatus();

    if (amount.action == MedbayAction.EnteredQueue) {
      system.playersInQueue.add(amount.playerId);
    } else {
      system.playersInQueue.delete(amount.playerId);
    }

    this.sendDataUpdate();
  }

  repairReactor<T extends ReactorSystem | LaboratorySystem>(repairer: Player, system: T, amount: ReactorAmount): void {
    this.setOldShipStatus();

    switch (amount.action) {
      case ReactorAction.PlacedHand:
        system.userConsoles.set(repairer.id, amount.consoleId);
        break;
      case ReactorAction.RemovedHand:
        system.userConsoles.delete(repairer.id);
        break;
      case ReactorAction.Repaired:
        system.userConsoles.clear();

        system.timer = 10000;
        break;
    }

    this.sendDataUpdate();
  }

  repairSabotage<T extends SabotageSystem>(repairer: Player, system: T, amount: SabotageAmount): void {
    this.setOldShipStatus();

    const ship = this.shipStatus.innerNetObjects[0];
    const type = amount.system;

    switch (type) {
      case SystemType.Reactor:
      case SystemType.Laboratory:
        this.host.sabotageHandler.sabotageReactor(ship.getSystemFromType(type) as ReactorSystem | LaboratorySystem);
        break;
      case SystemType.Oxygen:
        this.host.sabotageHandler.sabotageOxygen(ship.getSystemFromType(type) as LifeSuppSystem);
        break;
      case SystemType.Communications:
        this.host.sabotageHandler.sabotageCommunications(ship.getSystemFromType(type) as HudOverrideSystem | HqHudSystem);
        break;
      case SystemType.Electrical:
        this.host.sabotageHandler.sabotageElectrical(ship.getSystemFromType(type) as SwitchSystem);
        break;
      default:
        throw new Error(`Received RepairSystem of type Sabotage for an unimplemented SystemType: ${type} (${SystemType[type]})`);
    }

    this.sendDataUpdate();
  }

  repairSecurity<T extends SecurityCameraSystem>(repairer: Player, system: T, amount: SecurityAmount): void {
    this.setOldShipStatus();

    if (amount.isViewingCameras) {
      system.playersViewingCams.add(repairer.id);
    } else {
      system.playersViewingCams.delete(repairer.id);
    }

    this.sendDataUpdate();
  }

  repairSwitch<T extends SwitchSystem>(repairer: Player, system: T, amount: ElectricalAmount): void {
    this.setOldShipStatus();

    system.actualSwitches[amount.switchIndex] = !system.actualSwitches[amount.switchIndex];

    this.sendDataUpdate();
  }

  setOldShipStatus(): void {
    this.oldShipStatus = cloneDeep(this.shipStatus);
  }

  sendDataUpdate(): void {
    this.host.room.sendRootGamePacket(new GameDataPacket([
      this.shipStatus.innerNetObjects[0].data(this.oldShipStatus.innerNetObjects[0]),
    ], this.host.room.code));
  }
}
