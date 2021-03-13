import { InnerNetObjectType, RpcPacketType } from "../../../types/enums";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { LobbyInstance } from "../../../api/lobby";
import { BaseRpcPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { BaseInnerNetEntity } from ".";

export abstract class BaseInnerNetObject {
  constructor(
    protected readonly type: InnerNetObjectType,
    protected readonly parent: BaseInnerNetEntity,
    protected readonly netId: number,
  ) {}

  abstract handleRpc(connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, sendTo: Connection[]): void;

  abstract getParent(): BaseInnerNetEntity;

  abstract serializeData(old: BaseInnerNetObject): DataPacket;

  abstract serializeSpawn(): SpawnPacketObject;

  abstract clone(): BaseInnerNetObject;

  getType(): InnerNetObjectType {
    return this.type;
  }

  getNetId(): number {
    return this.netId;
  }

  sendRpcPacket(packet: BaseRpcPacket, sendTo?: Connection[]): void {
    if (sendTo === undefined || sendTo.length == 0) {
      return;
    }

    this.parent.getLobby().sendRpcPacket(this, packet, sendTo);
  }

  getLobby(): LobbyInstance {
    return this.parent.getLobby();
  }

  getOwnerId(): number {
    return this.parent.getOwnerId();
  }
}
