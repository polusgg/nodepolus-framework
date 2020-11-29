import { SpawnPacket, SpawnInnerNetObject } from "../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../packets/rootGamePackets/gameDataPackets/data";
import { MessageWriter, MessageReader } from "../../util/hazelMessage";
import { InnerNetObjectType, RoomImplementation } from "./types";
import { EntityAprilShipStatus } from "./aprilShipStatus";
import { EntityLobbyBehaviour } from "./lobbyBehaviour";
import { BaseRPCPacket } from "../packets/basePacket";
import { EntityHeadquarters } from "./headquarters";
import { SpawnFlag } from "../../types/spawnFlag";
import { SpawnType } from "../../types/spawnType";
import { EntityMeetingHud } from "./meetingHud";
import { EntityShipStatus } from "./shipStatus";
import { EntityPlanetMap } from "./planetMap";
import { EntityGameData } from "./gameData";
import { EntityPlayer } from "./player";
import { Player } from "../../player";
import { HostInstance } from "../../host/types";

export type Entity = EntityAprilShipStatus
                   | EntityGameData
                   | EntityHeadquarters
                   | EntityLobbyBehaviour
                   | EntityMeetingHud
                   | EntityPlanetMap
                   | EntityPlayer
                   | EntityShipStatus

export abstract class BaseEntity {
  constructor(public readonly type: SpawnType, public readonly room: RoomImplementation) {}

  abstract setSpawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void;

  abstract getSpawn(): SpawnPacket;

  spawn(): SpawnPacket {
    return this.getSpawn();
  }
}

export abstract class BaseGameObject<T> {
  constructor(public readonly type: InnerNetObjectType, public id: number, public parent: Entity) {}

  abstract getData(old: BaseGameObject<T>): DataPacket;

  abstract setData(packet: MessageReader | MessageWriter): void;

  data(packet: MessageReader | MessageWriter): void;
  data(old: BaseGameObject<T>): DataPacket;
  data(arg0: MessageReader | MessageWriter | BaseGameObject<T>): DataPacket | void {
    if (arg0 instanceof MessageReader || arg0 instanceof MessageWriter) {
      this.setData(arg0);
    } else {
      return this.getData(arg0);
    }
  }

  abstract getSpawn(): SpawnInnerNetObject;

  abstract setSpawn(data: MessageReader | MessageWriter): void;

  spawn(): SpawnInnerNetObject {
    return this.getSpawn();
  }

  // TODO: Combine sendRPCPacket and sendRPCPacketTo with optional ending `to?` param
  sendRPCPacket(packet: BaseRPCPacket): void {
    this.parent.room.sendRPCPacket(this, packet)
  }

  sendRPCPacketTo(to: (Player | HostInstance)[], packet: BaseRPCPacket): void {
    this.parent.room.sendRPCPacket(this, packet, to)
  }
}
