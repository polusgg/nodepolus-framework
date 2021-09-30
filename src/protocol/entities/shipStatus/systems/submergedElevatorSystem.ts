import { PlayerInstance } from "../../../../api/player";
import { ELEVATOR_BOUNDS } from "../../../../static/elevator";
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
    protected readonly elevatorSystem: SystemType.SubmergedElevatorEastLeft | SystemType.SubmergedElevatorEastRight | SystemType.SubmergedElevatorWestLeft | SystemType.SubmergedElevatorWestRight | SystemType.SubmergedElevatorService,
    protected upperDeckIsTargetFloor: boolean,
    protected moving: boolean = false,
    protected stage: SubmergedElevatorMovementStage = SubmergedElevatorMovementStage.Complete,
    protected tandem?: SubmergedElevatorSystem,
  ) {
    super(shipStatus, elevatorSystem);
  }

  isMoving(): boolean {
    return this.moving;
  }

  flipTargetFloor(): void {
    this.upperDeckIsTargetFloor = !this.upperDeckIsTargetFloor;
  }

  isUpperDeckTargetFloor(): boolean {
    return this.upperDeckIsTargetFloor;
  }

  startMoving(): void {
    this.moving = true;
  }

  stopMoving(): void {
    this.moving = false;
  }

  setStage(stage: SubmergedElevatorMovementStage): void {
    this.stage = stage;
  }

  hasTandem(): boolean {
    return this.tandem !== undefined;
  }

  getTandem(): SubmergedElevatorSystem | undefined {
    return this.tandem;
  }

  getPlayersInsideElevator(): PlayerInstance[] {
    const bounds = ELEVATOR_BOUNDS[this.elevatorSystem];

    return this.getShipStatus().getLobby().getPlayers().filter(p => p.getPosition().inside(bounds.lower.a, bounds.lower.b) || p.getPosition().inside(bounds.upper.a, bounds.upper.b));
  }

  getSafeTandem(): SubmergedElevatorSystem {
    const tandem = this.getTandem();

    if (tandem === undefined) {
      throw new Error("Attempted safe get tandem, which failed");
    }

    return tandem;
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
    return new SubmergedElevatorSystem(this.shipStatus, this.getType() as SystemType.SubmergedElevatorWestLeft | SystemType.SubmergedElevatorWestRight | SystemType.SubmergedElevatorEastLeft | SystemType.SubmergedElevatorEastRight | SystemType.SubmergedElevatorService, this.upperDeckIsTargetFloor, this.moving, this.stage, this.tandem);
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

  setTandem<T extends SubmergedElevatorSystem>(elevator: T): T {
    this.tandem = elevator;

    return elevator;
  }
}
