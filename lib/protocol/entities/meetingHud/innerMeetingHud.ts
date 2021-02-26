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
    protected playerStates: VoteState[] = [],
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.MeetingHud, parent, netId);
  }

  getPlayerStates(): VoteState[] {
    return this.playerStates;
  }

  setPlayerStates(playerStates: VoteState[]): this {
    this.playerStates = playerStates;

    return this;
  }

  getPlayerState(playerId: number): VoteState | undefined {
    return this.playerStates[playerId];
  }

  setPlayerState(playerId: number, voteState: VoteState): this {
    this.playerStates[playerId] = voteState;

    return this;
  }

  castVote(votingPlayerId: number, suspectPlayerId: number, _sendTo?: Connection[]): void {
    this.parent.getLobby().getHostInstance().handleCastVote(votingPlayerId, suspectPlayerId);
  }

  async clearVote(players: PlayerInstance[]): Promise<void> {
    const promises = (await Promise.all(players.map(async player => {
      const event = new MeetingVoteRemovedEvent(this.parent.getLobby().getGame()!, player);

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

    return new DataPacket(this.netId, writer);
  }

  serializeSpawn(): SpawnPacketObject {
    const writer = new MessageWriter();

    for (let i = 0; i < this.playerStates.length; i++) {
      this.playerStates[i].serialize(writer);
    }

    return new SpawnPacketObject(this.netId, writer);
  }

  clone(): InnerMeetingHud {
    return new InnerMeetingHud(this.parent, this.playerStates.map(state => state.clone()), this.netId);
  }

  protected serializeStatesToDirtyBits(states: VoteState[]): number {
    let n = 0;

    for (let i = 0; i < this.playerStates.length; i++) {
      if (!shallowEqual(states[i], this.playerStates[i])) {
        n |= 1 << i;
      }
    }

    return n;
  }
}
