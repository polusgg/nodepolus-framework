import { ChatNoteType } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class PlayerChatNoteEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly chatNoteType: ChatNoteType,
  ) {
    super();
  }
}
