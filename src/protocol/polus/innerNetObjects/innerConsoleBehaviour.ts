import { BaseInnerNetEntity, BaseInnerNetObject } from "../../entities/baseEntity";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRpcPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { RpcPacketType } from "../../../types/enums";

// TODO: Rewrite to not suck ass

export class InnerConsoleBehaviour extends BaseInnerNetObject {
  constructor(
    parent: BaseInnerNetEntity,
    public canUse: number[] = [],
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(0x82, parent, netId);
  }

  serializeData(): DataPacket {
    return new DataPacket(this.getNetId(), new MessageWriter().writeBytesAndSize(this.canUse));
  }

  setData(reader: MessageReader): void {
    this.canUse = [...reader.readBytesAndSize().getBuffer()];
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(this.getNetId(), new MessageWriter().writeBytesAndSize(this.canUse));
  }

  clone(): InnerConsoleBehaviour {
    return new InnerConsoleBehaviour(this.parent, [...this.canUse], this.netId);
  }

  getParent(): BaseInnerNetEntity {
    return this.parent;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async handleRpc(_connection: Connection, _type: RpcPacketType, _packet: BaseRpcPacket, _sendTo: Connection[]): Promise<void> { }
}
