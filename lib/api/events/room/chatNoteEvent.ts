import { ChatNoteType } from "../../../types/chatNoteType";
import { CancellableEvent } from "../cancellableEvent";
import { Player } from "../../player";

export class ChatNoteEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly chatNoteType: ChatNoteType,
  ) {
    super();
  }
}
