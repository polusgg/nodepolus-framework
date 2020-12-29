import { ChatNoteType } from "../../../types/enums";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerChatNoteEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly chatNoteType: ChatNoteType,
  ) {
    super();
  }
}
