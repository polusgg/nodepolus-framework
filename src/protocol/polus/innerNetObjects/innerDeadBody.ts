import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { BaseInnerNetObject } from "../../entities/baseEntity";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRpcPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { EntityDeadBody } from "../entities";
import { BodyDirection, RpcPacketType } from "../../../types/enums";

// TODO: Rewrite to not suck ass

export class InnerDeadBody extends BaseInnerNetObject {
  constructor(
    parent: EntityDeadBody,
    public color: [number, number, number, number],
    public shadowColor: [number, number, number, number],
    public hasFallen: boolean = false,
    public bodyFacing: BodyDirection = BodyDirection.FacingLeft,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(0x81, parent, netId);
  }

  serializeData(): DataPacket {
    return new DataPacket(
      this.netId,
      new MessageWriter()
        .writeBoolean(this.hasFallen)
        .writeByte(this.bodyFacing)
        .writeBytes(this.color)
        .writeBytes(this.shadowColor),
    );
  }

  getParent(): EntityDeadBody {
    return this.parent as EntityDeadBody;
  }

  setData(packet: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromRawBytes(packet);

    this.hasFallen = reader.readBoolean();
    this.bodyFacing = reader.readBoolean() ? BodyDirection.FacingRight : BodyDirection.FacingLeft;
    this.color = [...reader.readBytes(4).getBuffer()] as [number, number, number, number];
    this.shadowColor = [...reader.readBytes(4).getBuffer()] as [number, number, number, number];
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(
      this.netId,
      new MessageWriter()
        .writeBoolean(this.hasFallen)
        .writeByte(this.bodyFacing)
        .writeBytes(this.color)
        .writeBytes(this.shadowColor),
    );
  }

  clone(): InnerDeadBody {
    return new InnerDeadBody(this.getParent(), this.color, this.shadowColor, this.hasFallen, this.bodyFacing, this.netId);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleRpc(_connection: Connection, _type: RpcPacketType, _packet: BaseRpcPacket, _sendTo: Connection[]): void {}
}
