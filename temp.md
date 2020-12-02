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
          data.ts
          rpc.ts
          spawn.ts
          despawn.ts
          sceneChange.ts
          ready.ts
          changeSettings.ts

      rootAnnouncementPackets/
        ...


room.host.handlePlayerJoin();
     \ Getter 
        \ HostInstance
           \ Connection
           |
           \ CustomHostInstance

packet
 |
\ /
room (saah)
 |
\ /
Update Data
 |
\ /
server sends data



packet
 |
\ /
room (not saah)
 |
\ /
player host
 |
\ /
Data to server
 |
\ /
server updates data

==========

room (not saah)
 |
\ /
GameData > RPCSetInfected (this is when we update state)
 |
\ /
ClientInstance 

==========

room (saah)
 |
\ /
CustomHostInstance (this is when we update state)
 |
\ /
Data




01
0004
bc0005
  00000000
  0c0004
    02
    feffffff0f
    00
    01
      01
      000001
  120004
    03
    feffffff0f
    00
    02
      02
      010001
        00
      03
      010001
        00
  1c0004
    04
    03
    01
    03
      04
      020001
        01
        00
      05
      000001
      06
      0a0001
        0000 ff7f ff7f ff7f ff7f
  310002
    04
    02
      2e040a00010000020000803f0000803f0000c03f000034420101020100000002010f00000078000000000f01010000
  0d0002
    04
    06
    0a757775756273636f6f62
  030002
    04
    08
    06
  030002
    04
    11
    08
  030002
    04
    09
    5a
  030002
    04
    0a
    00
  160002
    02
    1e
    1100000a757775756273636f6f62065a08000000






