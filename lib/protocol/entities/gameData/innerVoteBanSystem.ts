import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { DataPacket } from "../../packets/gameData";
import { AddVotePacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { BaseInnerNetObject } from "../types";
import { EntityGameData } from ".";

export class InnerVoteBanSystem extends BaseInnerNetObject {
  public votes: Map<number, number[]> = new Map<number, number[]>();

  constructor(
    netId: number,
    public parent: EntityGameData,
  ) {
    super(InnerNetObjectType.VoteBanSystem, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityGameData): InnerVoteBanSystem {
    const voteBanSystem = new InnerVoteBanSystem(object.innerNetObjectID, parent);

    voteBanSystem.setSpawn(object.data);

    return voteBanSystem;
  }

  addVote(votingClientId: number, targetClientId: number, sendTo: Connection[]): void {
    const votes = this.votes.get(targetClientId) ?? [];

    // if (!votes) {
    //   // throw new Error(`VoteBanSystem does not contain an entry for client ${targetClientId}`);
    //   this.votes.set(targetClientId, []);
    // }

    for (let i = 0; i < 3; i++) {
      if (votes[i] == 0) {
        votes[i] = votingClientId;
        break;
      }
    }

    this.votes.set(targetClientId, votes);

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

    return new DataPacket(this.netId, writer);
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
      this.netId,
      new MessageWriter()
        .startMessage(1)
        .writeBytes(this.getData().data)
        .endMessage(),
    );
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    this.setData(MessageReader.fromMessage(data.buffer).readRemainingBytes());
  }

  clone(): InnerVoteBanSystem {
    const clone = new InnerVoteBanSystem(this.netId, this.parent);

    clone.votes = new Map(this.votes);

    return clone;
  }
}
