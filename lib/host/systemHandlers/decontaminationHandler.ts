import { DeconSystem, DeconTwoSystem } from "../../protocol/entities/baseShipStatus/systems";
import { DecontaminationDoorState } from "../../types/enums";
import { InternalHost } from "..";

export class DecontaminationHandler {
  private timer?: NodeJS.Timeout;

  constructor(
    public host: InternalHost,
    public system: DeconSystem | DeconTwoSystem,
  ) {}

  update(): void {
    if (--this.system.timer < 0) {
      this.system.timer = 0;
    }

    if (this.system.timer == 0) {
      this.system.timer = 3;

      if (this.system.state & DecontaminationDoorState.Enter) {
        this.system.state &= ~DecontaminationDoorState.Enter;
        this.system.state |= DecontaminationDoorState.Closed;

        return;
      }

      if (this.system.state & DecontaminationDoorState.Closed) {
        this.system.state &= ~DecontaminationDoorState.Closed;
        this.system.state |= DecontaminationDoorState.Exit;

        return;
      }

      if (this.system.state & DecontaminationDoorState.Exit) {
        this.system.state = DecontaminationDoorState.Idle;
        this.system.timer = 0;

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

    this.system.state = from;
    this.system.timer = 3;

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
