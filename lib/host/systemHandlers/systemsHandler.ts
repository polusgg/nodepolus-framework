import { BaseInnerShipStatus } from "../../protocol/entities/shipStatus/baseShipStatus";
import { DecontaminationDoorState, SystemType } from "../../types/enums";
import { GameDataPacket } from "../../protocol/packets/root";
import { notUndefined } from "../../util/functions";
import { InternalPlayer } from "../../player";
import { InternalHost } from "..";
import {
  MedbayAction,
  MiraCommunicationsAction,
  OxygenAction,
  ReactorAction,
} from "../../protocol/packets/rpc/repairSystem/actions";
import {
  DecontaminationAmount,
  ElectricalAmount,
  MedbayAmount,
  MiraCommunicationsAmount,
  NormalCommunicationsAmount,
  OxygenAmount,
  PolusDoorsAmount,
  ReactorAmount,
  SabotageAmount,
  SecurityAmount,
} from "../../protocol/packets/rpc/repairSystem/amounts";
import {
  DeconSystem,
  DeconTwoSystem,
  DoorsSystem,
  HqHudSystem,
  HudOverrideSystem,
  LaboratorySystem,
  LifeSuppSystem,
  MedScanSystem,
  ReactorSystem,
  SabotageSystem,
  SecurityCameraSystem,
  SwitchSystem,
} from "../../protocol/entities/shipStatus/systems";
import {
  GameScannerQueuedEvent,
  GameScannerStartedEvent,
  GameScannerDequeuedEvent,
  GameScannerStoppedEvent,
  GameCamerasOpenedEvent,
  GameCamerasClosedEvent,
} from "../../api/events/game";

export class SystemsHandler {
  protected oldShipStatus: BaseInnerShipStatus = this.host.getLobby().getShipStatus()!.getShipStatus();
  protected sabotageCountdownInterval?: NodeJS.Timeout;

  constructor(
    protected readonly host: InternalHost,
  ) {}

  repairDecon<T extends DeconSystem | DeconTwoSystem>(_repairer: InternalPlayer, system: T, amount: DecontaminationAmount): void {
    let state = 0;

    if (amount.isEntering()) {
      state |= DecontaminationDoorState.Enter;
    } else {
      state |= DecontaminationDoorState.Exit;
    }

    if (amount.isHeadingUp()) {
      state |= DecontaminationDoorState.HeadingUp;
    }

    this.host.getDecontaminationHandlers()[system instanceof DeconSystem ? 0 : 1].start(state);
  }

  repairPolusDoors<T extends DoorsSystem>(_repairer: InternalPlayer, system: T, amount: PolusDoorsAmount): void {
    this.setOldShipStatus();

    system.doorStates[amount.getDoorId()] = true;

    this.sendDataUpdate();
  }

  repairHqHud<T extends HqHudSystem>(repairer: InternalPlayer, system: T, amount: MiraCommunicationsAmount): void {
    this.setOldShipStatus();

    switch (amount.getAction()) {
      case MiraCommunicationsAction.OpenedConsole:
        system.activeConsoles.set(repairer.getId(), amount.getConsoleId());
        break;
      case MiraCommunicationsAction.ClosedConsole:
        system.activeConsoles.delete(repairer.getId());
        break;
      case MiraCommunicationsAction.EnteredCode:
        system.completedConsoles.add(amount.getConsoleId());
        break;
    }

    this.sendDataUpdate();
  }

  repairHudOverride<T extends HudOverrideSystem>(_repairer: InternalPlayer, system: T, amount: NormalCommunicationsAmount): void {
    this.setOldShipStatus();

    system.sabotaged = !amount.isRepaired();

    this.sendDataUpdate();
  }

  repairOxygen<T extends LifeSuppSystem>(_repairer: InternalPlayer, system: T, amount: OxygenAmount): void {
    this.setOldShipStatus();

    const sabotageHandler = this.host.getSabotageHandler();

    if (!sabotageHandler) {
      throw new Error("Attempted to repair oxygen without a SabotageHandler instance");
    }

    switch (amount.getAction()) {
      case OxygenAction.Completed:
        system.completedConsoles.add(amount.getConsoleId());

        if (system.completedConsoles.size == 2) {
          system.timer = 10000;

          if (sabotageHandler.timer) {
            clearInterval(sabotageHandler.timer);
          }
        }
        break;
      case OxygenAction.Repaired:
        system.timer = 10000;

        if (sabotageHandler.timer) {
          clearInterval(sabotageHandler.timer);
        }
        break;
    }

    this.sendDataUpdate();
  }

