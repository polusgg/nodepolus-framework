import { SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";

export enum SubmergedElevatorMovementStage {
  DoorsClosing,
  FadingToBlack,
  ElevatorMovingOut,
  Wait,
  ElevatorMovingIn,
  FadingToClear,
  DoorsOpening,
  Complete,
}

export class SubmergedElevatorSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    elevatorSystem: SystemType.ElevatorEastLeft | SystemType.ElevatorEastRight | SystemType.ElevatorWestLeft | SystemType.ElevatorWestRight | SystemType.ElevatorService,
    protected readonly tandom: SubmergedElevatorSystem,
    protected upperDeckIsTargetFloor: boolean,
    protected moving: boolean,
    protected stage: SubmergedElevatorMovementStage,
  ) {
    super(shipStatus, elevatorSystem);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter()
      .writeBoolean(this.upperDeckIsTargetFloor)
      .writeBoolean(this.moving)
      .writeByte(this.stage);
  }

  clone(): SubmergedElevatorSystem {
    return new SubmergedElevatorSystem(this.shipStatus, this.getType() as SystemType.ElevatorWestLeft | SystemType.ElevatorWestRight | SystemType.ElevatorEastLeft | SystemType.ElevatorEastRight | SystemType.ElevatorService, this.tandom, this.upperDeckIsTargetFloor, this.moving, this.stage);
  }

  equals(old: SubmergedElevatorSystem): boolean {
    if (this.upperDeckIsTargetFloor !== old.upperDeckIsTargetFloor) {
      return false;
    }

    if (this.moving !== old.moving) {
      return false;
    }

    if (this.stage !== old.stage) {
      return false;
    }

    return true;
  }
}
