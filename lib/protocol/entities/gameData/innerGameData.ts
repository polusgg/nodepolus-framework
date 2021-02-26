import { BaseRpcPacket, SetTasksPacket, UpdateGameDataPacket } from "../../packets/rpc";
import { InnerNetObjectType, RpcPacketType } from "../../../types/enums";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MessageWriter } from "../../../util/hazelMessage";
import { BaseInnerNetObject } from "../baseEntity";
import { Connection } from "../../connection";
import { Tasks } from "../../../static";
import { PlayerData } from "./types";
import { EntityGameData } from ".";

export class InnerGameData extends BaseInnerNetObject {
  constructor(
    protected readonly parent: EntityGameData,
    protected players: PlayerData[] = [],
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.GameData, parent, netId);
  }

  getPlayers(): PlayerData[] {
    return this.players;
  }

  setPlayers(players: PlayerData[]): this {
    this.players = players;

    return this;
  }

  getPlayer(playerId: number): PlayerData | undefined {
    return this.players[playerId];
  }

  setPlayer(playerId: number, playerData: PlayerData): this {
    this.players[playerId] = playerData;

    return this;
  }

  removePlayer(playerId: number): this {
    this.players.splice(playerId, 1);

    return this;
  }

  setTasks(playerId: number, taskIds: number[], sendTo?: Connection[]): void {
    const tasks = Tasks.forLevelFromId(this.parent.getLobby().getLevel(), taskIds);
    const playerIndex = this.players.findIndex(p => p.getId() == playerId);

    if (playerIndex > -1) {
      const player = this.players[playerIndex];
      const newTasks = new Array(tasks.length);

      for (let j = 0; j < tasks.length; j++) {
        newTasks[j] = [
          tasks[j],
          false,
        ];
      }

      player.setTasks(newTasks);
    }

    this.sendRpcPacket(new SetTasksPacket(playerId, taskIds), sendTo);
  }

  updateGameData(playerData: PlayerData[], sendTo?: Connection[]): void {
    for (let i = 0; i < playerData.length; i++) {
      let hasPlayer = false;

      for (let j = 0; j < this.players.length; j++) {
        if (this.players[j].getId() == playerData[i].getId()) {
          hasPlayer = true;
          this.players[j] = playerData[i];

          break;
        }
      }

      if (!hasPlayer) {
        this.players.push(playerData[i]);
      }
    }

    this.sendRpcPacket(new UpdateGameDataPacket(playerData), sendTo);
  }

  handleRpc(connection: Connection, type: RpcPacketType, _packet: BaseRpcPacket, _sendTo: Connection[]): void {
    switch (type) {
      case RpcPacketType.SetTasks:
        this.parent.getLobby().getLogger().warn("Received SetTasks packet from connection %s in a server-as-host state", connection);
        break;
      case RpcPacketType.UpdateGameData:
        break;
      default:
        break;
    }
  }

  getParent(): EntityGameData {
    return this.parent;
  }

  // TODO: compare players and only send those that have updated
  serializeData(): DataPacket {
    return new DataPacket(
      this.netId,
      new MessageWriter().writeList(this.players, (sub, player) => player.serialize(sub), false),
    );
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(
      this.netId,
      new MessageWriter().writeList(this.players, (sub, player) => player.serialize(sub)),
    );
  }

  clone(): InnerGameData {
    return new InnerGameData(this.parent, this.players.map(data => data.clone()), this.netId);
  }
}
