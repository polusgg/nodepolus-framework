import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { DataPacket } from "../../packets/gameData";
import { SnapToPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { BaseGameObject } from "../types";
import { Vector2 } from "../../../types";
import { EntityPlayer } from ".";

export class InnerCustomNetworkTransform extends BaseGameObject<InnerCustomNetworkTransform> {
  constructor(public netId: number, public parent: EntityPlayer, public sequenceId: number, public position: Vector2, public velocity: Vector2) {
    super(InnerNetObjectType.CustomNetworkTransform, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityPlayer): InnerCustomNetworkTransform {
    const customNetworkTransform = new InnerCustomNetworkTransform(
      object.innerNetObjectID,
      parent,
      0,
      new Vector2(0, 0),
      new Vector2(0, 0),
    );

    customNetworkTransform.setSpawn(object.data);

    return customNetworkTransform;
  }

  snapTo(position: Vector2, lastSequenceId: number, sendTo: Connection[]): void {
    this.position = position;
    this.velocity = new Vector2(0, 0);

    this.sendRPCPacketTo(sendTo, new SnapToPacket(position, lastSequenceId));
  }

  getData(): DataPacket {
    const writer = new MessageWriter().writeUInt16(this.sequenceId);

    this.position.serialize(writer);
    this.velocity.serialize(writer);

    return new DataPacket(this.netId, writer);
  }

  setData(packet: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromRawBytes(packet.buffer);

    this.sequenceId = reader.readUInt16();
    this.position = Vector2.deserialize(reader);
    this.velocity = Vector2.deserialize(reader);
  }

  getSpawn(): SpawnInnerNetObject {
    const writer = new MessageWriter()
      .startMessage(1)
      .writeUInt16(this.sequenceId);

    this.position.serialize(writer);
    this.velocity.serialize(writer);

    return new DataPacket(this.netId, writer.endMessage());
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    this.setData(MessageReader.fromMessage(data.buffer).readRemainingBytes());
  }

  clone(): InnerCustomNetworkTransform {
    return new InnerCustomNetworkTransform(this.netId, this.parent, this.sequenceId, this.position, this.velocity);
  }
}
