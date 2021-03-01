import { BaseInnerShipStatus } from "../../protocol/entities/shipStatus/baseShipStatus";
import { DecontaminationDoorState, SystemType } from "../../types/enums";
import { GameDataPacket } from "../../protocol/packets/root";
import { notUndefined } from "../../util/functions";
import { Player } from "../../player";
import { Host } from "..";
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
    protected readonly host: Host,
  ) {}

  repairDecon<T extends DeconSystem | DeconTwoSystem>(_repairer: Player, system: T, amount: DecontaminationAmount): void {
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

  repairPolusDoors<T extends DoorsSystem>(_repairer: Player, system: T, amount: PolusDoorsAmount): void {
    this.setOldShipStatus();
    system.setDoorState(amount.getDoorId(), true);
    this.sendDataUpdate();
  }

  repairHqHud<T extends HqHudSystem>(repairer: Player, system: T, amount: MiraCommunicationsAmount): void {
    this.setOldShipStatus();

    switch (amount.getAction()) {
      case MiraCommunicationsAction.OpenedConsole:
        system.setActiveConsole(repairer.getId(), amount.getConsoleId());
        break;
      case MiraCommunicationsAction.ClosedConsole:
        system.removeActiveConsole(repairer.getId());
        break;
      case MiraCommunicationsAction.EnteredCode:
        system.addCompletedConsole(amount.getConsoleId());
        break;
    }

    this.sendDataUpdate();
  }

  repairHudOverride<T extends HudOverrideSystem>(_repairer: Player, system: T, amount: NormalCommunicationsAmount): void {
    this.setOldShipStatus();
    system.setSabotaged(!amount.isRepaired());
    this.sendDataUpdate();
  }

  repairOxygen<T extends LifeSuppSystem>(_repairer: Player, system: T, amount: OxygenAmount): void {
    this.setOldShipStatus();

    const sabotageHandler = this.host.getSabotageHandler();

    if (!sabotageHandler) {
      throw new Error("Attempted to repair oxygen without a SabotageHandler instance");
    }

    switch (amount.getAction()) {
      case OxygenAction.Completed:
        system.addCompletedConsole(amount.getConsoleId());

        if (system.getCompletedConsoles().size == 2) {
          system.setTimer(10000);

          if (sabotageHandler.timer) {
            clearInterval(sabotageHandler.timer);
          }
        }
        break;
      case OxygenAction.Repaired:
        system.setTimer(10000);

        if (sabotageHandler.timer) {
          clearInterval(sabotageHandler.timer);
        }
        break;
    }

    this.sendDataUpdate();
  }

  async repairMedbay<T extends MedScanSystem>(_repairer: Player, system: T, amount: MedbayAmount): Promise<void> {
    this.setOldShipStatus();

    const game = this.host.getLobby().getGame()!;
    const player = this.host.getLobby().findPlayerByPlayerId(amount.getPlayerId())!;

    if (amount.getAction() == MedbayAction.EnteredQueue) {
      if (system.getPlayersInQueue().size > 0) {
        await this.host.getLobby().getServer().emit("game.scanner.queued", new GameScannerQueuedEvent(
          game,
          player,
          new Set([...system.getPlayersInQueue()]
            .map(id => this.host.getLobby().findPlayerByPlayerId(id))
            .filter(notUndefined),
          ),
        ));
      } else {
        await this.host.getLobby().getServer().emit("game.scanner.started", new GameScannerStartedEvent(game, player));
      }

      system.addPlayerInQueue(player.getId());
    } else {
      system.removePlayerInQueue(amount.getPlayerId());

      if (system.getPlayersInQueue().size > 0) {
        await this.host.getLobby().getServer().emit("game.scanner.dequeued", new GameScannerDequeuedEvent(
          game,
          player,
          new Set([...system.getPlayersInQueue()]
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

  repairReactor<T extends ReactorSystem | LaboratorySystem>(repairer: Player, system: T, amount: ReactorAmount): void {
    this.setOldShipStatus();

    const sabotageHandler = this.host.getSabotageHandler();

    if (!sabotageHandler) {
      throw new Error("Attempted to repair reactor without a SabotageHandler instance");
    }

    switch (amount.getAction()) {
      case ReactorAction.PlacedHand:
        system.setUserConsole(repairer.getId(), amount.getConsoleId());

        if (system.getUserConsoles().size == 2) {
          system.setTimer(10000);

          if (sabotageHandler.timer) {
            clearInterval(sabotageHandler.timer);
          }
        }
        break;
      case ReactorAction.RemovedHand:
        system.removeUserConsole(repairer.getId());
        break;
      case ReactorAction.Repaired:
        system.setTimer(10000);

        if (sabotageHandler.timer) {
          clearInterval(sabotageHandler.timer);
        }
        break;
    }

    this.sendDataUpdate();
  }

  repairSabotage<T extends SabotageSystem>(_repairer: Player, system: T, amount: SabotageAmount): void {
    this.setOldShipStatus();

    const ship = this.getShipStatus();
    const type = amount.getSystemType();
    const sabotageHandler = this.host.getSabotageHandler();

    if (!sabotageHandler) {
      throw new Error("Attempted to sabotage without a SabotageHandler instance");
    }

    system.setCooldown(30);

    this.sabotageCountdownInterval = setInterval(() => {
      system.decrementCooldown();

      if (system.getCooldown() == 0 && this.sabotageCountdownInterval) {
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

  async repairSecurity<T extends SecurityCameraSystem>(repairer: Player, system: T, amount: SecurityAmount): Promise<void> {
    this.setOldShipStatus();

    if (amount.isViewingCameras()) {
      await this.host.getLobby().getServer().emit("game.cameras.opened", new GameCamerasOpenedEvent(this.host.getLobby().getGame()!, repairer));

      system.addPlayerViewingCameras(repairer.getId());
    } else {
      await this.host.getLobby().getServer().emit("game.cameras.closed", new GameCamerasClosedEvent(this.host.getLobby().getGame()!, repairer));

      system.removePlayerViewingCameras(repairer.getId());
    }

    this.sendDataUpdate();
  }

  repairSwitch<T extends SwitchSystem>(_repairer: Player, system: T, amount: ElectricalAmount): void {
    this.setOldShipStatus();
    system.getActualSwitches().toggle(amount.getSwitchIndex());

    if (system.getActualSwitches().equals(system.getExpectedSwitches())) {
      // TODO: Count back up (like +85 every second)
      setTimeout(() => {
        // Don't fix the lights if they somehow get immediately sabotaged again
        if (system.getActualSwitches().equals(system.getExpectedSwitches())) {
          this.setOldShipStatus();
          system.setVisionModifier(0xff);
          this.sendDataUpdate();
        }
      }, 3000);
    }

    this.sendDataUpdate();
  }

  setOldShipStatus(): this {
    this.oldShipStatus = this.getShipStatus().clone();

    return this;
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
