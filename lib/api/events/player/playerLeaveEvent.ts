import { PlayerInstance } from "../../player";

export class PlayerLeaveEvent {
  constructor(
    public player: PlayerInstance,
  ) {}
}
