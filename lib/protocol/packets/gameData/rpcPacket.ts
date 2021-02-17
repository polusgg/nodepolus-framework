import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameDataPacketType, RpcPacketType } from "../types/enums";
import { BaseGameDataPacket } from "./baseGameDataPacket";
import { CustomRpcPacketContainer } from "../../../types";
import { BaseInnerNetObject } from "../../entities/types";
import { Connection } from "../../connection";
import { Level } from "../../../types/enums";
import {
  AddVotePacket,
  BaseRpcPacket,
  CastVotePacket,
  CheckColorPacket,
  CheckNamePacket,
  ClearVotePacket,
  ClimbLadderPacket,
  CloseDoorsOfTypePacket,
  ClosePacket,
  CompleteTaskPacket,
  EnterVentPacket,
  ExiledPacket,
  ExitVentPacket,
  MurderPlayerPacket,
  PlayAnimationPacket,
  RepairSystemPacket,
  ReportDeadBodyPacket,
  SendChatNotePacket,
  SendChatPacket,
  SetColorPacket,
  SetHatPacket,
  SetInfectedPacket,
  SetNamePacket,
  SetPetPacket,
  SetScannerPacket,
  SetStartCounterPacket,
  SetSkinPacket,
  SetTasksPacket,
  SnapToPacket,
  StartMeetingPacket,
  SyncSettingsPacket,
  UpdateGameDataPacket,
  UsePlatformPacket,
  VotingCompletePacket,
} from "../rpc";

/**
 * Game Data Packet ID: `0x02` (`2`)
 */
export class RpcPacket extends BaseGameDataPacket {
  private static readonly customPackets: Map<number, CustomRpcPacketContainer> = new Map();

  constructor(
    public senderNetId: number,
    public packet: BaseRpcPacket,
  ) {
    super(GameDataPacketType.RPC);
  }

  static registerPacket<T extends BaseRpcPacket>(id: number, deserializer: (reader: MessageReader) => T, handler: (connection: Connection, packet: T, sender?: BaseInnerNetObject) => void): void {
    if (id in RpcPacketType || RpcPacket.customPackets.has(id)) {
      throw new Error(`Attempted to register a custom RPC packet using an ID that is already in use: ${id}`);
    }

    RpcPacket.customPackets.set(id, {
      deserialize: deserializer,
      handle: handler,
    });
  }

  static unregisterPacket(id: number): void {
    RpcPacket.customPackets.delete(id);
  }

  static hasPacket(id: number): boolean {
    return RpcPacket.customPackets.has(id);
  }

  static getPacket(id: number): CustomRpcPacketContainer | undefined {
    return RpcPacket.customPackets.get(id);
  }

