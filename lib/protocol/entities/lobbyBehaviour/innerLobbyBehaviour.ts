import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageWriter, MessageReader } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";
import { EntityLobbyBehaviour } from ".";

export class InnerLobbyBehaviour extends BaseGameObject<InnerLobbyBehaviour> {
  constructor(netId: number, parent: EntityLobbyBehaviour) {
    super(InnerNetObjectType.LobbyBehaviour, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityLobbyBehaviour) {
    let playerControl = new InnerLobbyBehaviour(object.innerNetObjectID, parent);

    playerControl.setSpawn(object.data);

    return playerControl;
  }

  getData(old: InnerLobbyBehaviour): DataPacket {
    return new DataPacket(this.id, new MessageWriter());
  }

  setData(packet: MessageReader | MessageWriter): void {}

  getSpawn(): SpawnInnerNetObject {
    return new DataPacket(this.id, new MessageWriter());
  }

  setSpawn(data: MessageReader | MessageWriter): void {}
}
