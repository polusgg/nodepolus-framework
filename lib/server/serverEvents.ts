import { LobbyCreatedEvent } from "../api/events/server";

export type ServerEvents = {
  lobbyCreated: LobbyCreatedEvent;
};
