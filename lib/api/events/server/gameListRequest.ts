import { GameListCounts, RoomListing } from "../../../protocol/packets/rootGamePackets/getGameList";
import { CancellableEvent } from "../cancellableEvent";
import { Player } from "../../player";

export class GameListRequest extends CancellableEvent {
  constructor(
    public readonly requester: Player,
    public readonly lobbies: RoomListing[],
    public readonly mapCounts: GameListCounts,
    public readonly requestedPrivate: boolean,
  ) {
    super();
  }
}
