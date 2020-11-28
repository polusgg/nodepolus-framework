import { HostGameRequestPacket, HostGameResponsePacket } from "../rootGamePackets/hostGame";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { AlterGameTagPacket } from "../rootGamePackets/alterGame";
import { JoinedGamePacket } from "../rootGamePackets/joinedGame";
import { RemoveGamePacket } from "../rootGamePackets/removeGame";
import { StartGamePacket } from "../rootGamePackets/startGame";
import { GameDataPacket } from "../rootGamePackets/gameData";
import { RootGamePacketType } from "../types";
import { SendLateRejectionPacket, RemovePlayerPacket } from "../rootGamePackets/removePlayer";
import { JoinGameRequestPacket, JoinGameResponsePacket, JoinGameErrorPacket } from "../rootGamePackets/joinGame";

export type RootGamePacketDataType =
  | GameDataPacket
  | HostGameRequestPacket
  | HostGameResponsePacket
  | JoinedGamePacket
  | JoinGameRequestPacket
  | JoinGameResponsePacket
  | JoinGameErrorPacket
  | RemoveGamePacket
  | SendLateRejectionPacket
  | RemovePlayerPacket
  | StartGamePacket
  | AlterGameTagPacket;

export class RootGamePacket {
  constructor(public readonly packets: RootGamePacketDataType[]) {}

  static deserialize(reader: MessageReader, clientBound: boolean): RootGamePacket {
    let packets: RootGamePacketDataType[] = [];

    reader.readAllChildMessages(child => {
      switch (child.tag) {
        case RootGamePacketType.AlterGame:
          packets.push(AlterGameTagPacket.deserialize(child));
          break;
      }
    });

    return new RootGamePacket(packets);
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();

    for (let i = 0; i < this.packets.length; i++) {
      writer.startMessage(this.packets[i].type).writeBytes(this.packets[i].serialize()).endMessage();
    }

    return writer;
  }
}
