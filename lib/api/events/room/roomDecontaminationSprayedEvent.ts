import { CancellableEvent } from "../types";

export class RoomDecontaminationSprayedEvent extends CancellableEvent {
  constructor(
    private readonly decontamination: number,
    private readonly side: number,

  ) {
    super();
  }

  getDcontamination(): number {
    return this.decontamination;
  }

  getSide(): number {
    return this.side;
  }
}
