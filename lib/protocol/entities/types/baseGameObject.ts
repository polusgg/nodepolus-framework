import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { DataPacket } from "../../packets/gameData";
import { BaseRPCPacket } from "../../packets/rpc";
import { Entity, InnerNetObject } from "../types";
import { HostInstance } from "../../../host";
import { InnerNetObjectType } from "./enums";
import { Player } from "../../../player";

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
