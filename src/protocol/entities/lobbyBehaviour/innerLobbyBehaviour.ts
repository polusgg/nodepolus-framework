import { InnerNetObjectType, RpcPacketType } from "../../../types/enums";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MessageWriter } from "../../../util/hazelMessage";
import { BaseInnerNetObject } from "../baseEntity";
import { BaseRpcPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { EntityLobbyBehaviour } from ".";

export class InnerLobbyBehaviour extends BaseInnerNetObject {
  constructor(
    protected readonly parent: EntityLobbyBehaviour,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.LobbyBehaviour, parent, netId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  handleRpc(connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, sendTo: Connection[]): void {}

  getParent(): EntityLobbyBehaviour {
    return this.parent;
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
    return new InnerLobbyBehaviour(this.parent, this.netId);
  }
}
