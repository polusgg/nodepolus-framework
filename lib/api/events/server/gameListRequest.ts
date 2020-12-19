import { CancellableEvent } from "../cancellableEvent";
import { Player } from "../../player";
import { RoomListing } from "../../../protocol/packets/rootGamePackets/getGameList";

export class GameListRequest extends CancellableEvent {
  constructor(
    public readonly requester: Player,
    public readonly lobbies: RoomListing[],
    public readonly mapCounts: [number, number, number, number],
    public readonly requestedPrivate: boolean,
  ) {
    super();
  }
}
