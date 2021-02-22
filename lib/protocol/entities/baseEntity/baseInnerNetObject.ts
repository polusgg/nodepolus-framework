import { InnerNetObjectType, RpcPacketType } from "../../../types/enums";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { BaseRpcPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { BaseInnerNetEntity } from ".";

export abstract class BaseInnerNetObject {
  constructor(
    public readonly type: InnerNetObjectType,
    public readonly parent: BaseInnerNetEntity,
    public readonly netId: number,
  ) {}

  abstract handleRpc(connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, sendTo: Connection[]): void;

  abstract serializeData(old: BaseInnerNetObject): DataPacket;

  abstract serializeSpawn(): SpawnPacketObject;

  abstract clone(): BaseInnerNetObject;

  sendRpcPacket(packet: BaseRpcPacket, sendTo?: Connection[]): void {
    if (sendTo === undefined || sendTo.length == 0) {
      return;
    }

    this.parent.lobby.sendRpcPacket(this, packet, sendTo);
  }
}
