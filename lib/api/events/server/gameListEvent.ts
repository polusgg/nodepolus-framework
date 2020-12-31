import { LobbyCount, LobbyListing } from "../../../protocol/packets/root/types";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class GameListEvent extends CancellableEvent {
  constructor(
    public readonly requester: PlayerInstance,
    public readonly lobbies: LobbyListing[],
    public readonly mapCounts: LobbyCount,
    public readonly requestedPrivate: boolean,
  ) {
    super();
  }
}
