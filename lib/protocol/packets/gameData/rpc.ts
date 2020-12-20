import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameDataPacket, BaseRPCPacket } from "../basePacket";
import { CloseDoorsOfTypePacket } from "../rpc/closeDoorsOfType";
import { SetStartCounterPacket } from "../rpc/setStartCounter";
import { ReportDeadBodyPacket } from "../rpc/reportDeadBody";
import { GameDataPacketType, RPCPacketType } from "../types";
import { UpdateGameDataPacket } from "../rpc/updateGameData";
import { VotingCompletePacket } from "../rpc/votingComplete";
import { PlayAnimationPacket } from "../rpc/playAnimation";
import { CompleteTaskPacket } from "../rpc/completeTask";
import { MurderPlayerPacket } from "../rpc/murderPlayer";
import { RepairSystemPacket } from "../rpc/repairSystem";
import { SendChatNotePacket } from "../rpc/sendChatNote";
import { StartMeetingPacket } from "../rpc/startMeeting";
import { SyncSettingsPacket } from "../rpc/syncSettings";
import { ClimbLadderPacket } from "../rpc/climbLadder";
import { SetInfectedPacket } from "../rpc/setInfected";
import { UsePlatformPacket } from "../rpc/usePlatform";
import { CheckColorPacket } from "../rpc/checkColor";
import { SetScannerPacket } from "../rpc/setScanner";
import { CheckNamePacket } from "../rpc/checkName";
import { ClearVotePacket } from "../rpc/clearVote";
import { EnterVentPacket } from "../rpc/enterVent";
import { CastVotePacket } from "../rpc/castVote";
import { ExitVentPacket } from "../rpc/exitVent";
import { SendChatPacket } from "../rpc/sendChat";
import { SetColorPacket } from "../rpc/setColor";
import { SetTasksPacket } from "../rpc/setTasks";
import { AddVotePacket } from "../rpc/addVote";
import { SetNamePacket } from "../rpc/setName";
import { SetSkinPacket } from "../rpc/setSkin";
import { Level } from "../../../types/enums";
import { ExiledPacket } from "../rpc/exiled";
import { SetHatPacket } from "../rpc/setHat";
import { SetPetPacket } from "../rpc/setPet";
import { SnapToPacket } from "../rpc/snapTo";
import { ClosePacket } from "../rpc/close";

export class RPCPacket extends BaseGameDataPacket {
  constructor(
    public senderNetId: number,
    public packet: BaseRPCPacket,
  ) {
    super(GameDataPacketType.RPC);
  }

  static deserialize(reader: MessageReader, level?: Level): RPCPacket {
    const senderNetId = reader.readPackedUInt32();
    const type = reader.readByte();

    switch (type) {
      case RPCPacketType.PlayAnimation:
        return new RPCPacket(senderNetId, PlayAnimationPacket.deserialize(reader));
      case RPCPacketType.CompleteTask:
        return new RPCPacket(senderNetId, CompleteTaskPacket.deserialize(reader));
      case RPCPacketType.SyncSettings:
        return new RPCPacket(senderNetId, SyncSettingsPacket.deserialize(reader));
      case RPCPacketType.SetInfected:
        return new RPCPacket(senderNetId, SetInfectedPacket.deserialize(reader));
      case RPCPacketType.Exiled:
        return new RPCPacket(senderNetId, ExiledPacket.deserialize(reader));
      case RPCPacketType.CheckName:
        return new RPCPacket(senderNetId, CheckNamePacket.deserialize(reader));
      case RPCPacketType.SetName:
        return new RPCPacket(senderNetId, SetNamePacket.deserialize(reader));
      case RPCPacketType.CheckColor:
        return new RPCPacket(senderNetId, CheckColorPacket.deserialize(reader));
      case RPCPacketType.SetColor:
        return new RPCPacket(senderNetId, SetColorPacket.deserialize(reader));
      case RPCPacketType.SetHat:
        return new RPCPacket(senderNetId, SetHatPacket.deserialize(reader));
      case RPCPacketType.SetSkin:
        return new RPCPacket(senderNetId, SetSkinPacket.deserialize(reader));
      case RPCPacketType.ReportDeadBody:
        return new RPCPacket(senderNetId, ReportDeadBodyPacket.deserialize(reader));
      case RPCPacketType.MurderPlayer:
        return new RPCPacket(senderNetId, MurderPlayerPacket.deserialize(reader));
      case RPCPacketType.SendChat:
        return new RPCPacket(senderNetId, SendChatPacket.deserialize(reader));
      case RPCPacketType.StartMeeting:
        return new RPCPacket(senderNetId, StartMeetingPacket.deserialize(reader));
      case RPCPacketType.SetScanner:
        return new RPCPacket(senderNetId, SetScannerPacket.deserialize(reader));
      case RPCPacketType.SendChatNote:
        return new RPCPacket(senderNetId, SendChatNotePacket.deserialize(reader));
      case RPCPacketType.SetPet:
        return new RPCPacket(senderNetId, SetPetPacket.deserialize(reader));
      case RPCPacketType.SetStartCounter:
        return new RPCPacket(senderNetId, SetStartCounterPacket.deserialize(reader));
      case RPCPacketType.EnterVent:
        return new RPCPacket(senderNetId, EnterVentPacket.deserialize(reader));
      case RPCPacketType.ExitVent:
        return new RPCPacket(senderNetId, ExitVentPacket.deserialize(reader));
      case RPCPacketType.SnapTo:
        return new RPCPacket(senderNetId, SnapToPacket.deserialize(reader));
      case RPCPacketType.Close:
        return new RPCPacket(senderNetId, ClosePacket.deserialize(reader));
      case RPCPacketType.VotingComplete:
        return new RPCPacket(senderNetId, VotingCompletePacket.deserialize(reader));
      case RPCPacketType.CastVote:
        return new RPCPacket(senderNetId, CastVotePacket.deserialize(reader));
      case RPCPacketType.ClearVote:
        return new RPCPacket(senderNetId, ClearVotePacket.deserialize(reader));
      case RPCPacketType.AddVote:
        return new RPCPacket(senderNetId, AddVotePacket.deserialize(reader));
      case RPCPacketType.CloseDoorsOfType:
        return new RPCPacket(senderNetId, CloseDoorsOfTypePacket.deserialize(reader));
      case RPCPacketType.RepairSystem:
        return new RPCPacket(senderNetId, RepairSystemPacket.deserialize(reader, level));
      case RPCPacketType.SetTasks:
        return new RPCPacket(senderNetId, SetTasksPacket.deserialize(reader));
      case RPCPacketType.UpdateGameData:
        return new RPCPacket(senderNetId, UpdateGameDataPacket.deserialize(reader));
      case RPCPacketType.ClimbLadder:
        return new RPCPacket(senderNetId, ClimbLadderPacket.deserialize(reader));
      case RPCPacketType.UsePlatform:
        return new RPCPacket(senderNetId, UsePlatformPacket.deserialize(reader));
      default:
        throw new Error(`Attempted to deserialize an unimplemented RPC packet type ${type} (${RPCPacketType[type]}) from InnerNetObject ${senderNetId}`);
    }
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.senderNetId)
      .writeByte(this.packet.type)
      .writeBytes(this.packet.serialize());
  }
}
