import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageWriter, MessageReader } from "../../../util/hazelMessage";
import { Vector2 } from "../../../util/vector2";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";

export class CustomNetworkTransform extends BaseGameObject {
  constructor(public netId: number, public sequenceId: number, public position: Vector2, public velocity: Vector2) {
    super(InnerNetObjectType.CustomNetworkTransform, netId);
  }

  getData(old: CustomNetworkTransform): DataPacket {
    let writer = new MessageWriter().writeUInt16(this.sequenceId);

    this.position.serialize(writer);
    this.velocity.serialize(writer);

    return new DataPacket(this.id, writer);
  }

  setData({ data }: DataPacket): void {
    let reader = MessageReader.fromRawBytes(data.buffer);

    this.sequenceId = reader.readUInt16();
    this.position = Vector2.deserialize(reader);
    this.velocity = Vector2.deserialize(reader);
  }

  getSpawn(): SpawnInnerNetObject {
    return this.getData(this);
  }

  setSpawn(data: SpawnInnerNetObject): void {
    this.setData(data)
  }

  static spawn(data: SpawnInnerNetObject) {
    let customNetworkTransform = new CustomNetworkTransform(
      data.innerNetObjectID,
      0,
      new Vector2(0,0),
      new Vector2(0,0),
    );

    customNetworkTransform.setSpawn(data);

    return customNetworkTransform;
  }
}
