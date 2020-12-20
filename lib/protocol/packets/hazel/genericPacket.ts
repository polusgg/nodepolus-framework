import { JoinGameErrorPacket, JoinGameRequestPacket, JoinGameResponsePacket } from "../root/joinGame";
import { GetGameListRequestPacket, GetGameListResponsePacket } from "../root/getGameList";
import { HostGameRequestPacket, HostGameResponsePacket } from "../root/hostGame";
import { LateRejectionPacket, RemovePlayerPacket } from "../root/removePlayer";
import { AnnouncementDataPacket } from "../announcement/announcementData";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootAnnouncementPacketType, RootGamePacketType } from "../types";
import { FreeWeekendPacket } from "../announcement/freeWeekend";
import { ReselectServerPacket } from "../root/reselectServer";
import { CacheDataPacket } from "../announcement/cacheData";
import { AlterGameTagPacket } from "../root/alterGameTag";
import { WaitForHostPacket } from "../root/waitForHost";
import { JoinedGamePacket } from "../root/joinedGame";
import { KickPlayerPacket } from "../root/kickPlayer";
import { RemoveGamePacket } from "../root/removeGame";
import { StartGamePacket } from "../root/startGame";
import { GameDataPacket } from "../root/gameData";
import { RedirectPacket } from "../root/redirect";
import { EndGamePacket } from "../root/endGame";
import { Level } from "../../../types/level";

export type RootGamePacketDataType =
  | HostGameRequestPacket
  | HostGameResponsePacket
  | JoinGameRequestPacket
  | JoinGameResponsePacket
  | JoinGameErrorPacket
  | StartGamePacket
  | RemoveGamePacket
  | RemovePlayerPacket
  | LateRejectionPacket
  | GameDataPacket
  | JoinedGamePacket
  | EndGamePacket
  | AlterGameTagPacket
  | KickPlayerPacket
  | WaitForHostPacket
  | RedirectPacket
  | ReselectServerPacket
  | GetGameListRequestPacket
  | GetGameListResponsePacket;

export type RootAnnouncementPacketDataType =
  | CacheDataPacket
  | AnnouncementDataPacket
  | FreeWeekendPacket;

export class RootGamePacket {
  constructor(public readonly packets: RootGamePacketDataType[]) {}

  static deserialize(reader: MessageReader, clientBound: boolean, level?: Level): RootGamePacket {
    const packets: RootGamePacketDataType[] = [];

    reader.readAllChildMessages(child => {
      switch (child.tag) {
        case RootGamePacketType.HostGame:
          if (clientBound) {
            packets.push(HostGameResponsePacket.deserialize(child));
          } else {
            packets.push(HostGameRequestPacket.deserialize(child));
          }
          break;
        case RootGamePacketType.JoinGame:
          if (clientBound) {
            if (child.buffer.length <= 4) {
              packets.push(JoinGameErrorPacket.deserialize(child));
            } else {
              packets.push(JoinGameResponsePacket.deserialize(child));
            }
          } else {
            packets.push(JoinGameRequestPacket.deserialize(child));
          }
          break;
        case RootGamePacketType.StartGame:
          packets.push(StartGamePacket.deserialize(child));
          break;
        case RootGamePacketType.RemoveGame:
          packets.push(RemoveGamePacket.deserialize(child));
          break;
        case RootGamePacketType.RemovePlayer:
          if (clientBound) {
            packets.push(LateRejectionPacket.deserialize(child));
          } else {
            packets.push(RemovePlayerPacket.deserialize(child));
          }
          break;
        case RootGamePacketType.GameData:
        case RootGamePacketType.GameDataTo:
          packets.push(GameDataPacket.deserialize(child, level));
          break;
        case RootGamePacketType.JoinedGame:
          packets.push(JoinedGamePacket.deserialize(child));
          break;
        case RootGamePacketType.EndGame:
          packets.push(EndGamePacket.deserialize(child));
          break;
        case RootGamePacketType.AlterGameTag:
          packets.push(AlterGameTagPacket.deserialize(child));
          break;
        case RootGamePacketType.KickPlayer:
          packets.push(KickPlayerPacket.deserialize(child));
          break;
        case RootGamePacketType.WaitForHost:
          packets.push(WaitForHostPacket.deserialize(child));
          break;
        case RootGamePacketType.Redirect:
          packets.push(RedirectPacket.deserialize(child));
          break;
        case RootGamePacketType.ReselectServer:
          packets.push(ReselectServerPacket.deserialize(child));
          break;
        case RootGamePacketType.GetGameList:
          if (clientBound) {
            packets.push(GetGameListResponsePacket.deserialize(child));
          } else {
            packets.push(GetGameListRequestPacket.deserialize(child));
          }
          break;
        default:
          throw new Error(`Attempted to deserialize an unimplemented root game packet type: ${child.tag} (${RootGamePacketType[child.tag]})`);
      }
    });

    return new RootGamePacket(packets);
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    for (let i = 0; i < this.packets.length; i++) {
      writer.startMessage(this.packets[i].type)
        .writeBytes(this.packets[i].serialize())
        .endMessage();
    }

    return writer;
  }
}

export class RootAnnouncementPacket {
  constructor(public readonly packets: RootAnnouncementPacketDataType[]) {}

  static deserialize(reader: MessageReader): RootAnnouncementPacket {
    const packets: RootAnnouncementPacketDataType[] = [];

    reader.readAllChildMessages(child => {
      switch (child.tag) {
        case RootAnnouncementPacketType.CacheData:
          packets.push(CacheDataPacket.deserialize(child));
          break;
        case RootAnnouncementPacketType.AnnouncementData:
          packets.push(AnnouncementDataPacket.deserialize(child));
          break;
        case RootAnnouncementPacketType.FreeWeekend:
          packets.push(FreeWeekendPacket.deserialize(child));
          break;
      }
    });

    return new RootAnnouncementPacket(packets);
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    for (let i = 0; i < this.packets.length; i++) {
      writer.startMessage(this.packets[i].type)
        .writeBytes(this.packets[i].serialize())
        .endMessage();
    }

    return writer;
  }
}
