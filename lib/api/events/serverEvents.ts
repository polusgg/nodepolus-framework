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

export type ServerEvents = {
  // TODO
  // despawn: DespawnEvent;
  gameEnded: GameEndedEvent;
  gameList: GameListEvent;
  gameStarted: GameStartedEvent;
  gameStart: GameStartEvent;
  lobbyCreated: LobbyCreatedEvent;
  lobbyRemoved: LobbyRemovedEvent;
  meetingEnded: MeetingEndedEvent;
  meetingStarted: MeetingStartedEvent;
  playerChat: PlayerChatEvent;
  playerChatNote: PlayerChatNoteEvent;
  playerExiled: PlayerExiledEvent;
  playerJoin: PlayerJoinEvent;
  playerKicked: PlayerKickedEvent;
  playerKilled: PlayerKilledEvent;
  playerLeave: PlayerLeaveEvent;
  playerMoved: PlayerMovedEvent;
  playerSetColor: PlayerSetColorEvent;
  playerSetHat: PlayerSetHatEvent;
  playerSetName: PlayerSetNameEvent;
  playerSetPet: PlayerSetPetEvent;
  playerSetSkin: PlayerSetSkinEvent;
  playerTeleported: PlayerTeleportedEvent;
  playerVoted: PlayerVotedEvent;
  setInfected: SetInfectedEvent;
  ventEnter: VentEnterEvent;
  ventExit: VentExitEvent;
};
