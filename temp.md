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

[false, false, false, false] enter, closed, exit, hu




timer    value
3        9          Enter  | HeadingUp    <---
2        9          Enter  | HeadingUp       | - Office doors opened from outside and counting down to close
1        9          Enter  | HeadingUp    <---
3        a          Closed | HeadingUp    <---
2        a          Closed | HeadingUp       | - Sprayers running
1        a          Closed | HeadingUp    <---
3        c          Exit   | HeadingUp    <---
2        c          Exit   | HeadingUp       | - Specimens doors opened and conting down to close
1        c          Exit   | HeadingUp    <---
0        0          Idle


timer    value
3        1          Enter     <---
2        1          Enter        | - Specimens doors opened from outsideand counting down to close
1        1          Enter     <---
3        2          Closed    <---
2        2          Closed       | - Sprayers running
1        2          Closed    <---
3        4          Exit      <---
2        4          Exit         | - Office doors opened and counting down to close
1        4          Exit      <---
0        0          Idle


timer    value
3        4          Exit      <---
2        4          Exit         | - Office doors opened from insde and counting down to close
1        4          Exit      <---
0        0          Idle


timer    value
3        c          Exit | HeadingUp      <---
2        c          Exit | HeadingUp         | - Specimens doors opened from inside and counting down to close
1        c          Exit | HeadingUp      <---
0        0          Idle





