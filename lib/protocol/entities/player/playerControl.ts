import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageWriter, MessageReader } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";

export class PlayerControl extends BaseGameObject {
  constructor(netId: number, public isNew: boolean, public playerId: number) {
    super(InnerNetObjectType.PlayerControl, netId);
  }

  getData(old: PlayerControl): DataPacket {
    let writer = new MessageWriter().writeByte(this.playerId);

    return new DataPacket(this.id, writer);
  }

  setData({ data }: DataPacket): void {
    let reader = MessageReader.fromRawBytes(data.buffer);

    this.playerId = reader.readByte();
  }

  getSpawn(): SpawnInnerNetObject {
    let writer = new MessageWriter().writeBoolean(this.isNew).writeByte(this.playerId);

    return new DataPacket(this.id, writer);
  }

  setSpawn({ data }: SpawnInnerNetObject): void {
    let reader = MessageReader.fromRawBytes(data.buffer);

    this.isNew = reader.readBoolean();
    this.playerId = reader.readByte();
  }

  static spawn(data: SpawnInnerNetObject) {
    let playerControl = new PlayerControl(
      data.innerNetObjectID,
      true, 
      0,
    );

    playerControl.setSpawn(data);

    return playerControl;
  }
}