  async repairMedbay<T extends MedScanSystem>(_repairer: InternalPlayer, system: T, amount: MedbayAmount): Promise<void> {
    this.setOldShipStatus();

    const game = this.host.getLobby().getGame()!;
    const player = this.host.getLobby().findPlayerByPlayerId(amount.getPlayerId())!;

    if (amount.getAction() == MedbayAction.EnteredQueue) {
      if (system.playersInQueue.size > 0) {
        await this.host.getLobby().getServer().emit("game.scanner.queued", new GameScannerQueuedEvent(
          game,
          player,
          new Set([...system.playersInQueue]
            .map(id => this.host.getLobby().findPlayerByPlayerId(id))
            .filter(notUndefined),
          ),
        ));
      } else {
        await this.host.getLobby().getServer().emit("game.scanner.started", new GameScannerStartedEvent(game, player));
      }

      system.playersInQueue.add(player.getId());
    } else {
      system.playersInQueue.delete(amount.getPlayerId());

      if (system.playersInQueue.size > 0) {
        await this.host.getLobby().getServer().emit("game.scanner.dequeued", new GameScannerDequeuedEvent(
          game,
          player,
          new Set([...system.playersInQueue]
            .map(id => this.host.getLobby().findPlayerByPlayerId(id))
            .filter(notUndefined),
          ),
        ));
      } else {
        await this.host.getLobby().getServer().emit("game.scanner.stopped", new GameScannerStoppedEvent(game, player));
      }
    }

    this.sendDataUpdate();
  }

  repairReactor<T extends ReactorSystem | LaboratorySystem>(repairer: InternalPlayer, system: T, amount: ReactorAmount): void {
    this.setOldShipStatus();

    const sabotageHandler = this.host.getSabotageHandler();

    if (!sabotageHandler) {
      throw new Error("Attempted to repair reactor without a SabotageHandler instance");
    }

    switch (amount.getAction()) {
      case ReactorAction.PlacedHand:
        system.userConsoles.set(repairer.getId(), amount.getConsoleId());

        if (system.userConsoles.size == 2) {
          system.timer = 10000;

          if (sabotageHandler.timer) {
            clearInterval(sabotageHandler.timer);
          }
        }
        break;
      case ReactorAction.RemovedHand:
        system.userConsoles.delete(repairer.getId());
        break;
      case ReactorAction.Repaired:
        system.timer = 10000;

        if (sabotageHandler.timer) {
          clearInterval(sabotageHandler.timer);
        }
        break;
    }

    this.sendDataUpdate();
  }

  repairSabotage<T extends SabotageSystem>(_repairer: InternalPlayer, _system: T, amount: SabotageAmount): void {
    this.setOldShipStatus();

    const ship = this.getShipStatus();
    const type = amount.getSystemType();
    const sabotageHandler = this.host.getSabotageHandler();

    if (!sabotageHandler) {
      throw new Error("Attempted to sabotage without a SabotageHandler instance");
    }

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
        sabotageHandler.sabotageReactor(ship.getSystemFromType(type) as ReactorSystem | LaboratorySystem);
        break;
      case SystemType.Oxygen:
        sabotageHandler.sabotageOxygen(ship.getSystemFromType(type) as LifeSuppSystem);
        break;
      case SystemType.Communications:
        sabotageHandler.sabotageCommunications(ship.getSystemFromType(type) as HudOverrideSystem | HqHudSystem);
        break;
      case SystemType.Electrical:
        sabotageHandler.sabotageElectrical(ship.getSystemFromType(type) as SwitchSystem);
        break;
      default:
        throw new Error(`Attempted to sabotage an unsupported SystemType: ${type} (${SystemType[type]})`);
    }

    this.sendDataUpdate();
  }

  async repairSecurity<T extends SecurityCameraSystem>(repairer: InternalPlayer, system: T, amount: SecurityAmount): Promise<void> {
    this.setOldShipStatus();

    if (amount.isViewingCameras()) {
      await this.host.getLobby().getServer().emit("game.cameras.opened", new GameCamerasOpenedEvent(this.host.getLobby().getGame()!, repairer));

      system.playersViewingCameras.add(repairer.getId());
    } else {
      await this.host.getLobby().getServer().emit("game.cameras.closed", new GameCamerasClosedEvent(this.host.getLobby().getGame()!, repairer));

      system.playersViewingCameras.delete(repairer.getId());
    }

    this.sendDataUpdate();
  }

  repairSwitch<T extends SwitchSystem>(_repairer: InternalPlayer, system: T, amount: ElectricalAmount): void {
    this.setOldShipStatus();

    system.actualSwitches.toggle(amount.getSwitchIndex());

    if (system.actualSwitches.equals(system.expectedSwitches)) {
      // TODO: Count back up (like +85 every second)
      setTimeout(() => {
        // Don't fix the lights if they somehow get immediately sabotaged again
        if (system.actualSwitches.equals(system.expectedSwitches)) {
          this.setOldShipStatus();

          system.visionModifier = 0xff;

          this.sendDataUpdate();
        }
      }, 3000);
    }

    this.sendDataUpdate();
  }

  setOldShipStatus(): void {
    this.oldShipStatus = this.getShipStatus().clone();
  }

  sendDataUpdate(): void {
    this.host.getLobby().sendRootGamePacket(new GameDataPacket([
      this.getShipStatus().serializeData(this.oldShipStatus),
    ], this.host.getLobby().getCode()));
  }

  protected getShipStatus(): BaseInnerShipStatus {
    return this.host.getLobby().getShipStatus()!.getShipStatus();
  }
}
