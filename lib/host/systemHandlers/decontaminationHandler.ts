import { DeconSystem, DeconTwoSystem } from "../../protocol/entities/shipStatus/systems";
import { DecontaminationDoorState } from "../../types/enums";
import { InternalHost } from "..";

export class DecontaminationHandler {
  protected timer?: NodeJS.Timeout;

  constructor(
    protected host: InternalHost,
    protected system: DeconSystem | DeconTwoSystem,
  ) {}

  update(): void {
    this.system.decrementTimer();

    if (this.system.getTimer() == 0) {
      this.system.setTimer(3);

      const state = this.system.getState();

      if ((state & DecontaminationDoorState.Enter) == DecontaminationDoorState.Enter) {
        this.system.setState((state & ~DecontaminationDoorState.Enter) | DecontaminationDoorState.Closed);

        return;
      }

      if ((state & DecontaminationDoorState.Closed) == DecontaminationDoorState.Closed) {
        this.system.setState((state & ~DecontaminationDoorState.Closed) | DecontaminationDoorState.Exit);

        return;
      }

      if ((state & DecontaminationDoorState.Exit) == DecontaminationDoorState.Exit) {
        this.system.setState(DecontaminationDoorState.Idle);
        this.system.setTimer(0);

        if (this.timer) {
          clearInterval(this.timer);

          this.timer = undefined;
        } else {
          throw new Error("Attempted to clear decontamination door timer that does not exist");
        }
      }
    }
  }

  start(from: DecontaminationDoorState): void {
    const systemsHandler = this.host.getSystemsHandler();

    if (!systemsHandler) {
      throw new Error("Attempted to decontaminate without a SystemsHandler instance");
    }

    this.system.setState(from);
    this.system.setTimer(3);

    this.timer = setInterval(() => {
      systemsHandler.setOldShipStatus();
      this.update();
      systemsHandler.sendDataUpdate();
    }, 1000);

    systemsHandler.setOldShipStatus();
    this.update();
    systemsHandler.sendDataUpdate();
  }
}
