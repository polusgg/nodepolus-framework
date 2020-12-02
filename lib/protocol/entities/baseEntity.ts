import { SpawnInnerNetObject, SpawnPacket } from "../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerNetObject, InnerNetObjectType, RoomImplementation } from "./types";
import { DataPacket } from "../packets/rootGamePackets/gameDataPackets/data";
import { MessageReader, MessageWriter } from "../../util/hazelMessage";
import { EntityAprilShipStatus } from "./aprilShipStatus";
import { EntityLobbyBehaviour } from "./lobbyBehaviour";
import { BaseRPCPacket } from "../packets/basePacket";
import { EntityHeadquarters } from "./headquarters";
import { SpawnFlag } from "../../types/spawnFlag";
import { SpawnType } from "../../types/spawnType";
import { EntityMeetingHud } from "./meetingHud";
import { EntityShipStatus } from "./shipStatus";
import { HostInstance } from "../../host/types";
import { EntityPlanetMap } from "./planetMap";
import { EntityGameData } from "./gameData";
import { EntityPlayer } from "./player";
import { Player } from "../../player";

export type Entity = EntityAprilShipStatus
| EntityGameData
| EntityHeadquarters
| EntityLobbyBehaviour
| EntityMeetingHud
| EntityPlanetMap
| EntityPlayer
| EntityShipStatus;

export abstract class BaseEntity {
  constructor(readonly type: SpawnType, readonly room: RoomImplementation) {}

  abstract setSpawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void;

  abstract getSpawn(): SpawnPacket;

  spawn(): SpawnPacket {
    return this.getSpawn();
  }
}

export abstract class BaseGameObject<T> {
  constructor(readonly type: InnerNetObjectType, public id: number, public parent: Entity) {}

  abstract getData(old: BaseGameObject<T>): DataPacket;

  abstract setData(packet: MessageReader | MessageWriter): void;

  abstract getSpawn(): SpawnInnerNetObject;

  abstract setSpawn(data: MessageReader | MessageWriter): void;

  data(packet: MessageReader | MessageWriter): void;
  data(old: BaseGameObject<T>): DataPacket;
  data(arg0: MessageReader | MessageWriter | BaseGameObject<T>): DataPacket | undefined {
    if (arg0 instanceof MessageReader || arg0 instanceof MessageWriter) {
      this.setData(arg0);
    } else {
      return this.getData(arg0);
    }
  }

  spawn(): SpawnInnerNetObject {
    return this.getSpawn();
  }

  sendRPCPacketTo(to: (Player | HostInstance)[], packet: BaseRPCPacket): void {
    this.parent.room.sendRPCPacket(this as unknown as InnerNetObject, packet, to);
  }
}
