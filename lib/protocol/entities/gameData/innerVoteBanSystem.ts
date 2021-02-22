import { PlayerVotekickAddedEvent, PlayerVotekickRemovedEvent } from "../../../api/events/player";
import { InnerNetObjectType, RpcPacketType } from "../../../types/enums";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { AddVotePacket, BaseRpcPacket } from "../../packets/rpc";
import { MessageWriter } from "../../../util/hazelMessage";
import { PlayerInstance } from "../../../api/player";
import { GameDataPacket } from "../../packets/root";
import { BaseInnerNetObject } from "../baseEntity";
import { DisconnectReason } from "../../../types";
import { InternalPlayer } from "../../../player";
import { InternalLobby } from "../../../lobby";
import { Connection } from "../../connection";
import { EntityGameData } from ".";

export class InnerVoteBanSystem extends BaseInnerNetObject {
  // TODO: Make protected with getter/setter
  public votes: Map<number, number[]> = new Map<number, number[]>();

  constructor(
    protected readonly parent: EntityGameData,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.VoteBanSystem, parent, netId);
  }

  async addVote(voter: PlayerInstance, target: PlayerInstance, sendTo?: Connection[]): Promise<void> {
    const voterClientId = voter.getConnection()?.id;
    const targetClientId = target.getConnection()?.id;

    if (voterClientId === undefined || targetClientId === undefined) {
      return;
    }

    const event = new PlayerVotekickAddedEvent(voter, target);

    await this.parent.getLobby().getServer().emit("player.votekick.added", event);

    if (event.isCancelled()) {
      return;
    }

    const votes = this.votes.get(targetClientId) ?? [0, 0, 0];
    let shouldKick = false;

    for (let i = 0; i < 3; i++) {
      if (votes[i] == 0) {
        votes[i] = voterClientId;

        if (i == 2) {
          shouldKick = true;
        }
        break;
      }
    }

    if (shouldKick) {
      const player = this.parent.getLobby().findPlayerByClientId(targetClientId);

      if (player) {
        player.kick(DisconnectReason.kicked());
        (this.parent.getLobby() as InternalLobby).sendRootGamePacket(new GameDataPacket([this.serializeData()], this.parent.getLobby().getCode()), sendTo);
      }
    } else {
      this.votes.set(targetClientId, votes);

      this.sendRpcPacket(new AddVotePacket(voterClientId, targetClientId), sendTo);
    }
  }

  async clearVote(voter: InternalPlayer, target: InternalPlayer, sendTo?: Connection[]): Promise<void> {
    const event = new PlayerVotekickRemovedEvent(voter, target);

    await this.parent.getLobby().getServer().emit("player.votekick.removed", event);

    if (event.isCancelled()) {
      return;
    }

    this.removeVote(voter.entity.getOwnerId(), target.entity.getOwnerId(), sendTo);
  }

  clearVotesForPlayer(player: InternalPlayer, sendTo?: Connection[]): void {
    const votes = this.votes.get(player.entity.getOwnerId()) ?? [];

    for (let i = 0; votes.length; i++) {
      if (votes[i] == 0) {
        continue;
      }

      const voter = this.parent.getLobby().findPlayerByClientId(votes[i]);

      if (voter) {
        this.clearVote(voter as InternalPlayer, player, sendTo);
      } else {
        this.removeVote(votes[i], player.entity.getOwnerId(), sendTo);
      }
    }
  }

  clearVotesFromPlayer(player: InternalPlayer, sendTo?: Connection[]): void {
    const voterClientId = player.entity.getOwnerId();
    const votes = [...this.votes.entries()]
      .filter(entry => entry[0] != voterClientId && entry[1].includes(voterClientId))
      .map(entry => entry[0]);

    for (let i = 0; i < votes.length; i++) {
      const target = this.parent.getLobby().findPlayerByClientId(votes[i]);

      if (target) {
        this.clearVote(player, target as InternalPlayer, sendTo);
      } else {
        this.removeVote(voterClientId, votes[i], sendTo);
      }
    }
  }

  handleRpc(connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, sendTo: Connection[]): void {
    switch (type) {
      case RpcPacketType.AddVote: {
        const data = packet as AddVotePacket;
        const voter = this.parent.getLobby().findPlayerByClientId(data.votingClientId);
        const target = this.parent.getLobby().findPlayerByClientId(data.targetClientId);

        if (!voter) {
          throw new Error(`Voting client ${this.parent.getOwnerId()} does not have a PlayerInstance on the lobby instance`);
        }

        if (!target) {
          throw new Error(`Target client ${this.parent.getOwnerId()} does not have a PlayerInstance on the lobby instance`);
        }

        this.addVote(voter, target, sendTo);
        break;
      }
      default:
        break;
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
    const clone = new InnerVoteBanSystem(this.parent, this.netId);

    clone.votes = new Map(this.votes);

    return clone;
  }

  getParent(): EntityGameData {
    return this.parent;
  }

  protected removeVote(voterClientId: number, targetClientId: number, sendTo?: Connection[]): void {
    const votes = this.votes.get(targetClientId) ?? [0, 0, 0];
    const index = votes.indexOf(voterClientId);

    if (index > -1) {
      votes.splice(index, 1);
      this.votes.set(targetClientId, votes);
      (this.parent.getLobby() as InternalLobby).sendRootGamePacket(new GameDataPacket([this.serializeData()], this.parent.getLobby().getCode()), sendTo);
    }
  }
}
