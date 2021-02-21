import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { MessageWriter } from "../../../util/hazelMessage";
import { InnerNetObjectType } from "../types/enums";
import { DataPacket } from "../../packets/gameData";
import { BaseInnerNetObject } from "../types";
import { EntityLobbyBehaviour } from ".";

export class InnerLobbyBehaviour extends BaseInnerNetObject {
  constructor(
    netId: number,
    public readonly parent: EntityLobbyBehaviour,
  ) {
    super(InnerNetObjectType.LobbyBehaviour, netId, parent);
  }

  serializeData(): DataPacket {
    return new DataPacket(this.netId, new MessageWriter());
  }

  serializeSpawn(): SpawnInnerNetObject {
    return new SpawnInnerNetObject(
      this.netId,
      new MessageWriter(),
    );
  }

  clone(): InnerLobbyBehaviour {
    return new InnerLobbyBehaviour(this.netId, this.parent);
  }
}
