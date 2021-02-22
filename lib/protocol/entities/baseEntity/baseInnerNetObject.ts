import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { InnerNetObjectType } from "../../../types/enums";
import { BaseRpcPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { BaseInnerNetEntity } from ".";

export abstract class BaseInnerNetObject {
  constructor(
    public readonly type: InnerNetObjectType,
    public readonly netId: number,
    public readonly parent: BaseInnerNetEntity,
  ) {}

  abstract clone(): BaseInnerNetObject;

  abstract serializeData(old: BaseInnerNetObject): DataPacket;

  abstract serializeSpawn(): SpawnPacketObject;

  sendRpcPacket(packet: BaseRpcPacket, sendTo?: Connection[]): void {
    if (sendTo === undefined || sendTo.length == 0) {
      return;
    }

    this.parent.lobby.sendRpcPacket(this, packet, sendTo);
  }
}
