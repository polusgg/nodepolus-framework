lib/
  api/
    index.ts
    player.ts
    room.ts
    server.ts

    sabotage/
      index.ts
      reactorSabotage.ts
      electricalSabotage.ts
      oxygenSabotage.ts
      simpleComsSabotage.ts
      miraComsSabotage.ts
      simpleDoors.ts
      polusDoors.ts
    
    game/
      index.ts
      scan.ts
      cams.ts
      decon.ts
      meeting.ts

  annoucementServer/
    index.ts
    packetHandler.ts

  shard/
    shardManager/
      index.ts
    shardServer/
      index.ts

  server/
    index.ts
    packetHandler.ts
    serverRoom.ts (extends Room)

  room/
    index.ts
    packetHandler.ts
    gameDataPacketHandler.ts
    gameObjectHandler.ts
    serverPlayer.ts (extends Player)
  
  player/
    index.ts
    
  client/
    index.ts
    clientRoom.ts (extends Room)
    clientPlayer.ts (extends Player)

  proxy/
    index.ts
    proxyRoom.ts (extends room)
    
  util/
    roomCode.ts
    clientVersion.ts
    text.ts
    textMark.ts
    
  types/
    alterGameTag.ts
    chatNoteType.ts
    disconnectReason.ts
    language.ts
    gameOverReason.ts
    level.ts
    playerColor.ts
    playerHat.ts
    playerSkin.ts
    playerPet.ts
    systemTyp.ts
    t7askType.ts
    taskBarUp.ts
    spawnType.ts
    spawnFlag.ts
    killDista.ts
  protocol/
    connection.ts
    
    entities/
      player/
        index.ts
        playerControl.ts
        playerPhysics.ts
        customNetworkTransform.ts
        
    packets/
      index.ts
      types.ts
      ...
      
      packetTypes/
        helloPacket.ts
        unreliablePacket.ts
        reliablePacket.ts
        disconnectPacket.ts
        acknowledgementPacket.ts
        pingPacket.ts

      rootGamePackets/
        hostGame.ts
        joinGame.ts
        startGame.ts
        removeGame.ts
        removePlayer.ts
        gameData.ts
        gameDataTo.ts
        joinedGame.ts
        endGame.ts
        alterGame.ts
        kickPlayer.ts
        waitForHost.ts
        redirect.ts
        reselectServer.ts
        getGameList.ts
        
        gameDataPackets/
          data.ts
          rpc.ts
          spawn.ts
          despawn.ts
          sceneChange.ts
          ready.ts
          changeSettings.ts
      
      rootAnnouncementPackets/
        ...
