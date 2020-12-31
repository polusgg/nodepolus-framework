[ Server Events ]

- roomCreated
- roomDestroyed
- gameListRequest

[ Lobby Events ]

- countdownStarted
- countdownInterrupted
- public *emitted whenever the lobby goes from Private => Public*
- private *emitted whenever the lobby goes from Public => Private, and when the lobby is created*

[ Settings Events ]
- changed
- [...all settings]Changed

[ Player Events ]

- connected *emitted when the server recieves a Hello packet*
- joined *emitted when the server recieves a joinGame packet*
- rejoined *emitted when the player rejoins a game*
- disconnected *emitted when the server recieves a 09 disconnect packet*
- kicked
- banned
- colorChanged
- nameChanged
- skinChanged
- hatChanged
- petChanged
- moved *emitted when the player either teleports OR walks (CNT:Data OR CNT:RPCSnapTo)*
- teleported *emittede only on CNT:RPCSnapTO*
- walked *emitted only on CNT:Data*
- died *emitted whenever a player dies*
- murdered *emitted whenever a player gets murdered*
- exiled *emitted whenever a player gets exiled*
- taskCompleted *emitted whenever a player completes a task*
- taskUndone *emitted whenever a task goes from a complete to incomplete state*
- taskAssigned
- taskRemoved
- impostor *emitted whenever a player is assigned impostor*
- crewmate *emitted at the start of the game, and when a player goes from a Impostor => Crewmate*
- chat
- chatNote
- watchingCameras
- stoppedWatchingCamers
- startedScanning
- stoppedScanning *includes boolean isFinished*
- enterVent
- exitVent
- castVote
- clearVote
- castVoteKick

[ Game Events ]

- started
- finishedVoting *when all the players have voted*
- closed *when the animation starts*
- ended *when players are back in-map*

[ Meeting Events ]

- called
- ended

[ Room Events ]

- sabotaged
- fixed
- doorsClosed *emitted with a Doors[] of doors that closed, in case of an API call to only close one door*
- doorsOpened *emitted with a Doors[] of doors that opened, in case of an API call to only open one door*

[ Sabotage Events / Electrical Sabotage ]

- switchFlipped

[ Sabotage Events / HQHud Sabotage ]

- consoleOpened
- consoleClosed
- consoleRepaired
- consoleDamaged

[ Sabotage Events / Oxygen Sabotage ]

- consoleRepaired
- consoleDamaged

[ Sabotage Events / Reactor Sabotage ]

- consoleRepaired
- consoleDamaged

[ Decontamination Events ]

- entered
- exited
- gassed

