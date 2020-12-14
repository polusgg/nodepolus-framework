import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";
import { EntityLobbyBehaviour } from ".";

export class InnerLobbyBehaviour extends BaseGameObject<InnerLobbyBehaviour> {
  constructor(netId: number, public parent: EntityLobbyBehaviour) {
    super(InnerNetObjectType.LobbyBehaviour, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityLobbyBehaviour): InnerLobbyBehaviour {
    const lobbyBehaviour = new InnerLobbyBehaviour(object.innerNetObjectID, parent);

    lobbyBehaviour.setSpawn(object.data);

    return lobbyBehaviour;
  }

  getData(): DataPacket {
    return new DataPacket(this.id, new MessageWriter());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setData(_packet: MessageReader | MessageWriter): void {}

  getSpawn(): SpawnInnerNetObject {
    return new DataPacket(
      this.id,
      new MessageWriter().startMessage(1).endMessage(),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSpawn(_data: MessageReader | MessageWriter): void {}

  clone(): InnerLobbyBehaviour {
    return new InnerLobbyBehaviour(this.id, this.parent);
  }
}
