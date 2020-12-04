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

  host/
    index.ts

  types/
    {done}

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
        {done}

      rootGamePackets/
        {done}

        gameDataPackets/
          {done}

      rootAnnouncementPackets/
        ...








