import { BaseInnerShipStatus } from "../../protocol/entities/shipStatus/baseShipStatus";
import { DecontaminationDoorState, Level, SystemType } from "../../types/enums";
import { GameDataPacket } from "../../protocol/packets/root";
import { clamp, notUndefined } from "../../util/functions";
import { Player } from "../../player";
import { Host } from "..";
import {
  HeliSabotageAction,
  MedbayAction,
  MiraCommunicationsAction,
  OxygenAction,
  ReactorAction,
} from "../../protocol/packets/rpc/repairSystem/actions";
import {
  DecontaminationAmount,
  ElectricalAmount,
  HeliSabotageAmount,
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
  HeliSabotageSystem,
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
import {
  RoomCommunicationsConsoleClosedEvent,
  RoomCommunicationsConsoleOpenedEvent,
  RoomCommunicationsConsoleRepairedEvent,
  RoomHeliConsoleClosedEvent,
  RoomHeliConsoleOpenedEvent,
  RoomHeliConsoleRepairedEvent,
  RoomOxygenConsoleRepairedEvent,
  RoomReactorConsoleClearedEvent,
  RoomReactorConsoleRepairedEvent,
  RoomRepairedEvent,
  RoomSabotagedEvent,
} from "../../api/events/room";

export class SystemsHandler {
  protected oldShipStatus: BaseInnerShipStatus = this.host.getLobby().getSafeShipStatus().getShipStatus();
  protected sabotageCountdownInterval?: NodeJS.Timeout;

  constructor(
    protected readonly host: Host,
  ) {}

  repairHeliSystem<T extends HeliSabotageSystem>(repairer: Player, system: T, amount: HeliSabotageAmount): void {
    const sabotageHandler = this.host.getSabotageHandler();

    if (sabotageHandler === undefined) {
      throw new Error("Attempted to repair reactor without a SabotageHandler instance");
    }

    this.setOldShipStatus();

    switch (amount.getAction()) {
      case HeliSabotageAction.OpenedConsole: {
        const event = new RoomHeliConsoleOpenedEvent(this.host.getLobby().getSafeGame(), repairer, amount.getConsoleId());

        this.host.getLobby().getServer().emit("room.heli.console.opened", event);
        system.setActiveConsole(repairer.getId(), amount.getConsoleId());
        break;
      }
      case HeliSabotageAction.ClosedConsole: {
        const event = new RoomHeliConsoleClosedEvent(this.host.getLobby().getSafeGame(), repairer, amount.getConsoleId());

        this.host.getLobby().getServer().emit("room.heli.console.closed", event);
        system.removeActiveConsole(repairer.getId());
        break;
      }
      case HeliSabotageAction.EnteredCode: {
        system.setTimer(10);
        system.addCompletedConsole(amount.getConsoleId());

        if (system.getCompletedConsoles().size == 2) {
          const event = new RoomHeliConsoleRepairedEvent(this.host.getLobby().getSafeGame(), repairer, amount.getConsoleId());

          this.host.getLobby().getServer().emit("room.heli.console.repaired", event);

          if (event.isCancelled()) {
            return;
          }
          system.setCountdown(10000);
          sabotageHandler.clearTimer();
        }
        break;
      }
    }

    this.sendDataUpdate();
  }

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
    const sabotageHandler = this.host.getSabotageHandler();

    if (sabotageHandler === undefined) {
      throw new Error("Attempted to repair reactor without a SabotageHandler instance");
    }

    this.setOldShipStatus();

    switch (amount.getAction()) {
      case MiraCommunicationsAction.OpenedConsole: {
        const event = new RoomCommunicationsConsoleOpenedEvent(this.host.getLobby().getSafeGame(), repairer, amount.getConsoleId());

        this.host.getLobby().getServer().emit("room.communications.console.opened", event);
        system.setActiveConsole(repairer.getId(), amount.getConsoleId());
        break;
      }
      case MiraCommunicationsAction.ClosedConsole: {
        const event = new RoomCommunicationsConsoleClosedEvent(this.host.getLobby().getSafeGame(), repairer, amount.getConsoleId());

        this.host.getLobby().getServer().emit("room.communications.console.closed", event);
        system.removeActiveConsole(repairer.getId());
        break;
      }
      case MiraCommunicationsAction.EnteredCode: {
        const event = new RoomCommunicationsConsoleRepairedEvent(this.host.getLobby().getSafeGame(), repairer, amount.getConsoleId());

        this.host.getLobby().getServer().emit("room.communications.console.repaired", event);

        if (event.isCancelled()) {
          return;
        }
        system.addCompletedConsole(amount.getConsoleId());

        if (system.getCompletedConsoles().size == 2) {
          const eventTwo = new RoomRepairedEvent(this.host.getLobby().getSafeGame(), system, repairer);

          this.host.getLobby().getServer().emit("room.repaired", eventTwo);

          if (eventTwo.isCancelled()) {
            return;
          }
          sabotageHandler.clearTimer();
        }
        break;
      }
    }

    this.sendDataUpdate();
  }

  repairHudOverride<T extends HudOverrideSystem>(_repairer: Player, system: T, amount: NormalCommunicationsAmount): void {
    this.setOldShipStatus();

    if (amount.isRepaired()) {
      const event = new RoomCommunicationsConsoleRepairedEvent(this.host.getLobby().getSafeGame(), _repairer);
      const eventTwo = new RoomRepairedEvent(this.host.getLobby().getSafeGame(), system, _repairer);

      this.host.getLobby().getServer().emit("room.communications.console.repaired", event);
      this.host.getLobby().getServer().emit("room.repaired", eventTwo);

      if (event.isCancelled() || eventTwo.isCancelled()) {
        return;
      }
      system.setSabotaged(false);
    } else {
      const event = new RoomSabotagedEvent(this.host.getLobby().getSafeGame(), system, _repairer);

      this.host.getLobby().getServer().emit("room.sabotaged", event);

      if (event.isCancelled()) {
        return;
      }
      system.setSabotaged(true);
    }
    this.sendDataUpdate();
  }

  repairOxygen<T extends LifeSuppSystem>(_repairer: Player, system: T, amount: OxygenAmount): void {
    const sabotageHandler = this.host.getSabotageHandler();

    if (sabotageHandler === undefined) {
      throw new Error("Attempted to repair oxygen without a SabotageHandler instance");
    }

    this.setOldShipStatus();

    switch (amount.getAction()) {
      case OxygenAction.Completed: {
        const event = new RoomOxygenConsoleRepairedEvent(this.host.getLobby().getSafeGame(), amount.getConsoleId());

        this.host.getLobby().getServer().emit("room.oxygen.console.repaired", event);

        if (event.isCancelled()) {
          return;
        }
        system.addCompletedConsole(amount.getConsoleId());

        if (system.getCompletedConsoles().size == 2) {
          const eventTwo = new RoomRepairedEvent(this.host.getLobby().getSafeGame(), system);

          this.host.getLobby().getServer().emit("room.repaired", eventTwo);

          if (event.isCancelled()) {
            return;
          }
          system.setTimer(10000);
          sabotageHandler.clearTimer();
        }
        break;
      }
      case OxygenAction.Repaired: {
        const event = new RoomRepairedEvent(this.host.getLobby().getSafeGame(), system);

        this.host.getLobby().getServer().emit("room.repaired", event);

        if (event.isCancelled()) {
          return;
        }
        system.setTimer(10000);
        sabotageHandler.clearTimer();
        break;
      }
    }

    this.sendDataUpdate();
  }

  async repairMedbay<T extends MedScanSystem>(_repairer: Player, system: T, amount: MedbayAmount): Promise<void> {
    this.setOldShipStatus();

    const game = this.host.getLobby().getSafeGame();
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
    const sabotageHandler = this.host.getSabotageHandler();

    if (sabotageHandler === undefined) {
      throw new Error("Attempted to repair reactor without a SabotageHandler instance");
    }

    this.setOldShipStatus();

    switch (amount.getAction()) {
      case ReactorAction.PlacedHand: {
        const event = new RoomReactorConsoleRepairedEvent(this.host.getLobby().getSafeGame(), amount.getConsoleId());

        this.host.getLobby().getServer().emit("room.reactor.console.repaired", event);

        if (event.isCancelled()) {
          return;
        }
        system.setUserConsole(repairer.getId(), amount.getConsoleId());

        if (new Set(system.getUserConsoles().values()).size == 2) {
          const eventTwo = new RoomRepairedEvent(this.host.getLobby().getSafeGame(), system, repairer);

          this.host.getLobby().getServer().emit("room.repaired", eventTwo);

          if (eventTwo.isCancelled()) {
            return;
          }
          system.setCountdown(10000);
          sabotageHandler.clearTimer();
        }
        break;
      }
      case ReactorAction.RemovedHand: {
        const event = new RoomReactorConsoleClearedEvent(this.host.getLobby().getSafeGame(), amount.getConsoleId(), repairer);

        this.host.getLobby().getServer().emit("room.reactor.console.cleared", event);

        if (event.isCancelled()) {
          return;
        }
        system.removeUserConsole(repairer.getId());
        break;
      }
      case ReactorAction.Repaired: {
        const event = new RoomRepairedEvent(this.host.getLobby().getSafeGame(), system, repairer);

        this.host.getLobby().getServer().emit("room.repaired", event);

        if (event.isCancelled()) {
          return;
        }
        system.setCountdown(10000);
        sabotageHandler.clearTimer();
        break;
      }
    }

    this.sendDataUpdate();
  }

  isSabotaged(checkNonCritical: boolean = false): boolean {
    const level = this.host.getLobby().getLevel();
    const ship = this.getShipStatus();

    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
      case Level.MiraHq:
        if ((ship.getSystemFromType(SystemType.Reactor) as ReactorSystem).isSabotaged() ||
            (ship.getSystemFromType(SystemType.Oxygen) as LifeSuppSystem).isSabotaged()
        ) {
          return true;
        }

        if (checkNonCritical) {
          if ((ship.getSystemFromType(SystemType.Electrical) as SwitchSystem).isSabotaged()) {
            return true;
          }

          if (level === Level.MiraHq) {
            if ((ship.getSystemFromType(SystemType.Communications) as HqHudSystem).isSabotaged()) {
              return true;
            }
          } else if ((ship.getSystemFromType(SystemType.Communications) as HudOverrideSystem).isSabotaged()) {
            return true;
          }
        }

        return false;
      case Level.Polus:
        if ((ship.getSystemFromType(SystemType.Laboratory) as LaboratorySystem).isSabotaged()) {
          return true;
        }

        if (checkNonCritical) {
          if ((ship.getSystemFromType(SystemType.Electrical) as SwitchSystem).isSabotaged() ||
              (ship.getSystemFromType(SystemType.Communications) as HudOverrideSystem).isSabotaged()
          ) {
            return true;
          }
        }

        return false;
      case Level.Airship:
        if ((ship.getSystemFromType(SystemType.Reactor) as HeliSabotageSystem).isSabotaged()) {
          return true;
        }

        if (checkNonCritical) {
          if ((ship.getSystemFromType(SystemType.Electrical) as SwitchSystem).isSabotaged() ||
              (ship.getSystemFromType(SystemType.Communications) as HudOverrideSystem).isSabotaged()
          ) {
            return true;
          }
        }

        return false;
    }
  }

  repairAll(repairNonCritical: boolean = false): void {
    const sabotageHandler = this.host.getSabotageHandler();

    if (sabotageHandler === undefined) {
      throw new Error("Attempted to repair reactor without a SabotageHandler instance");
    }

    const level = this.host.getLobby().getLevel();
    const ship = this.getShipStatus();

    this.setOldShipStatus();
    sabotageHandler.clearTimer();

    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
      case Level.MiraHq:
        (ship.getSystemFromType(SystemType.Reactor) as ReactorSystem).repair();
        (ship.getSystemFromType(SystemType.Oxygen) as LifeSuppSystem).repair();

        if (repairNonCritical) {
          (ship.getSystemFromType(SystemType.Electrical) as SwitchSystem).repair();

          if (level === Level.MiraHq) {
            (ship.getSystemFromType(SystemType.Communications) as HqHudSystem).repair();
          } else {
            (ship.getSystemFromType(SystemType.Communications) as HudOverrideSystem).repair();
          }
        }
        break;
      case Level.Polus:
        (ship.getSystemFromType(SystemType.Laboratory) as LaboratorySystem).repair();

        if (repairNonCritical) {
          (ship.getSystemFromType(SystemType.Electrical) as SwitchSystem).repair();
          (ship.getSystemFromType(SystemType.Communications) as HudOverrideSystem).repair();
        }
        break;
      case Level.Airship:
        (ship.getSystemFromType(SystemType.Reactor) as HeliSabotageSystem).repair();

        if (repairNonCritical) {
          (ship.getSystemFromType(SystemType.Electrical) as SwitchSystem).repair();
          (ship.getSystemFromType(SystemType.Communications) as HudOverrideSystem).repair();
        }
        break;
    }

    this.sendDataUpdate();
  }

  async repairSabotage<T extends SabotageSystem>(_repairer: Player, system: T, amount: SabotageAmount): Promise<void> {
    const sabotageHandler = this.host.getSabotageHandler();

    if (sabotageHandler === undefined) {
      throw new Error("Attempted to sabotage without a SabotageHandler instance");
    }

    this.setOldShipStatus();

    const ship = this.getShipStatus();
    const type = amount.getSystemType();
    const game = this.host.getLobby().getSafeGame();
    const event = new RoomSabotagedEvent(game, system, _repairer);

    await this.host.getLobby().getServer().emit("room.sabotaged", event);

    if (event.isCancelled()) {
      return;
    }
    system.setCooldown(30);

    this.sabotageCountdownInterval = setInterval(() => {
      system.decrementCooldown();

      if (system.getCooldown() == 0) {
        this.clearSabotageTimer();
      }
    }, 1000);

    switch (type) {
      case SystemType.Reactor:
      case SystemType.Laboratory:
        if (this.host.getLobby().getLevel() == Level.Airship) {
          sabotageHandler.sabotageHeliSystem(ship.getSystemFromType(type) as HeliSabotageSystem);
        } else {
          sabotageHandler.sabotageReactor(ship.getSystemFromType(type) as ReactorSystem | LaboratorySystem | HeliSabotageSystem);
        }
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
      await this.host.getLobby().getServer().emit("game.cameras.opened", new GameCamerasOpenedEvent(this.host.getLobby().getSafeGame(), repairer));

      system.addPlayerViewingCameras(repairer.getId());
    } else {
      await this.host.getLobby().getServer().emit("game.cameras.closed", new GameCamerasClosedEvent(this.host.getLobby().getSafeGame(), repairer));

      system.removePlayerViewingCameras(repairer.getId());
    }

    this.sendDataUpdate();
  }

  repairSwitch<T extends SwitchSystem>(_repairer: Player, system: T, amount: ElectricalAmount): void {
    this.setOldShipStatus();
    system.getActualSwitches().toggle(amount.getSwitchIndex());

    if (system.getActualSwitches().equals(system.getExpectedSwitches())) {
      const startOfRepair = Date.now();
      const repairCountdown = setInterval(() => {
        if (!system.getActualSwitches().equals(system.getExpectedSwitches()) || this.host.getLobby().getShipStatus() === undefined) {
          clearInterval(repairCountdown);

          return;
        }

        this.setOldShipStatus();
        system.setVisionModifier(clamp(Math.ceil(((Date.now() - startOfRepair) / 3000) * 0xff), 0x00, 0xff));
        this.sendDataUpdate();

        if (system.getVisionModifier() == 0xff) {
          clearInterval(repairCountdown);
        }
      }, 20);
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

  clearSabotageTimer(): void {
    if (this.sabotageCountdownInterval !== undefined) {
      clearInterval(this.sabotageCountdownInterval);
      delete this.sabotageCountdownInterval;
    }
  }

  protected getShipStatus(): BaseInnerShipStatus {
    return this.host.getLobby().getSafeShipStatus().getShipStatus();
  }
}