  static deserialize(reader: MessageReader, level?: Level): RpcPacket {
    const senderNetId = reader.readPackedUInt32();
    const type = reader.readByte();

    switch (type) {
      case RpcPacketType.PlayAnimation:
        return new RpcPacket(senderNetId, PlayAnimationPacket.deserialize(reader));
      case RpcPacketType.CompleteTask:
        return new RpcPacket(senderNetId, CompleteTaskPacket.deserialize(reader));
      case RpcPacketType.SyncSettings:
        return new RpcPacket(senderNetId, SyncSettingsPacket.deserialize(reader));
      case RpcPacketType.SetInfected:
        return new RpcPacket(senderNetId, SetInfectedPacket.deserialize(reader));
      case RpcPacketType.Exiled:
        return new RpcPacket(senderNetId, ExiledPacket.deserialize(reader));
      case RpcPacketType.CheckName:
        return new RpcPacket(senderNetId, CheckNamePacket.deserialize(reader));
      case RpcPacketType.SetName:
        return new RpcPacket(senderNetId, SetNamePacket.deserialize(reader));
      case RpcPacketType.CheckColor:
        return new RpcPacket(senderNetId, CheckColorPacket.deserialize(reader));
      case RpcPacketType.SetColor:
        return new RpcPacket(senderNetId, SetColorPacket.deserialize(reader));
      case RpcPacketType.SetHat:
        return new RpcPacket(senderNetId, SetHatPacket.deserialize(reader));
      case RpcPacketType.SetSkin:
        return new RpcPacket(senderNetId, SetSkinPacket.deserialize(reader));
      case RpcPacketType.ReportDeadBody:
        return new RpcPacket(senderNetId, ReportDeadBodyPacket.deserialize(reader));
      case RpcPacketType.MurderPlayer:
        return new RpcPacket(senderNetId, MurderPlayerPacket.deserialize(reader));
      case RpcPacketType.SendChat:
        return new RpcPacket(senderNetId, SendChatPacket.deserialize(reader));
      case RpcPacketType.StartMeeting:
        return new RpcPacket(senderNetId, StartMeetingPacket.deserialize(reader));
      case RpcPacketType.SetScanner:
        return new RpcPacket(senderNetId, SetScannerPacket.deserialize(reader));
      case RpcPacketType.SendChatNote:
        return new RpcPacket(senderNetId, SendChatNotePacket.deserialize(reader));
      case RpcPacketType.SetPet:
        return new RpcPacket(senderNetId, SetPetPacket.deserialize(reader));
      case RpcPacketType.SetStartCounter:
        return new RpcPacket(senderNetId, SetStartCounterPacket.deserialize(reader));
      case RpcPacketType.EnterVent:
        return new RpcPacket(senderNetId, EnterVentPacket.deserialize(reader));
      case RpcPacketType.ExitVent:
        return new RpcPacket(senderNetId, ExitVentPacket.deserialize(reader));
      case RpcPacketType.SnapTo:
        return new RpcPacket(senderNetId, SnapToPacket.deserialize(reader));
      case RpcPacketType.Close:
        return new RpcPacket(senderNetId, ClosePacket.deserialize(reader));
      case RpcPacketType.VotingComplete:
        return new RpcPacket(senderNetId, VotingCompletePacket.deserialize(reader));
      case RpcPacketType.CastVote:
        return new RpcPacket(senderNetId, CastVotePacket.deserialize(reader));
      case RpcPacketType.ClearVote:
        return new RpcPacket(senderNetId, ClearVotePacket.deserialize(reader));
      case RpcPacketType.AddVote:
        return new RpcPacket(senderNetId, AddVotePacket.deserialize(reader));
      case RpcPacketType.CloseDoorsOfType:
        return new RpcPacket(senderNetId, CloseDoorsOfTypePacket.deserialize(reader));
      case RpcPacketType.RepairSystem:
        return new RpcPacket(senderNetId, RepairSystemPacket.deserialize(reader, level));
      case RpcPacketType.SetTasks:
        return new RpcPacket(senderNetId, SetTasksPacket.deserialize(reader));
      case RpcPacketType.UpdateGameData:
        return new RpcPacket(senderNetId, UpdateGameDataPacket.deserialize(reader, level));
      case RpcPacketType.ClimbLadder:
        return new RpcPacket(senderNetId, ClimbLadderPacket.deserialize(reader));
      case RpcPacketType.UsePlatform:
        return new RpcPacket(senderNetId, UsePlatformPacket.deserialize(reader));
      default: {
        const custom = RpcPacket.customPackets.get(type);

        if (custom !== undefined) {
          return new RpcPacket(senderNetId, custom.deserialize(reader));
        }

        throw new Error(`Attempted to deserialize an unimplemented RPC packet type ${type} (${RpcPacketType[type]}) from InnerNetObject ${senderNetId}`);
      }
    }
  }

  clone(): RpcPacket {
    return new RpcPacket(this.senderNetId, this.packet.clone());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.senderNetId)
      .writeByte(this.packet.type)
      .writeBytes(this.packet.serialize());
  }
}
