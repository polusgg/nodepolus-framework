import { Entity, InnerNetObject, InnerNetObjectType, LobbyImplementation } from "./types";
import { SpawnInnerNetObject, SpawnPacket } from "../packets/gameData/spawn";
import { MessageReader, MessageWriter } from "../../util/hazelMessage";
import { SpawnFlag, SpawnType } from "../../types/enums";
import { BaseRPCPacket } from "../packets/basePacket";
import { DataPacket } from "../packets/gameData/data";
import { HostInstance } from "../../host/types";
import { Player } from "../../player";

export abstract class BaseEntity {
  constructor(
    public readonly type: SpawnType,
    public readonly lobby: LobbyImplementation,
  ) {}

  abstract setSpawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void;

  abstract getSpawn(): SpawnPacket;

  spawn(): SpawnPacket {
    return this.getSpawn();
  }
}

export abstract class BaseGameObject<T> {
  constructor(
    public readonly type: InnerNetObjectType,
    public id: number,
    public parent: Entity,
  ) {}

  abstract clone(): T;

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
    this.parent.lobby.sendRPCPacket(this as unknown as InnerNetObject, packet, to);
  }
}
