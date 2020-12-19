import { LobbyCounts, LobbyListing } from "../../../protocol/packets/rootGamePackets/getGameList";
import { CancellableEvent } from "../cancellableEvent";
import { Player } from "../../player";

export class GameListRequest extends CancellableEvent {
  constructor(
    public readonly requester: Player,
    public readonly lobbies: LobbyListing[],
    public readonly mapCounts: LobbyCounts,
    public readonly requestedPrivate: boolean,
  ) {
    super();
  }
}
