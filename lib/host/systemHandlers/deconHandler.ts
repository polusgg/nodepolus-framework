import { DeconSystem, DecontaminationDoorState } from "../../protocol/entities/baseShipStatus/systems/deconSystem";
import { DeconTwoSystem } from "../../protocol/entities/baseShipStatus/systems/deconTwoSystem";
import { CustomHost } from "..";

export class DeconHandler {
  private timer: NodeJS.Timeout | undefined;

  constructor(
    public host: CustomHost,
    public system: DeconSystem | DeconTwoSystem,
  ) {}

  update(): void {
    console.log("Update Called", this.system);

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
    this.system.state = from;
    this.system.timer = 3;

    this.timer = setInterval(() => {
      this.host.systemsHandler.setOldShipStatus();
      this.update();
      this.host.systemsHandler.sendDataUpdate();
    }, 1000);

    this.host.systemsHandler.setOldShipStatus();
    this.update();
    this.host.systemsHandler.sendDataUpdate();
  }
}
