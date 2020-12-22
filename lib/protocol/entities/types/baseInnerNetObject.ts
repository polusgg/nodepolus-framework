import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { DataPacket } from "../../packets/gameData";
import { BaseRPCPacket } from "../../packets/rpc";
import { HostInstance } from "../../../host";
import { InnerNetObjectType } from "./enums";
import { Player } from "../../../player";
import { BaseInnerNetEntity } from ".";

export abstract class BaseInnerNetObject {
  constructor(
    public readonly type: InnerNetObjectType,
    public netId: number,
    public parent: BaseInnerNetEntity,
  ) {}

  abstract clone(): BaseInnerNetObject;

  abstract getData(old: BaseInnerNetObject): DataPacket;

  abstract setData(packet: MessageReader | MessageWriter): void;

  abstract getSpawn(): SpawnInnerNetObject;

  abstract setSpawn(data: MessageReader | MessageWriter): void;

  data(packet: MessageReader | MessageWriter): void;
  data(old: BaseInnerNetObject): DataPacket;
  data(arg0: MessageReader | MessageWriter | BaseInnerNetObject): DataPacket | undefined {
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
    this.parent.lobby.sendRPCPacket(this as unknown as BaseInnerNetObject, packet, to);
  }
}
