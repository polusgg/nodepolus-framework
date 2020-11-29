import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageWriter, MessageReader } from "../../../util/hazelMessage";
import { Vector2 } from "../../../util/vector2";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";
import { EntityPlayer } from ".";
import { SnapToPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/snapTo";

export class InnerCustomNetworkTransform extends BaseGameObject<InnerCustomNetworkTransform> {
  constructor(public netId: number, public parent: EntityPlayer, public sequenceId: number, public position: Vector2, public velocity: Vector2) {
    super(InnerNetObjectType.CustomNetworkTransform, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityPlayer) {
    let customNetworkTransform = new InnerCustomNetworkTransform(
      object.innerNetObjectID,
      parent,
      0,
      new Vector2(0, 0),
      new Vector2(0, 0),
    );

    customNetworkTransform.setSpawn(object.data);

    return customNetworkTransform;
  }

  getData(old: InnerCustomNetworkTransform): DataPacket {
    let writer = new MessageWriter().writeUInt16(this.sequenceId);

    this.position.serialize(writer);
    this.velocity.serialize(writer);

    return new DataPacket(this.id, writer);
  }

  setData(packet: MessageReader | MessageWriter): void {
    let reader = MessageReader.fromRawBytes(packet.buffer);

    this.sequenceId = reader.readUInt16();
    this.position = Vector2.deserialize(reader);
    this.velocity = Vector2.deserialize(reader);
  }

  getSpawn(): SpawnInnerNetObject {
    return this.getData(this);
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    this.setData(data);
  }

  snapTo(position: Vector2, lastSequenceId: number) {
    this.position = position;
    this.velocity = new Vector2(0, 0);

    this.sendRPCPacket(new SnapToPacket(position, lastSequenceId))
  }
}
