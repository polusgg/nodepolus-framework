import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { DataPacket } from "../../packets/gameData";
import { BaseInnerNetObject } from "../types";
import { EntityLobbyBehaviour } from ".";

export class InnerLobbyBehaviour extends BaseInnerNetObject {
  constructor(
    netId: number,
    public parent: EntityLobbyBehaviour,
  ) {
    super(InnerNetObjectType.LobbyBehaviour, netId, parent);
  }

  getData(): DataPacket {
    return new DataPacket(this.netId, new MessageWriter());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setData(_packet: MessageReader | MessageWriter): void {}

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
