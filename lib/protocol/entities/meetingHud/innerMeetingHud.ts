import { ClosePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/close";
import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageWriter, MessageReader } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";
import { EntityMeetingHud } from ".";
import { VotingCompletePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/votingComplete";
import { CastVotePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/castVote";
import { Connection } from "../../connection";
import { ClearVotePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/clearVote";

export enum VoteStateMask {
  DidReport = 0x20,
  DidVote = 0x40,
  IsDead = 0x80,
  VotedFor = 0x0f,
}

export class VoteState {
  constructor(
    public didReport: boolean,
    public didVote: boolean,
    public isDead: boolean,
    public votedFor?: number,
  ) {}

  static deserialize(reader: MessageReader): VoteState {
    let state = reader.readByte();

    return new VoteState(
      (state & VoteStateMask.DidReport) == VoteStateMask.DidReport,
      (state & VoteStateMask.DidVote) == VoteStateMask.DidVote,
      (state & VoteStateMask.IsDead) == VoteStateMask.IsDead,
      (state & VoteStateMask.VotedFor) - 1,
    );
  }

  serialize(writer: MessageWriter) {
    writer.writeByte(
      (this.didReport ? VoteStateMask.DidReport : 0) |
      (this.didVote ? VoteStateMask.DidVote : 0) |
      (this.isDead ? VoteStateMask.IsDead : 0) |
      (((this.votedFor || -1) + 1) & VoteStateMask.VotedFor)
    );
  }
}

export class InnerMeetingHud extends BaseGameObject<InnerMeetingHud> {
  public playerStates: VoteState[] = [];
  public ended: boolean = false;
  public isTie?: boolean;
  public exiledPlayer?: number;

  constructor(netId: number, parent: EntityMeetingHud) {
    super(InnerNetObjectType.MeetingHud, netId, parent);
  }

  private serializeStatesToDirtyBits(states: VoteState[]): number {
    let n = 0;

    for (let i = 0; i < this.playerStates.length; i++) {
      if (states[i] != this.playerStates[i]) {
        n |= 1 << i;
      }
    }
    
    return n;
  }

  private deserializeDirtyBitsToStates(dirtyBits: number): number[] {
    let voteStates = [];
    
    for (let i = 0; i < this.playerStates.length; i++) {
      if ((dirtyBits & (1 << i)) != 0) {
        voteStates.push(i);
      }
    }

    return voteStates;
  }
  
  getData(old: InnerMeetingHud): DataPacket {
    let writer = new MessageWriter();
    let dirtyBits = this.serializeStatesToDirtyBits(old.playerStates);
    
    writer.writePackedUInt32(dirtyBits);

    for (let i = 0; i < this.playerStates.length; i++) {
      let state = this.playerStates[i];

      if (state == old.playerStates[i]) {
        continue;
      }

      state.serialize(writer);
    }
    
    return new DataPacket(this.id, writer);
  }
  
  setData(packet: MessageReader | MessageWriter): void {
    let data = MessageReader.fromRawBytes(packet);
    let dirtyStates = this.deserializeDirtyBitsToStates(data.readPackedUInt32());
    
    for (let i = 0; i < dirtyStates.length; i++) {
      this.playerStates[dirtyStates[i]] = VoteState.deserialize(data);
    }
  }
  
  getSpawn(): SpawnInnerNetObject {
    let writer = new MessageWriter();
    
    for (let i = 0; i < this.playerStates.length; i++) {
      this.playerStates[i].serialize(writer);
    }

    return new SpawnInnerNetObject(this.id, writer);
  }
  
  setSpawn(data: MessageReader | MessageWriter): void {
    let reader = MessageReader.fromRawBytes(data.buffer);

    for (let i = 0; i < data.length; i++) {
      this.playerStates[i] = VoteState.deserialize(reader);
    }
  }
  
  static spawn(object: SpawnInnerNetObject, parent: EntityMeetingHud) {
    let meetingHud = new InnerMeetingHud(
      object.innerNetObjectID,
      parent,
    );
    
    meetingHud.setSpawn(object.data);
    
    return meetingHud;
  }

  close() {
    this.sendRPCPacket(new ClosePacket())
  }

  votingComplete(voteStates: VoteState[], isTie: boolean, exiledPlayerId?: number) {
    this.playerStates = voteStates;
    this.ended = true;
    this.isTie = isTie;
    this.exiledPlayer = exiledPlayerId;

    this.sendRPCPacket(new VotingCompletePacket(voteStates, isTie, exiledPlayerId))
  }

  castVote(votingPlayerId: number, suspectPlayerId: number) {
    this.playerStates[votingPlayerId].votedFor = suspectPlayerId;
    this.playerStates[votingPlayerId].didVote = true;

    this.sendRPCPacket(new CastVotePacket(votingPlayerId, suspectPlayerId))
  }

  clearVote(player: Connection[]) {
    this.sendRPCPacketTo(player, new ClearVotePacket())
  }
}
