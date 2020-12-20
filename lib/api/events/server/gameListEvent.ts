import { LobbyCount, LobbyListing } from "../../../protocol/packets/root/types";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class GameListEvent extends CancellableEvent {
  constructor(
    public readonly requester: Player,
    public readonly lobbies: LobbyListing[],
    public readonly mapCounts: LobbyCount,
    public readonly requestedPrivate: boolean,
  ) {
    super();
  }
}
