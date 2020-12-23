import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SetTasksPacket, UpdateGameDataPacket } from "../../packets/rpc";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { DataPacket } from "../../packets/gameData";
import { EntityGameData, PlayerData } from ".";
import { Connection } from "../../connection";
import { BaseInnerNetObject } from "../types";

export class InnerGameData extends BaseInnerNetObject {
  constructor(
    netId: number,
    public parent: EntityGameData,
    public players: PlayerData[],
  ) {
    super(InnerNetObjectType.GameData, netId, parent);
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
        this.players.push(playerData[i]);
      }
    }

    this.sendRPCPacketTo(sendTo, new UpdateGameDataPacket(playerData));
  }

  // TODO: compare players and only send those that have updated
  getData(): DataPacket {
    return new DataPacket(
      this.netId,
      new MessageWriter().writeList(this.players, (sub, player) => player.serialize(sub), false),
    );
  }

  setData(packet: MessageReader | MessageWriter): void {
    MessageReader.fromRawBytes(packet.buffer).readList(sub => {
      const player = PlayerData.deserialize(sub);

      this.players[player.id] = player;
    }, false);
  }

  serializeSpawn(): SpawnInnerNetObject {
    return new SpawnInnerNetObject(
      this.netId,
      new MessageWriter().writeList(this.players, (sub, player) => player.serialize(sub)),
    );
  }

  clone(): InnerGameData {
    return new InnerGameData(this.netId, this.parent, this.players);
  }
}
