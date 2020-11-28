import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageWriter } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";

export class PlayerPhysics extends BaseGameObject {
  constructor(netId: number) {
    super(InnerNetObjectType.PlayerPhysics, netId);
  }

  getData(old: PlayerPhysics): DataPacket {
    return new DataPacket(this.id, new MessageWriter());
  }

  setData({ data }: DataPacket): void {}

  getSpawn(): SpawnInnerNetObject {
    return new DataPacket(this.id, new MessageWriter());
  }

  setSpawn({ data }: SpawnInnerNetObject): void {}

  static spawn(data: SpawnInnerNetObject) {
    let playerControl = new PlayerPhysics(data.innerNetObjectID);

    playerControl.setSpawn(data);

    return playerControl;
  }
}
