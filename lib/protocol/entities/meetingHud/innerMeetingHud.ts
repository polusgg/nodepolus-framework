import { VotingCompletePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/votingComplete";
import { ClearVotePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/clearVote";
import { CastVotePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/castVote";
import { ClosePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/close";
import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { shallowEqual } from "../../../util/functions";
import { BaseGameObject } from "../baseEntity";
import { Connection } from "../../connection";
import { InnerNetObjectType } from "../types";
import { CustomHost } from "../../../host";
import { EntityMeetingHud } from ".";

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
    public votedFor: number,
  ) {}

  static deserialize(reader: MessageReader): VoteState {
    const state = reader.readByte();

    return new VoteState(
      (state & VoteStateMask.DidReport) == VoteStateMask.DidReport,
      (state & VoteStateMask.DidVote) == VoteStateMask.DidVote,
      (state & VoteStateMask.IsDead) == VoteStateMask.IsDead,
      (state & VoteStateMask.VotedFor) - 1,
    );
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(
      (this.didReport ? VoteStateMask.DidReport : 0) |
      (this.didVote ? VoteStateMask.DidVote : 0) |
      (this.isDead ? VoteStateMask.IsDead : 0) |
      ((this.votedFor + 1) & VoteStateMask.VotedFor),
    );
  }

  clone(): VoteState {
    return new VoteState(this.didReport, this.didVote, this.isDead, this.votedFor);
  }
}

export class InnerMeetingHud extends BaseGameObject<InnerMeetingHud> {
  public playerStates: VoteState[] = [];
  public ended = false;
  public isTie = false;
  public exiledPlayer = 0xff;

  constructor(public netId: number, public parent: EntityMeetingHud) {
    super(InnerNetObjectType.MeetingHud, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityMeetingHud): InnerMeetingHud {
    const meetingHud = new InnerMeetingHud(object.innerNetObjectID, parent);

    meetingHud.setSpawn(object.data);

    return meetingHud;
  }

  close(sendTo: Connection[]): void {
    this.sendRPCPacketTo(sendTo, new ClosePacket());
  }

  votingComplete(voteStates: VoteState[], didVotePlayerOff: boolean, exiledPlayerId: number, isTie: boolean, sendTo: Connection[]): void {
    if (this.parent.room.isHost) {
      for (let i = 0; i < voteStates.length; i++) {
        this.playerStates[i] = voteStates[i];
      }
    }

    this.ended = true;
    this.isTie = isTie;
    this.exiledPlayer = didVotePlayerOff ? exiledPlayerId : 0xff;

    this.sendRPCPacketTo(sendTo, new VotingCompletePacket(this.playerStates, this.exiledPlayer, this.isTie));
  }

  castVote(votingPlayerId: number, suspectPlayerId: number): void {
    if (this.parent.room.isHost) {
      (this.parent.room.host as CustomHost).handleCastVote(votingPlayerId, suspectPlayerId);
    } else {
      this.sendRPCPacketTo([this.parent.room.host as Connection], new CastVotePacket(votingPlayerId, suspectPlayerId));
    }
  }

  clearVote(player: Connection[]): void {
    this.sendRPCPacketTo(player, new ClearVotePacket());
  }

  getData(old: InnerMeetingHud): DataPacket {
    const writer = new MessageWriter();
    const dirtyBits = this.serializeStatesToDirtyBits(old.playerStates);

    writer.writePackedUInt32(dirtyBits);

    for (let i = 0; i < this.playerStates.length; i++) {
      const state = this.playerStates[i];

      if (shallowEqual(state, old.playerStates[i])) {
        continue;
      }

      state.serialize(writer);
    }

    return new DataPacket(this.id, writer);
  }

  setData(packet: MessageReader | MessageWriter): void {
    const data = MessageReader.fromRawBytes(packet);
    const dirtyStates = this.deserializeDirtyBitsToStates(data.readPackedUInt32());

    for (let i = 0; i < dirtyStates.length; i++) {
      this.playerStates[dirtyStates[i]] = VoteState.deserialize(data);
    }
  }

  getSpawn(): SpawnInnerNetObject {
    const writer = new MessageWriter();

    for (let i = 0; i < this.playerStates.length; i++) {
      this.playerStates[i].serialize(writer);
    }

    return new SpawnInnerNetObject(this.id, writer);
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromMessage(data.buffer);

    for (let i = 0; i < data.length; i++) {
      this.playerStates[i] = VoteState.deserialize(reader);
    }
  }

  clone(): InnerMeetingHud {
    const clone = new InnerMeetingHud(this.id, this.parent);

    clone.playerStates = this.playerStates.map(state => state.clone());

    return clone;
  }

  private serializeStatesToDirtyBits(states: VoteState[]): number {
    let n = 0;

    for (let i = 0; i < this.playerStates.length; i++) {
      if (!shallowEqual(states[i], this.playerStates[i])) {
        // console.log(states[i], this.playerStates[i], 1 << i);
        n |= 1 << i;
      }
    }

    return n;
  }

  private deserializeDirtyBitsToStates(dirtyBits: number): number[] {
    const voteStates: number[] = [];

    for (let i = 0; i < this.playerStates.length; i++) {
      if ((dirtyBits & (1 << i)) != 0) {
        voteStates.push(i);
      }
    }

    return voteStates;
  }
}
