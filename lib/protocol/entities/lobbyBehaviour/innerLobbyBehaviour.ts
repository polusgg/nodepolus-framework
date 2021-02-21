import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MessageWriter } from "../../../util/hazelMessage";
import { InnerNetObjectType } from "../../../types/enums";
import { BaseInnerNetObject } from "../baseEntity";
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

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(
      this.netId,
      new MessageWriter(),
    );
  }

  clone(): InnerLobbyBehaviour {
    return new InnerLobbyBehaviour(this.netId, this.parent);
  }
}
