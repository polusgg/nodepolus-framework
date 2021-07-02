import { BaseInnerNetEntity, BaseInnerNetObject } from "../../entities/baseEntity";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { BaseRpcPacket } from "../../packets/rpc";
import { MessageWriter } from "../../../util/hazelMessage";
import { Connection } from "../../connection";
import { RpcPacketType } from "../../../types/enums";
import { EntityPointOfInterest } from "../entities";

export class InnerPointOfInterest extends BaseInnerNetObject {
  constructor(
    parent: BaseInnerNetEntity,
    netId: number = parent.getLobby()!.getHostInstance().getNextNetId(),
  ) {
    super(0x86, parent, netId);
  }

  getParent(): EntityPointOfInterest {
    return this.parent as EntityPointOfInterest;
  }

  clone(): InnerPointOfInterest {
    return new InnerPointOfInterest(this.parent, this.netId);
  }

  serializeData(): DataPacket {
    return new DataPacket(this.netId, new MessageWriter());
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(this.netId, new MessageWriter());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleRpc(_connection: Connection, _type: RpcPacketType, _packet: BaseRpcPacket, _sendTo?: Connection[]): void { }
}
