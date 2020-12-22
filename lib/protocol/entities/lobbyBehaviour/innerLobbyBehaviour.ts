import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { DataPacket } from "../../packets/gameData";
import { BaseGameObject } from "../types";
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
    return new DataPacket(this.netId, new MessageWriter());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setData(_packet: MessageReader | MessageWriter): void {}

  getSpawn(): SpawnInnerNetObject {
    return new DataPacket(
      this.netId,
      new MessageWriter().startMessage(1).endMessage(),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSpawn(_data: MessageReader | MessageWriter): void {}

  clone(): InnerLobbyBehaviour {
    return new InnerLobbyBehaviour(this.netId, this.parent);
  }
}
