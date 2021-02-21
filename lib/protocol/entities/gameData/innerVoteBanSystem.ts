import { PlayerVotekickAddedEvent, PlayerVotekickRemovedEvent } from "../../../api/events/player";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MessageWriter } from "../../../util/hazelMessage";
import { InnerNetObjectType } from "../../../types/enums";
import { GameDataPacket } from "../../packets/root";
import { BaseInnerNetObject } from "../baseEntity";
import { AddVotePacket } from "../../packets/rpc";
import { DisconnectReason } from "../../../types";
import { InternalPlayer } from "../../../player";
import { InternalLobby } from "../../../lobby";
import { Connection } from "../../connection";
import { EntityGameData } from ".";

export class InnerVoteBanSystem extends BaseInnerNetObject {
  public votes: Map<number, number[]> = new Map<number, number[]>();

  constructor(
    netId: number,
    public readonly parent: EntityGameData,
  ) {
    super(InnerNetObjectType.VoteBanSystem, netId, parent);
  }

  async addVote(voter: InternalPlayer, target: InternalPlayer, sendTo: Connection[]): Promise<void> {
    const event = new PlayerVotekickAddedEvent(voter, target);

    await this.parent.lobby.getServer().emit("player.votekick.added", event);

    if (event.isCancelled()) {
      return;
    }

    const votes = this.votes.get(target.entity.owner) ?? [0, 0, 0];
    let shouldKick = false;

    for (let i = 0; i < 3; i++) {
      if (votes[i] == 0) {
        votes[i] = voter.entity.owner;

        if (i == 2) {
          shouldKick = true;
        }
        break;
      }
    }

    if (shouldKick) {
      const player = this.parent.lobby.findPlayerByClientId(target.entity.owner);

      if (player) {
        player.kick(DisconnectReason.kicked());
        (this.parent.lobby as InternalLobby).sendRootGamePacket(new GameDataPacket([this.serializeData()], this.parent.lobby.getCode()), sendTo);
      }
    } else {
      this.votes.set(target.entity.owner, votes);

      this.sendRpcPacket(new AddVotePacket(voter.entity.owner, target.entity.owner), sendTo);
    }
  }

  async clearVote(voter: InternalPlayer, target: InternalPlayer, sendTo: Connection[]): Promise<void> {
    const event = new PlayerVotekickRemovedEvent(voter, target);

    await this.parent.lobby.getServer().emit("player.votekick.removed", event);

    if (event.isCancelled()) {
      return;
    }

    this.removeVote(voter.entity.owner, target.entity.owner, sendTo);
  }

  clearVotesForPlayer(player: InternalPlayer, sendTo: Connection[]): void {
    const votes = this.votes.get(player.entity.owner) ?? [];

    for (let i = 0; votes.length; i++) {
      if (votes[i] == 0) {
        continue;
      }

      const voter = this.parent.lobby.findPlayerByClientId(votes[i]);

      if (voter) {
        this.clearVote(voter as InternalPlayer, player, sendTo);
      } else {
        this.removeVote(votes[i], player.entity.owner, sendTo);
      }
    }
  }

  clearVotesFromPlayer(player: InternalPlayer, sendTo: Connection[]): void {
    const voterClientId = player.entity.owner;
    const votes = [...this.votes.entries()]
      .filter(entry => entry[0] != voterClientId && entry[1].includes(voterClientId))
      .map(entry => entry[0]);

    for (let i = 0; i < votes.length; i++) {
      const target = this.parent.lobby.findPlayerByClientId(votes[i]);

      if (target) {
        this.clearVote(player, target as InternalPlayer, sendTo);
      } else {
        this.removeVote(voterClientId, votes[i], sendTo);
      }
    }
  }

  serializeData(): DataPacket {
    const writer = new MessageWriter();

    writer.writeList(this.votes.entries(), (sub, item) => {
      sub.writeUInt32(item[0]);

      for (let i = 0; i < item[1].length; i++) {
        sub.writePackedUInt32(item[1][i]);
      }
    }, false);

    return new DataPacket(this.netId, writer);
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(
      this.netId,
      new MessageWriter().writeBytes(this.serializeData().data),
    );
  }

  clone(): InnerVoteBanSystem {
    const clone = new InnerVoteBanSystem(this.netId, this.parent);

    clone.votes = new Map(this.votes);

    return clone;
  }

  private removeVote(voterClientId: number, targetClientId: number, sendTo: Connection[]): void {
    const votes = this.votes.get(targetClientId) ?? [0, 0, 0];
    const index = votes.indexOf(voterClientId);

    if (index > -1) {
      votes.splice(index, 1);
      this.votes.set(targetClientId, votes);
      (this.parent.lobby as InternalLobby).sendRootGamePacket(new GameDataPacket([this.serializeData()], this.parent.lobby.getCode()), sendTo);
    }
  }
}
