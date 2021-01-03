import {
  ConnectionClosedEvent,
  ConnectionOpenedEvent,
} from "./connection";
import {
  GameCamerasClosedEvent,
  GameCamerasOpenedEvent,
  GameEndedEvent,
  GameScannerDequeuedEvent,
  GameScannerQueuedEvent,
  GameScannerStartedEvent,
  GameScannerStoppedEvent,
  GameStartedEvent,
  GameStartingEvent,
  GameVentEnteredEvent,
  GameVentExitedEvent,
} from "./game";
import {
  LobbyCountdownStartedEvent,
  LobbyCountdownStoppedEvent,
  LobbyPrivacyUpdatedEvent,
} from "./lobby";
import {
  MeetingClosedEvent,
  MeetingConcludedEvent,
  MeetingEndedEvent,
  MeetingStartedEvent,
  MeetingVoteAddedEvent,
  MeetingVoteRemovedEvent,
} from "./meeting";
import {
  PlayerBannedEvent,
  PlayerChatMessageEvent,
  PlayerChatNoteEvent,
  PlayerColorUpdatedEvent,
  PlayerDiedEvent,
  PlayerExiledEvent,
  PlayerHatUpdatedEvent,
  PlayerJoinedEvent,
  PlayerKickedEvent,
  PlayerLeftEvent,
  PlayerMurderedEvent,
  PlayerNameUpdatedEvent,
  PlayerPetUpdatedEvent,
  PlayerPositionTeleportedEvent,
  PlayerPositionUpdatedEvent,
  PlayerPositionWalkedEvent,
  PlayerRevivedEvent,
  PlayerRoleUpdatedEvent,
  PlayerSkinUpdatedEvent,
  PlayerTaskAddedEvent,
  PlayerTaskAnimationEvent,
  PlayerTaskCompletedEvent,
  PlayerTaskRemovedEvent,
  PlayerTaskUncompletedEvent,
  PlayerVotekickAddedEvent,
  PlayerVotekickRemovedEvent,
} from "./player";
import {
  ServerLobbyCreatedEvent,
  ServerLobbyDestroyedEvent,
  ServerLobbyJoinEvent,
  ServerLobbyListEvent,
} from "./server";

export type ServerEvents = {
  /**
   * Connection Events
   */
  "connection.closed": ConnectionClosedEvent;
  "connection.opened": ConnectionOpenedEvent;

  /**
   * Game Events
   */
  "game.cameras.closed": GameCamerasClosedEvent;
  "game.cameras.opened": GameCamerasOpenedEvent;
  "game.ended": GameEndedEvent;
  "game.scanner.dequeued": GameScannerDequeuedEvent;
  "game.scanner.queued": GameScannerQueuedEvent;
  "game.scanner.started": GameScannerStartedEvent;
  "game.scanner.stopped": GameScannerStoppedEvent;
  "game.started": GameStartedEvent;
  "game.starting": GameStartingEvent;
  "game.vent.entered": GameVentEnteredEvent;
  "game.vent.exited": GameVentExitedEvent;

  /**
   * Lobby Events
   */
  "lobby.countdown.started": LobbyCountdownStartedEvent;
  "lobby.countdown.stopped": LobbyCountdownStoppedEvent;
  "lobby.privacy.updated": LobbyPrivacyUpdatedEvent;

  /**
   * Meeting Events
   */
  "meeting.closed": MeetingClosedEvent;
  "meeting.concluded": MeetingConcludedEvent;
  "meeting.ended": MeetingEndedEvent;
  "meeting.started": MeetingStartedEvent;
  "meeting.vote.added": MeetingVoteAddedEvent;
  "meeting.vote.removed": MeetingVoteRemovedEvent;

  /**
   * Player Events
   */
  "player.banned": PlayerBannedEvent;
  "player.chat.message": PlayerChatMessageEvent;
  "player.chat.note": PlayerChatNoteEvent;
  "player.color.updated": PlayerColorUpdatedEvent;
  "player.died": PlayerDiedEvent;
  "player.exiled": PlayerExiledEvent;
  "player.hat.updated": PlayerHatUpdatedEvent;
  "player.joined": PlayerJoinedEvent;
  "player.kicked": PlayerKickedEvent;
  "player.left": PlayerLeftEvent;
  "player.murdered": PlayerMurderedEvent;
  "player.name.updated": PlayerNameUpdatedEvent;
  "player.pet.updated": PlayerPetUpdatedEvent;
  "player.position.teleported": PlayerPositionTeleportedEvent;
  "player.position.updated": PlayerPositionUpdatedEvent;
  "player.position.walked": PlayerPositionWalkedEvent;
  "player.revived": PlayerRevivedEvent;
  "player.role.updated": PlayerRoleUpdatedEvent;
  "player.skin.updated": PlayerSkinUpdatedEvent;
  "player.task.added": PlayerTaskAddedEvent;
  "player.task.animation": PlayerTaskAnimationEvent;
  "player.task.completed": PlayerTaskCompletedEvent;
  "player.task.removed": PlayerTaskRemovedEvent;
  "player.task.uncompleted": PlayerTaskUncompletedEvent;
  "player.votekick.added": PlayerVotekickAddedEvent;
  "player.votekick.removed": PlayerVotekickRemovedEvent;

  /**
   * Server Events
   */
  "server.lobby.created": ServerLobbyCreatedEvent;
  "server.lobby.destroyed": ServerLobbyDestroyedEvent;
  "server.lobby.join": ServerLobbyJoinEvent;
  "server.lobby.list": ServerLobbyListEvent;
};

// export type InternalEvents = {
//   // Object Events
//   "object.spawned": ObjectSpawnedEvent;
//   "object.despawned": ObjectDespawnedEvent;
// };
