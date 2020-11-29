import { MessageWriter, MessageReader } from "../../../../util/hazelMessage";
import { CloseDoorsOfTypePacket } from "./rpcPackets/closeDoorsOfType";
import { BaseGameDataPacket, BaseRPCPacket } from "../../basePacket";
import { SetStartCounterPacket } from "./rpcPackets/setStartCounter";
import { ReportDeadBodyPacket } from "./rpcPackets/reportDeadBody";
import { UpdateGameDataPacket } from "./rpcPackets/updateGameData";
import { VotingCompletePacket } from "./rpcPackets/votingComplete";
import { PlayAnimationPacket } from "./rpcPackets/playAnimation";
import { GameDataPacketType, RPCPacketType } from "../../types";
import { CompleteTaskPacket } from "./rpcPackets/completeTask";
import { MurderPlayerPacket } from "./rpcPackets/murderPlayer";
import { RepairSystemPacket } from "./rpcPackets/repairSystem";
import { SendChatNotePacket } from "./rpcPackets/sendChatNote";
import { StartMeetingPacket } from "./rpcPackets/startMeeting";
import { SyncSettingsPacket } from "./rpcPackets/syncSettings";
import { SetInfectedPacket } from "./rpcPackets/setInfected";
import { CheckColorPacket } from "./rpcPackets/checkColor";
import { SetScannerPacket } from "./rpcPackets/setScanner";
import { CheckNamePacket } from "./rpcPackets/checkName";
import { ClearVotePacket } from "./rpcPackets/clearVote";
import { EnterVentPacket } from "./rpcPackets/enterVent";
import { CastVotePacket } from "./rpcPackets/castVote";
import { ExitVentPacket } from "./rpcPackets/exitVent";
import { SendChatPacket } from "./rpcPackets/sendChat";
import { SetColorPacket } from "./rpcPackets/setColor";
import { SetTasksPacket } from "./rpcPackets/setTasks";
import { AddVotePacket } from "./rpcPackets/addVote";
import { SetNamePacket } from "./rpcPackets/setName";
import { SetSkinPacket } from "./rpcPackets/setSkin";
import { ExiledPacket } from "./rpcPackets/exiled";
import { SetHatPacket } from "./rpcPackets/setHat";
import { SetPetPacket } from "./rpcPackets/setPet";
import { SnapToPacket } from "./rpcPackets/snapTo";
import { ClosePacket } from "./rpcPackets/close";
import { Level } from "../../../../types/level";

export class RPCPacket extends BaseGameDataPacket {
  constructor(public senderNetId: number, public packet: BaseRPCPacket) {
    super(GameDataPacketType.RPC);
  }

  static deserialize(reader: MessageReader, level?: Level): RPCPacket {
    let senderNetId = reader.readPackedUInt32();
    let type = reader.readByte();

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
      default:
        throw new Error(`Unhandled RPC packet type ${type} from InnerNetObject ${senderNetId}`);
    }
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.senderNetId)
      .writeBytes(this.packet.serialize());
  }
}
