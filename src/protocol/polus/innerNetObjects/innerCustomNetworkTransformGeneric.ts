import { BaseInnerNetEntity, BaseInnerNetObject } from "../../entities/baseEntity";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { InnerCustomNetworkTransform } from "../../entities/player";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { InnerNetObjectType, RpcPacketType } from "../../../types/enums";
import { Connection } from "../../connection";
import { BaseRpcPacket } from "../../packets/rpc";
import { CNTSnapToPacket } from "../packets/rpc/customNetworkTransform";
import { EdgeAlignments } from "../../../types/enums/edgeAlignment";
import { Player } from "../../../player";
import { Attachable, Vector2 } from "../../../types";

export class InnerCustomNetworkTransformGeneric extends BaseInnerNetObject {
  constructor(
    protected readonly parent: BaseInnerNetEntity,
    protected alignment: EdgeAlignments = EdgeAlignments.None,
    protected position: Vector2 = Vector2.zero(),
    protected z: number = 0,
    protected attachedTo: number = -1,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.CustomNetworkTransform, parent, netId);
  }

  getPosition(): Vector2 {
    return this.position;
  }

  setPosition(position: Vector2): this {
    this.position = position;

    return this;
  }

  getZ(): number {
    return this.z;
  }

  setZ(z: number): this {
    this.z = z;

    return this;
  }

  getAlignment(): EdgeAlignments {
    return this.alignment;
  }

  setAlignment(alignment: EdgeAlignments): this {
    this.alignment = alignment;

    return this;
  }

  snapTo(position: Vector2, sendTo?: Connection[]): void {
    this.position = position;
    this.sendRpcPacket(new CNTSnapToPacket(position), sendTo);
  }

  async handleRpc(_connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, sendTo: Connection[]): Promise<void> {
    switch (type) {
      case RpcPacketType.SnapTo:
        await this.snapTo((packet as CNTSnapToPacket).position, sendTo);
        break;
      default:
        break;
    }
  }

  getParent(): BaseInnerNetEntity {
    return this.parent;
  }

  serializeData(): DataPacket {
    const writer = new MessageWriter()
      .writeByte(this.alignment)
      .writeVector2(this.position)
      .writeFloat32(this.z)
      .writePackedInt32(this.attachedTo);

    return new DataPacket(
      this.netId,
      writer,
    );
  }

  setData(packet: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromRawBytes(packet.getBuffer());

    this.position = reader.readVector2();
    this.attachedTo = reader.readPackedInt32();
  }

  serializeSpawn(): SpawnPacketObject {
    const writer = new MessageWriter()
      .writeByte(this.alignment)
      .writeVector2(this.position)
      .writeFloat32(this.z)
      .writePackedInt32(this.attachedTo);

    return new SpawnPacketObject(
      this.netId,
      writer,
    );
  }

  clone(): InnerCustomNetworkTransformGeneric {
    return new InnerCustomNetworkTransformGeneric(this.parent, this.alignment, this.position, this.z, this.attachedTo, this.netId);
  }

  setAttachedTo(object: Attachable): this {
    this.attachedTo = this.findOwner(object);

    return this;
  }

  protected findOwner(object: Attachable): number {
    if (object instanceof Player) {
      return object.getEntity().getCustomNetworkTransform().getNetId();
    }

    if (object instanceof BaseInnerNetEntity) {
      return object.getCustomNetworkTransform().getNetId();
    }

    if (object instanceof InnerCustomNetworkTransform || object instanceof InnerCustomNetworkTransformGeneric) {
      return object.getNetId();
    }

    console.log(object);
    throw new Error("Could not find owner of object");
  }
}
