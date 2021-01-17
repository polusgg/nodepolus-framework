import { CancellableEvent } from "../types";

/**
 * Fired when a decontamination room has fired its sprayers to decontaminate all players inside.
 */
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
