import { ChatNoteType } from "../../../types/enums";
import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerChatNoteEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly chatNoteType: ChatNoteType,
  ) {
    super();
  }
}
