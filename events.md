Server Events
- "server.lobby.host"
- "server.lobby.join"
- "server.lobby.list"
- "server.lobby.created"
- "server.lobby.destroyed"

Lobby Events
- "lobby.countdown.started"
- "lobby.countdown.stopped"
  - wasInterrupted: boolean
- "lobby.privacy.updated" (when the lobby goes from Private <=> Public)

Settings Events
- changed
- [...all settings]Changed

Connection Events
- "connection.open" (after receiving a Hello packet)
- "connection.close" (after a connection disconnects itself)
  - wasDisconnectedByServer: boolean

Object Events
- "object.spawn"
- "object.despawn"

Player Events
- "player.joined" (after receiving a JoinGame packet)
  - isRejoining: boolean
- "player.kicked"
- "player.banned"
- "player.left"
- "player.color.updated"
- "player.name.updated"
- "player.skin.updated"
- "player.hat.updated"
- "player.pet.updated"
- "player.position.updated" (walking or snapto)
- "player.position.teleported" (snapto)
- "player.position.walked" (walking)
- "player.died" (when a player dies)
  - killer?: PlayerInstance
- "player.murdered" (when a player is killed by another player)
  - extends "player.died" event
- "player.exiled" (when a player is exiled)
  - extends "player.died" event
- "player.revived"
- "player.task.completed" (when a player completes a task)
- "player.task.uncompleted" (when a task is marked as incomplete)
- "player.task.added"
- "player.task.removed"
- "player.role.updated" (when a player is assigned crewmate or impostor)
  - role: Role (enum: Impostor, Crewmate)
- "player.chat.message"
- "player.chat.note"

Game Events
- "game.started"
- "game.vent.enter"
- "game.vent.exit"
- "game.scanner.started"
- "game.scanner.stopped"
  - finishedScanning: boolean
- "game.scanner.queued"
- "game.scanner.dequeued"
  - didStartScanning: boolean
- "game.cameras.opened"
- "game.cameras.closed"

Meeting Events
- "meeting.started"
- "meeting.vote.added"
- "meeting.vote.removed"
- "meeting.concluded" (when all players have voted or the time has run out)
- "meeting.closed" (when the meeting HUD closes)
- "meeting.ended" (after the exile animation)
- "meeting.votekick"

Room (Map Rooms) Events
- sabotaged
- fixed
- doorsClosed *emitted with a Doors[] of doors that closed, in case of an API call to only close one door*
- doorsOpened *emitted with a Doors[] of doors that opened, in case of an API call to only open one door*

Sabotage: Electrical
- switchFlipped

Sabotage: Mira Comms
- consoleOpened
- consoleClosed
- consoleRepaired
- consoleDamaged

Sabotage: Oxygen
- consoleRepaired
- consoleDamaged

Sabotage: Reactor
- consoleRepaired
- consoleDamaged

Decontamination
- entered
- exited
- gassed

