import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MeetingVoteRemovedEvent } from "../../../api/events/meeting";
import { notUndefined, shallowEqual } from "../../../util/functions";
import { MessageWriter } from "../../../util/hazelMessage";
import { InnerNetObjectType } from "../../../types/enums";
import { PlayerInstance } from "../../../api/player";
import { ClearVotePacket } from "../../packets/rpc";
import { BaseInnerNetObject } from "../baseEntity";
import { EntityMeetingHud } from ".";
import { VoteState } from "./types";

export class InnerMeetingHud extends BaseInnerNetObject {
  public playerStates: VoteState[] = [];

  constructor(
    netId: number,
    public readonly parent: EntityMeetingHud,
  ) {
    super(InnerNetObjectType.MeetingHud, netId, parent);
  }

  castVote(votingPlayerId: number, suspectPlayerId: number): void {
    this.parent.lobby.getHostInstance().handleCastVote(votingPlayerId, suspectPlayerId);
  }

  async clearVote(players: PlayerInstance[]): Promise<void> {
    const promises = (await Promise.all(players.map(async player => {
      const event = new MeetingVoteRemovedEvent(this.parent.lobby.getGame()!, player);

      await this.parent.lobby.getServer().emit("meeting.vote.removed", event);

      return event;
    }))).filter(event => !event.isCancelled()).map(event => {
      const connection = event.getPlayer().getConnection();
      const state = this.playerStates[event.getPlayer().getId()];

      state.didVote = false;
      state.votedFor = -1;

      return connection;
    }).filter(notUndefined);

    this.sendRpcPacket(new ClearVotePacket(), promises);
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
    const clone = new InnerMeetingHud(this.netId, this.parent);

    clone.playerStates = this.playerStates.map(state => state.clone());

    return clone;
  }

  private serializeStatesToDirtyBits(states: VoteState[]): number {
    let n = 0;

    for (let i = 0; i < this.playerStates.length; i++) {
      if (!shallowEqual(states[i], this.playerStates[i])) {
        n |= 1 << i;
      }
    }

    return n;
  }
}
