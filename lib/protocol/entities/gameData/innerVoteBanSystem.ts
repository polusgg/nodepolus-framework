import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data"
import { MessageWriter, MessageReader } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";
import { EntityGameData } from ".";

export class InnerVoteBanSystem extends BaseGameObject<InnerVoteBanSystem> {
  votes: Map<number, number> = new Map<number, number>()

  constructor(netId: number, parent: EntityGameData) {
    super(InnerNetObjectType.VoteBanSystem, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityGameData) {
    let voteBanSystem = new InnerVoteBanSystem(object.innerNetObjectID, parent);

    voteBanSystem.setSpawn(object.data);

    return voteBanSystem;
  }

  getData(old: InnerVoteBanSystem): DataPacket {
    let writer = new MessageWriter();

    return new DataPacket(this.id, writer);
  }

  setData(packet: MessageReader | MessageWriter): void {
    MessageReader.fromRawBytes(packet);
  }

  getSpawn(): SpawnInnerNetObject {
    let writer = new MessageWriter();

    return new DataPacket(this.id, writer);
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    MessageReader.fromMessage(data.buffer);
  }

  addVote(votingClientId: number, targetClientId: number) {
    this.votes.set(votingClientId, targetClientId)
  }
}
