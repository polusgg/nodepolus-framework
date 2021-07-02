import { Connection } from "../../connection";
import { BaseInnerNetEntity, BaseInnerNetObject } from "../../entities/baseEntity";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { BaseRpcPacket } from "../../packets/rpc";
import { RpcPacketType } from "../../../types/enums";
import { MessageWriter } from "../../../util/hazelMessage";
import { EntityVent } from "../entities/entityVent";

export class InnerVent extends BaseInnerNetObject {
  constructor(
    parent: BaseInnerNetEntity,
    netId: number,
    protected spriteResourceId: number,
    protected enterVentResourceId: number,
    protected exitVentResourceId: number,
    protected id: number,
    protected leftConnection: number = 0xFF,
    protected rightConnection: number = 0xFF,
    protected centerConnection: number = 0xFF,
  ) {
    super(0x88, parent, netId);
  }

  clone(): InnerVent {
    return new InnerVent(this.parent, this.netId, this.spriteResourceId, this.enterVentResourceId, this.exitVentResourceId, this.id, this.leftConnection, this.rightConnection, this.centerConnection);
  }

  serializeData(): DataPacket {
    return new DataPacket(
      this.netId,
      new MessageWriter()
        .writePackedUInt32(this.spriteResourceId)
        .writePackedUInt32(this.enterVentResourceId)
        .writePackedUInt32(this.exitVentResourceId)
        .writeBytes([
          this.id,
          this.leftConnection,
          this.rightConnection,
          this.centerConnection,
        ]),
    );
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(this.netId, this.serializeData().data);
  }

  getParent(): EntityVent {
    return this.parent as EntityVent;
  }

  handleRpc(_connection: Connection, _type: RpcPacketType, _packet: BaseRpcPacket, _sendTo: Connection[]): void {
    throw new Error("Unexpected RPC on InnerSoundSource");
  }
}
