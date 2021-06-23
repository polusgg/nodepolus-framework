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
    elevatorSystem: SystemType.SubmergedElevatorEastLeft | SystemType.SubmergedElevatorEastRight | SystemType.SubmergedElevatorWestLeft | SystemType.SubmergedElevatorWestRight | SystemType.SubmergedElevatorService,
    protected upperDeckIsTargetFloor: boolean,
    protected moving: boolean = false,
    protected stage: SubmergedElevatorMovementStage = SubmergedElevatorMovementStage.Complete,
    protected tandom?: SubmergedElevatorSystem,
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
    return new SubmergedElevatorSystem(this.shipStatus, this.getType() as SystemType.SubmergedElevatorWestLeft | SystemType.SubmergedElevatorWestRight | SystemType.SubmergedElevatorEastLeft | SystemType.SubmergedElevatorEastRight | SystemType.SubmergedElevatorService, this.upperDeckIsTargetFloor, this.moving, this.stage, this.tandom);
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

  setTandom<T extends SubmergedElevatorSystem>(elevator: T): T {
    this.tandom = elevator;

    return elevator;
  }
}
