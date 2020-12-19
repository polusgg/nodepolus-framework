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
import { InnerLevel } from "../../protocol/entities/types";
import { SystemType } from "../../types/systemType";
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
  private oldShipStatus: InnerLevel = this.host.lobby.shipStatus!.innerNetObjects[0];
  private sabotageCountdownInterval: NodeJS.Timeout | undefined;

  private get shipStatus(): InnerLevel {
    return this.host.lobby.shipStatus!.innerNetObjects[0];
  }

  constructor(
    public readonly host: CustomHost,
  ) {}

  repairDecon<T extends DeconSystem | DeconTwoSystem>(_repairer: Player, system: T, amount: DecontaminationAmount): void {
    let state = 0;

    if (amount.isEntering) {
      state |= DecontaminationDoorState.Enter;
    } else {
      state |= DecontaminationDoorState.Exit;
    }

    if (amount.isHeadingUp) {
      state |= DecontaminationDoorState.HeadingUp;
    }

    this.host.deconHandlers[system instanceof DeconSystem ? 0 : 1].start(state);
  }

  repairPolusDoors<T extends DoorsSystem>(_repairer: Player, system: T, amount: PolusDoorsAmount): void {
    this.setOldShipStatus();

    system.doorStates[amount.doorId] = true;

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

  repairHudOverride<T extends HudOverrideSystem>(_repairer: Player, system: T, amount: NormalCommunicationsAmount): void {
    this.setOldShipStatus();

    system.sabotaged = !amount.isRepaired;

    this.sendDataUpdate();
  }

  repairOxygen<T extends LifeSuppSystem>(_repairer: Player, system: T, amount: OxygenAmount): void {
    this.setOldShipStatus();

    switch (amount.action) {
      case OxygenAction.Completed:
        system.completedConsoles.add(amount.consoleId);

        if (system.completedConsoles.size == 2) {
          system.timer = 10000;

          if (this.host.sabotageHandler!.timer) {
            clearInterval(this.host.sabotageHandler!.timer);
          }
        }
        break;
      case OxygenAction.Repaired:
        system.timer = 10000;

        if (this.host.sabotageHandler!.timer) {
          clearInterval(this.host.sabotageHandler!.timer);
        }
        break;
    }

    this.sendDataUpdate();
  }

  repairMedbay<T extends MedScanSystem>(_repairer: Player, system: T, amount: MedbayAmount): void {
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

        if (system.userConsoles.size == 2) {
          system.timer = 10000;

          if (this.host.sabotageHandler!.timer) {
            clearInterval(this.host.sabotageHandler!.timer);
          }
        }
        break;
      case ReactorAction.RemovedHand:
        system.userConsoles.delete(repairer.id);
        break;
      case ReactorAction.Repaired:
        system.timer = 10000;

        if (this.host.sabotageHandler!.timer) {
          clearInterval(this.host.sabotageHandler!.timer);
        }
        break;
    }

    this.sendDataUpdate();
  }

  repairSabotage<T extends SabotageSystem>(_repairer: Player, _system: T, amount: SabotageAmount): void {
    this.setOldShipStatus();

    const ship = this.shipStatus;
    const type = amount.system;

    (ship.getSystemFromType(SystemType.Sabotage) as SabotageSystem).cooldown = 30;

    this.sabotageCountdownInterval = setInterval(() => {
      (ship.getSystemFromType(SystemType.Sabotage) as SabotageSystem).cooldown--;

      if (
        (ship.getSystemFromType(SystemType.Sabotage) as SabotageSystem).cooldown == 0 &&
        this.sabotageCountdownInterval
      ) {
        clearInterval(this.sabotageCountdownInterval);
      }
    }, 1000);

    switch (type) {
      case SystemType.Reactor:
      case SystemType.Laboratory:
        this.host.sabotageHandler!.sabotageReactor(ship.getSystemFromType(type) as ReactorSystem | LaboratorySystem);
        break;
      case SystemType.Oxygen:
        this.host.sabotageHandler!.sabotageOxygen(ship.getSystemFromType(type) as LifeSuppSystem);
        break;
      case SystemType.Communications:
        this.host.sabotageHandler!.sabotageCommunications(ship.getSystemFromType(type) as HudOverrideSystem | HqHudSystem);
        break;
      case SystemType.Electrical:
        this.host.sabotageHandler!.sabotageElectrical(ship.getSystemFromType(type) as SwitchSystem);
        break;
      default:
        throw new Error(`Attempted to sabotage an unsupported SystemType: ${type} (${SystemType[type]})`);
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

  repairSwitch<T extends SwitchSystem>(_repairer: Player, system: T, amount: ElectricalAmount): void {
    this.setOldShipStatus();

    const index = 4 - amount.switchIndex;

    system.actualSwitches[index] = !system.actualSwitches[index];

    if (system.actualSwitches.every((s, i) => s == system.expectedSwitches[i])) {
      // TODO: Count back up (like +85 every second)
      setTimeout(() => {
        // Don't fix the lights if they somehow get immediately sabotaged again
        if (system.actualSwitches.every((s, i) => s == system.expectedSwitches[i])) {
          this.setOldShipStatus();

          system.visionModifier = 0xff;

          this.sendDataUpdate();
        }
      }, 3000);
    }

    this.sendDataUpdate();
  }

  setOldShipStatus(): void {
    this.oldShipStatus = this.shipStatus.clone();
  }

  sendDataUpdate(): void {
    this.host.lobby.sendRootGamePacket(new GameDataPacket([
      //@ts-ignore Talk to Cody about this?
      this.shipStatus.data(this.oldShipStatus),
    ], this.host.lobby.code));
  }
}
