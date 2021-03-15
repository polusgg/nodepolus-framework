import { BaseRpcPacket, CastVotePacket, ClearVotePacket } from "../../packets/rpc";
import { InnerNetObjectType, RpcPacketType } from "../../../types/enums";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MeetingVoteRemovedEvent } from "../../../api/events/meeting";
import { notUndefined, shallowEqual } from "../../../util/functions";
import { MessageWriter } from "../../../util/hazelMessage";
import { PlayerInstance } from "../../../api/player";
import { BaseInnerNetObject } from "../baseEntity";
import { Connection } from "../../connection";
import { VoteState } from "../../../types";
import { EntityMeetingHud } from ".";

export class InnerMeetingHud extends BaseInnerNetObject {
  constructor(
    protected readonly parent: EntityMeetingHud,
    protected playerStates: Map<number, VoteState> = new Map(),
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.MeetingHud, parent, netId);
  }

  getPlayerStates(): Map<number, VoteState> {
    return this.playerStates;
  }

  setPlayerStates(playerStates: Map<number, VoteState>): this {
    this.playerStates = playerStates;

    return this;
  }

  clearPlayerStates(): this {
    this.playerStates.clear();

    return this;
  }

  getPlayerState(playerId: number): VoteState | undefined {
    return this.playerStates.get(playerId);
  }

  setPlayerState(playerId: number, voteState: VoteState): this {
    this.playerStates.set(playerId, voteState);

    return this;
  }

  removePlayerState(playerId: number): this {
    this.playerStates.delete(playerId);

    return this;
  }

  castVote(votingPlayerId: number, suspectPlayerId: number, _sendTo?: Connection[]): void {
    this.parent.getLobby().getHostInstance().handleCastVote(votingPlayerId, suspectPlayerId);
  }

  async clearVote(players: PlayerInstance[]): Promise<void> {
    const promises = (await Promise.all(players.map(async player => {
      const event = new MeetingVoteRemovedEvent(this.parent.getLobby().getSafeGame(), player);

      await this.parent.getLobby().getServer().emit("meeting.vote.removed", event);

      return event;
    }))).filter(event => !event.isCancelled()).map(event => {
      const connection = event.getPlayer().getConnection();
      const state = this.playerStates[event.getPlayer().getId()];

      state.setVoted(false);
      state.setVotedFor(-1);

      return connection;
    }).filter(notUndefined);

    this.sendRpcPacket(new ClearVotePacket(), promises);
    // TODO: Do we need to also send a data packet to set the DidVote and VotedFor fields back to empty?
  }

  handleRpc(connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, sendTo: Connection[]): void {
    switch (type) {
      case RpcPacketType.CastVote: {
        const data = packet as CastVotePacket;

        this.castVote(data.votingPlayerId, data.suspectPlayerId, sendTo);
        break;
      }
      case RpcPacketType.ClearVote:
        this.parent.getLobby().getLogger().warn("Received ClearVote packet from connection %s in a server-as-host state", connection);
        break;
      default:
        break;
    }
  }

  getParent(): EntityMeetingHud {
    return this.parent;
  }

  serializeData(old: InnerMeetingHud): DataPacket {
    const writer = new MessageWriter().writePackedUInt32(this.serializeStatesToDirtyBits(old.playerStates));

    for (const [id, state] of this.playerStates) {
      if (!shallowEqual(state, old.playerStates.get(id))) {
        writer.writeObject(state);
      }
    }

    return new DataPacket(this.netId, writer);
  }

  serializeSpawn(): SpawnPacketObject {
    const writer = new MessageWriter();
    const limit = Math.max(...this.playerStates.keys());

    for (let i = 0; i <= limit; i++) {
      const state = this.playerStates.get(i);

      if (state === undefined) {
        writer.writeByte(0x00);
      } else {
        writer.writeObject(state);
      }
    }

    return new SpawnPacketObject(this.netId, writer);
  }

  clone(): InnerMeetingHud {
    return new InnerMeetingHud(this.parent, new Map(Array.from(this.playerStates, ([id, state]) => [id, state.clone()])), this.netId);
  }

  protected serializeStatesToDirtyBits(states: Map<number, VoteState>): number {
    let dirtyBits = 0;

    for (const [id, state] of this.playerStates) {
      if (!shallowEqual(state, states.get(id))) {
        dirtyBits |= 1 << id;
      }
    }

    return dirtyBits;
  }
}
