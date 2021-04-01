import { BaseRpcPacket, SetTasksPacket } from "../../packets/rpc";
import { InnerNetObjectType, PlayerColor, RpcPacketType } from "../../../types/enums";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MessageWriter } from "../../../util/hazelMessage";
import { BaseInnerNetObject } from "../baseEntity";
import { Connection } from "../../connection";
import { Tasks } from "../../../static";
import { PlayerData } from "./types";
import { EntityGameData } from ".";
import { GameDataPacket } from "../../packets/root";

export class InnerGameData extends BaseInnerNetObject {
  constructor(
    protected readonly parent: EntityGameData,
    protected players: Map<number, PlayerData> = new Map(),
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.GameData, parent, netId);
  }

  getPlayers(sorted: boolean = true): Map<number, PlayerData> {
    return sorted ? new Map([...this.players.entries()].sort((a, b) => a[0] - b[0])) : this.players;
  }

  setPlayers(players: Map<number, PlayerData>): this {
    this.players = players;

    return this;
  }

  getPlayer(playerId: number): PlayerData | undefined {
    return this.players.get(playerId);
  }

  getSafePlayer(playerId: number): PlayerData {
    const player = this.getPlayer(playerId);

    if (player === undefined) {
      throw new Error(`GameData does not have PlayerData for player ${playerId}`);
    }

    return player;
  }

  addPlayer(playerData: PlayerData): this {
    this.players.set(playerData.getId(), playerData);

    return this;
  }

  removePlayer(playerId: number): this {
    this.players.delete(playerId);

    return this;
  }

  /**
   * Gets whether or not the given name is already in use by another player.
   *
   * @param name - The name to be checked
   * @returns `true` if the name is already in use, `false` if not
   */
  isNameTaken(name: string): boolean {
    return [...this.players.values()].find(player => player.getName() == name) !== undefined;
  }

  /**
   * Gets all colors that are already in use by other players.
   *
   * @param excludePlayerId - The ID of a player whose color will be excluded from the results
   * @returns The colors that are already in use
   */
  getTakenColors(excludePlayerId: number): PlayerColor[] {
    return [...this.players.values()].filter(player => {
      if (player.getId() === excludePlayerId) {
        return false;
      }

      if (this.parent.getLobby().getPlayers().find(p => p.getId() == player.getId())?.getConnection() === undefined) {
        return false;
      }

      return true;
    }).map(player => player.getColor());
  }

  setTasks(playerId: number, taskIds: number[], sendTo?: Connection[]): this {
    const tasks = Tasks.forLevelFromId(this.parent.getLobby().getLevel(), taskIds);
    const player = this.players.get(playerId);

    if (player !== undefined) {
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

    return this;
  }

  updateAllGameData(sendTo?: Connection[]): this {
    return this.updateGameData(undefined, sendTo);
  }

  updateGameData(playerData?: PlayerData[], sendTo?: Connection[]): this {
    const old = this.clone();

    playerData ??= [...this.players.values()];

    for (let i = 0; i < playerData.length; i++) {
      const player = playerData[i];

      this.players.set(player.getId(), player);
    }

    const data = this.serializeData(old);

    if (!sendTo) {
      sendTo = this.getLobby().getConnections();
    }

    for (let i = 0; i < sendTo.length; i++) {
      const connection = sendTo[i];

      connection.writeReliable(new GameDataPacket([data], this.getLobby().getCode()));
    }

    return this;
  }

  handleRpc(connection: Connection, type: RpcPacketType, _packet: BaseRpcPacket, _sendTo: Connection[]): void {
    switch (type) {
      case RpcPacketType.SetTasks:
        this.parent.getLobby().getLogger().warn("Received SetTasks packet from connection %s in a server-as-host state", connection);
        break;
      default:
        break;
    }
  }

  getParent(): EntityGameData {
    return this.parent;
  }

  // TODO: compare players and only send those that have updated
  serializeData(_old: InnerGameData): DataPacket {
    const writer = new MessageWriter();

    [...this.players.values()].forEach(player => {
      writer.startMessage(player.getId());
      player.serialize(writer, false);
      writer.endMessage();
    });

    return new DataPacket(
      this.netId,
      writer,
    );
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(
      this.netId,
      new MessageWriter().writeList(this.players.values(), (sub, player) => sub.writeObject(player)),
    );
  }

  clone(): InnerGameData {
    return new InnerGameData(this.parent, new Map(Array.from(this.players, ([id, data]) => [id, data.clone()])), this.netId);
  }
}
