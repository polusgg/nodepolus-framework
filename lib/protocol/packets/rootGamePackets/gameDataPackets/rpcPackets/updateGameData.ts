import { MessageWriter, MessageReader } from "../../../../../util/hazelMessage";
import { PlayerData } from "../../../../entities/gameData/playerData";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class UpdateGameDataPacket extends BaseRPCPacket {
  constructor(public readonly players: PlayerData[]) {
    super(RPCPacketType.UpdateGameData);
  }

  static deserialize(reader: MessageReader): UpdateGameDataPacket {
    return new UpdateGameDataPacket(reader.readList(sub => PlayerData.deserialize(sub)));
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeList(this.players, (sub, player) => player.serialize(sub));
  }
}
