import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { PlayerData } from "../../../../entities/gameData/playerData";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class UpdateGameDataPacket extends BaseRPCPacket {
  constructor(readonly players: PlayerData[]) {
    super(RPCPacketType.UpdateGameData);
  }

  static deserialize(reader: MessageReader): UpdateGameDataPacket {
    return new UpdateGameDataPacket(reader.readAllChildMessages(sub => PlayerData.deserialize(sub, true)));
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeList(this.players, (sub, player) => player.serialize(sub));
  }
}
