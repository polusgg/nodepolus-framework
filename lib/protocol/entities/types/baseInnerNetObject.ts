import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { DataPacket } from "../../packets/gameData";
import { BaseRpcPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { InnerNetObjectType } from "./enums";
import { BaseInnerNetEntity } from ".";

export abstract class BaseInnerNetObject {
  constructor(
    public readonly type: InnerNetObjectType,
    public readonly netId: number,
    public readonly parent: BaseInnerNetEntity,
  ) {}

  abstract clone(): BaseInnerNetObject;

  abstract getData(old: BaseInnerNetObject): DataPacket;

  abstract setData(packet: MessageReader | MessageWriter): void;

  abstract serializeSpawn(): SpawnInnerNetObject;

  data(packet: MessageReader | MessageWriter): void;
  data(old: BaseInnerNetObject): DataPacket;
  data(arg0: MessageReader | MessageWriter | BaseInnerNetObject): DataPacket | undefined {
    if (arg0 instanceof MessageReader || arg0 instanceof MessageWriter) {
      this.setData(arg0);
    } else {
      return this.getData(arg0);
    }
  }

  sendRpcPacketTo(to: Connection[], packet: BaseRpcPacket): void {
    if (to.length == 0) {
      return;
    }

    this.parent.lobby.sendRpcPacket(this, packet, to);
  }
}
