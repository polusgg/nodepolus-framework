import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";
import { EntityGameData } from ".";
import { Connection } from "../../connection";
import { AddVotePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/addVote";

export class InnerVoteBanSystem extends BaseGameObject<InnerVoteBanSystem> {
  public votes: Map<number, number[]> = new Map<number, number[]>();

  constructor(netId: number, parent: EntityGameData) {
    super(InnerNetObjectType.VoteBanSystem, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityGameData): InnerVoteBanSystem {
    const voteBanSystem = new InnerVoteBanSystem(object.innerNetObjectID, parent);

    voteBanSystem.setSpawn(object.data);

    return voteBanSystem;
  }

  addVote(votingClientId: number, targetClientId: number, sendTo: Connection[]): void {
    const votes = this.votes.get(targetClientId);

    if (!votes) {
      throw new Error(`VoteBanSystem does not contain an entry for client ${targetClientId}`);
    }

    for (let i = 0; i < 3; i++) {
      if (votes[i] == 0) {
        votes[i] = votingClientId;
        break;
      }
    }

    this.sendRPCPacketTo(sendTo, new AddVotePacket(votingClientId, targetClientId));
  }

  getData(): DataPacket {
    const writer = new MessageWriter();

    writer.writeList(this.votes.entries(), (sub, item) => {
      sub.writeUInt32(item[0]);

      for (let i = 0; i < item[1].length; i++) {
        sub.writePackedUInt32(item[1][i]);
      }
    }, false);

    return new DataPacket(this.id, writer);
  }

  setData(packet: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromRawBytes(packet);

    reader.readList(sub => {
      const playerClientId = sub.readUInt32();
      const otherClientIds = new Array(3);

      for (let i = 0; i < 3; i++) {
        otherClientIds[i] = reader.readPackedUInt32();
      }

      this.votes.set(playerClientId, otherClientIds);
    }, false);
  }

  getSpawn(): SpawnInnerNetObject {
    return new SpawnInnerNetObject(
      this.id,
      new MessageWriter()
        .startMessage(1)
        .writeBytes(this.getData().data)
        .endMessage(),
    );
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    this.setData(MessageReader.fromMessage(data.buffer).readRemainingBytes());
  }
}
