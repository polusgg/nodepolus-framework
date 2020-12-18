import { UpdateGameDataPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/updateGameData";
import { SetTasksPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setTasks";
import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { Connection } from "../../connection";
import { InnerNetObjectType } from "../types";
import { PlayerData } from "./playerData";
import { EntityGameData } from ".";

export class InnerGameData extends BaseGameObject<InnerGameData> {
  constructor(netId: number, public parent: EntityGameData, public players: PlayerData[]) {
    super(InnerNetObjectType.GameData, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityGameData): InnerGameData {
    const gameData = new InnerGameData(object.innerNetObjectID, parent, []);

    gameData.setSpawn(object.data);

    return gameData;
  }

  setTasks(playerId: number, tasks: number[], sendTo: Connection[]): void {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id == playerId) {
        this.players[i].tasks = new Array(tasks.length);

        for (let j = 0; j < tasks.length; j++) {
          this.players[i].tasks[j] = [
            tasks[j],
            false,
          ];
        }
        break;
      }
    }

    this.sendRPCPacketTo(sendTo, new SetTasksPacket(playerId, tasks));
  }

  updateGameData(playerData: PlayerData[], sendTo: Connection[]): void {
    for (let i = 0; i < playerData.length; i++) {
      let hasPlayer = false;

      for (let j = 0; j < this.players.length; j++) {
        if (this.players[j].id == playerData[i].id) {
          hasPlayer = true;
          this.players[j] = playerData[i];

          break;
        }
      }

      if (!hasPlayer) {
        console.trace("New Player Pog", playerData[i]);
        this.players.push(playerData[i]);
      }
    }

    this.sendRPCPacketTo(sendTo, new UpdateGameDataPacket(playerData));
  }

  // TODO: compare players and only send those that have updated
  getData(): DataPacket {
    return new DataPacket(
      this.id,
      new MessageWriter().writeList(this.players, (sub, player) => player.serialize(sub), false),
    );
  }

  setData(packet: MessageReader | MessageWriter): void {
    MessageReader.fromRawBytes(packet.buffer).readList(sub => {
      const player = PlayerData.deserialize(sub);

      this.players[player.id] = player;
    }, false);
  }

  getSpawn(): SpawnInnerNetObject {
    return new DataPacket(
      this.id,
      new MessageWriter()
        .startMessage(1)
        .writeList(this.players, (sub, player) => player.serialize(sub))
        .endMessage(),
    );
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    this.players = MessageReader.fromMessage(data.buffer).readList(sub => PlayerData.deserialize(sub));
  }

  clone(): InnerGameData {
    return new InnerGameData(this.id, this.parent, this.players);
  }
}
