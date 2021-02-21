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

  abstract serializeData(old: BaseInnerNetObject): DataPacket;

  abstract serializeSpawn(): SpawnInnerNetObject;

  sendRpcPacket(packet: BaseRpcPacket, to: Connection[]): void {
    if (to.length == 0) {
      return;
    }

    this.parent.lobby.sendRpcPacket(this, packet, to);
  }
}
