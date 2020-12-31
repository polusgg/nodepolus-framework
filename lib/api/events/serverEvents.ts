import { GameEndedEvent, GameStartedEvent, GameStartEvent, SetInfectedEvent } from "../events/game";
import { PlayerJoinEvent, PlayerKickedEvent, PlayerLeaveEvent } from "../events/lobby";
import { GameListEvent, LobbyCreatedEvent, LobbyRemovedEvent } from "../events/server";
import { MeetingEndedEvent, MeetingStartedEvent } from "../events/meeting";
import {
  PlayerChatEvent,
  PlayerChatNoteEvent,
  PlayerExiledEvent,
  PlayerKilledEvent,
  PlayerMovedEvent,
  PlayerSetColorEvent,
  PlayerSetHatEvent,
  PlayerSetNameEvent,
  PlayerSetPetEvent,
  PlayerSetSkinEvent,
  PlayerTeleportedEvent,
  PlayerVotedEvent,
  VentEnterEvent,
  VentExitEvent,
} from "../events/player";

type GameEvents = {
  gameEnded: GameEndedEvent;
  gameStarted: GameStartedEvent;
  gameStart: GameStartEvent;
  setInfected: SetInfectedEvent;
};

type LobbyEvents = {
  playerJoin: PlayerJoinEvent;
  playerKicked: PlayerKickedEvent;
  playerLeave: PlayerLeaveEvent;
};

type MeetingEvents = {
  meetingEnded: MeetingEndedEvent;
  meetingStarted: MeetingStartedEvent;
};

type PlayerEvents = {
  playerChat: PlayerChatEvent;
  playerChatNote: PlayerChatNoteEvent;
  playerExiled: PlayerExiledEvent;
  playerKilled: PlayerKilledEvent;
  playerMoved: PlayerMovedEvent;
  playerSetColor: PlayerSetColorEvent;
  playerSetHat: PlayerSetHatEvent;
  playerSetName: PlayerSetNameEvent;
  playerSetPet: PlayerSetPetEvent;
  playerSetSkin: PlayerSetSkinEvent;
  playerTeleported: PlayerTeleportedEvent;
  playerVoted: PlayerVotedEvent;
  ventEnter: VentEnterEvent;
  ventExit: VentExitEvent;
};

type ServerEvents = {
  gameList: GameListEvent;
  lobbyCreated: LobbyCreatedEvent;
  lobbyRemoved: LobbyRemovedEvent;
};

// TODO: DespawnEvent

export type AllEvents = GameEvents
& LobbyEvents
& MeetingEvents
& PlayerEvents
& ServerEvents;
