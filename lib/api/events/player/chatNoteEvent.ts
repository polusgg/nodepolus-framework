import { ChatNoteType } from "../../../types/enums";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class ChatNoteEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly chatNoteType: ChatNoteType,
  ) {
    super();
  }
}
