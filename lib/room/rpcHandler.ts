import { VoteState, InnerMeetingHud } from "../protocol/entities/meetingHud/innerMeetingHud";
import { PlayerData } from "../protocol/entities/gameData/playerData";
import { GameOptionsData } from "../types/gameOptionsData";
import { ChatNoteType } from "../types/chatNoteType";
import { Connection } from "../protocol/connection";
import { PlayerColor } from "../types/playerColor";
import { PlayerSkin } from "../types/playerSkin";
import { PlayerHat } from "../types/playerHat";
import { PlayerPet } from "../types/playerPet";
import { Vector2 } from "../util/vector2";
import { Room } from ".";
import { RepairAmount, RepairSystemPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { SystemType } from "../types/systemType";
import { BaseRPCPacket } from "../protocol/packets/basePacket";
import { RPCPacketType } from "../protocol/packets/types";
import { VotingCompletePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/votingComplete";
import { InnerNetObjectType, InnerLevel } from "../protocol/entities/types";
import { InnerVoteBanSystem } from "../protocol/entities/gameData/innerVoteBanSystem";
import { BaseShipStatus } from "../protocol/entities/baseShipStatus";
import { UpdateGameDataPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/updateGameData";
import { InnerGameData } from "../protocol/entities/gameData/innerGameData";
import { SetTasksPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setTasks";
import { InnerCustomNetworkTransform } from "../protocol/entities/player/innerCustomNetworkTransform";
import { InnerPlayerPhysics } from "../protocol/entities/player/innerPlayerPhysics";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { CloseDoorsOfTypePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/closeDoorsOfType";
import { PlayAnimationPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/playAnimation";
import { AddVotePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/addVote";
import { CastVotePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/castVote";
import { SnapToPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/snapTo";
import { ExitVentPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/exitVent";
import { EnterVentPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/enterVent";
import { SetStartCounterPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setStartCounter";
import { MurderPlayerPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/murderPlayer";
import { ReportDeadBodyPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/reportDeadBody";
import { SetColorPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setColor";
import { SetPetPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setPet";
import { CheckColorPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/checkColor";
import { SetSkinPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setSkin";
import { SetHatPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setHat";
import { SendChatNotePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/sendChatNote";
import { SetScannerPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setScanner";
import { StartMeetingPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/startMeeting";
import { SendChatPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/sendChat";
import { CheckNamePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/checkName";
import { SetNamePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setName";
import { SetInfectedPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setInfected";
import { SyncSettingsPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/syncSettings";
import { CompleteTaskPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/completeTask";

export class RPCHandler {
  constructor(readonly room: Room) {}

  handleBaseRPC(type: RPCPacketType, senderNetId: number, rawPacket: BaseRPCPacket, receiver: Connection | undefined) {
    let sender = this.room.findInnerNetObject(senderNetId);
    
    if (!sender)
      throw new Error("RPC packet sent from unknown InnerNetObject: " + senderNetId);

    switch (type) {
      case RPCPacketType.PlayAnimation: {
        let packet: PlayAnimationPacket = rawPacket as PlayAnimationPacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received PlayAnimation from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handlePlayAnimation(<InnerPlayerControl>sender, packet.taskId, receiver);
        break;
      }
      case RPCPacketType.CompleteTask: {
        let packet: CompleteTaskPacket = rawPacket as CompleteTaskPacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received CompleteTask from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleCompleteTask(<InnerPlayerControl>sender, packet.taskIndex, receiver);
        break;
      }
      case RPCPacketType.SyncSettings: {
        let packet: SyncSettingsPacket = rawPacket as SyncSettingsPacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received SyncSettings from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSyncSettings(<InnerPlayerControl>sender, packet.options, receiver);
        break;
      }
      case RPCPacketType.SetInfected: {
        let packet: SetInfectedPacket = rawPacket as SetInfectedPacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received SetInfected from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSetInfected(<InnerPlayerControl>sender, packet.impostorPlayerIds, receiver);
        break;
      }
      case RPCPacketType.Exiled: {
        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received Exiled from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleExiled(<InnerPlayerControl>sender, receiver);
        break;
      }
      case RPCPacketType.CheckName: {
        let packet: CheckNamePacket = rawPacket as CheckNamePacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received CheckName from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleCheckName(<InnerPlayerControl>sender, packet.name, receiver);
        break;
      }
      case RPCPacketType.SetName: {
        let packet: SetNamePacket = rawPacket as SetNamePacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received SetName from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSetName(<InnerPlayerControl>sender, packet.name, receiver);
        break;
      }
      case RPCPacketType.CheckColor: {
        let packet: CheckColorPacket = rawPacket as CheckColorPacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received CheckColor from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleCheckColor(<InnerPlayerControl>sender, packet.color, receiver);
        break;
      }
      case RPCPacketType.SetColor: {
        let packet: SetColorPacket = rawPacket as SetColorPacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received SetColor from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSetColor(<InnerPlayerControl>sender, packet.color, receiver);
        break;
      }
      case RPCPacketType.SetHat: {
        let packet: SetHatPacket = rawPacket as SetHatPacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received SetHat from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSetHat(<InnerPlayerControl>sender, packet.hat, receiver);
        break;
      }
      case RPCPacketType.SetSkin: {
        let packet: SetSkinPacket = rawPacket as SetSkinPacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received SetSkin from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSetSkin(<InnerPlayerControl>sender, packet.skin, receiver);
        break;
      }
      case RPCPacketType.ReportDeadBody: {
        let packet: ReportDeadBodyPacket = rawPacket as ReportDeadBodyPacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received ReportDeadBody from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleReportDeadBody(<InnerPlayerControl>sender, packet.victimPlayerId, receiver);
        break;
      }
      case RPCPacketType.MurderPlayer: {
        let packet: MurderPlayerPacket = rawPacket as MurderPlayerPacket;

        if (!(sender instanceof InnerPlayerControl))
          throw new Error("Received MurderPlayer from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleMurderPlayer(<InnerPlayerControl>sender, packet.victimPlayerControlNetId, receiver);
        break;
      }
      case RPCPacketType.SendChat: {
        let packet: SendChatPacket = rawPacket as SendChatPacket;

        if (sender.type != InnerNetObjectType.PlayerControl)
          throw new Error("Received SendChat from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSendChat(<InnerPlayerControl>sender, packet.message, receiver);
        break;
      }
      case RPCPacketType.StartMeeting: {
        let packet: StartMeetingPacket = rawPacket as StartMeetingPacket;

        if (sender.type != InnerNetObjectType.PlayerControl)
          throw new Error("Received StartMeeting from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleStartMeeting(<InnerPlayerControl>sender, packet.victimPlayerId, receiver);
        break;
      }
      case RPCPacketType.SetScanner: {
        let packet: SetScannerPacket = rawPacket as SetScannerPacket;

        if (sender.type != InnerNetObjectType.PlayerControl)
          throw new Error("Received SetScanner from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSetScanner(<InnerPlayerControl>sender, packet.isScanning, packet.sequenceId, receiver);
        break;
      }
      case RPCPacketType.SendChatNote: {
        let packet: SendChatNotePacket = rawPacket as SendChatNotePacket;

        if (sender.type != InnerNetObjectType.PlayerControl)
          throw new Error("Received SendChatNote from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSendChatNote(<InnerPlayerControl>sender, packet.playerId, packet.noteType, receiver);
        break;
      }
      case RPCPacketType.SetPet: {
        let packet: SetPetPacket = rawPacket as SetPetPacket;

        if (sender.type != InnerNetObjectType.PlayerControl)
          throw new Error("Received SetPet from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSetPet(<InnerPlayerControl>sender, packet.pet, receiver);
        break;
      }
      case RPCPacketType.SetStartCounter: {
        let packet: SetStartCounterPacket = rawPacket as SetStartCounterPacket;

        if (sender.type != InnerNetObjectType.PlayerControl)
          throw new Error("Received SetStartCounter from invalid InnerNetObject: expected PlayerControl but got " + InnerNetObjectType[sender.type]);

        this.handleSetStartCounter(<InnerPlayerControl>sender, packet.sequenceId, packet.timeRemaining, receiver);
        break;
      }
      case RPCPacketType.EnterVent: {
        let packet: EnterVentPacket = rawPacket as EnterVentPacket;

        if (sender.type != InnerNetObjectType.PlayerPhysics)
          throw new Error("Received EnterVent from invalid InnerNetObject: expected PlayerPhysics but got " + InnerNetObjectType[sender.type]);

        this.handleEnterVent(<InnerPlayerPhysics>sender, packet.ventId, receiver);
        break;
      }
      case RPCPacketType.ExitVent: {
        let packet: ExitVentPacket = rawPacket as ExitVentPacket;

        if (sender.type != InnerNetObjectType.PlayerPhysics)
          throw new Error("Received ExitVent from invalid InnerNetObject: expected PlayerPhysics but got " + InnerNetObjectType[sender.type]);

        this.handleExitVent(<InnerPlayerPhysics>sender, packet.ventId, receiver);
        break;
      }
      case RPCPacketType.SnapTo: {
        let packet: SnapToPacket = rawPacket as SnapToPacket;

        if (sender.type != InnerNetObjectType.CustomNetworkTransform)
          throw new Error("Received SnapTo from invalid InnerNetObject: expected CustomNetworkTransform but got " + InnerNetObjectType[sender.type]);

        this.handleSnapTo(<InnerCustomNetworkTransform>sender, packet.position, packet.lastSequenceId, receiver);
        break;
      }
      case RPCPacketType.Close: {
        if (sender.type != InnerNetObjectType.MeetingHud)
          throw new Error("Received Close from invalid InnerNetObject: expected MeetingHud but got " + InnerNetObjectType[sender.type]);

        this.handleClose(<InnerMeetingHud>sender, receiver);
        break;
      }
      case RPCPacketType.VotingComplete: {
        let packet: VotingCompletePacket = rawPacket as VotingCompletePacket;

        if (sender.type != InnerNetObjectType.MeetingHud)
          throw new Error("Received VotingComplete from invalid InnerNetObject: expected MeetingHud but got " + InnerNetObjectType[sender.type]);

        this.handleVotingComplete(<InnerMeetingHud>sender, packet.states, packet.isTie, packet.exiledPlayerId, receiver);
        break;
      }
      case RPCPacketType.CastVote: {
        let packet: CastVotePacket = rawPacket as CastVotePacket;

        if (sender.type != InnerNetObjectType.MeetingHud)
          throw new Error("Received CastVote from invalid InnerNetObject: expected MeetingHud but got " + InnerNetObjectType[sender.type]);

        this.handleCastVote(<InnerMeetingHud>sender, packet.votingPlayerId, packet.suspectPlayerId, receiver);
        break;
      }
      case RPCPacketType.ClearVote: {
        if (sender.type != InnerNetObjectType.MeetingHud)
          throw new Error("Received ClearVote from invalid InnerNetObject: expected MeetingHud but got " + InnerNetObjectType[sender.type]);

        this.handleClearVote(<InnerMeetingHud>sender, receiver);
        break;
      }
      case RPCPacketType.AddVote: {
        let packet: AddVotePacket = rawPacket as AddVotePacket;

        if (sender.type != InnerNetObjectType.VoteBanSystem)
          throw new Error("Received AddVote from invalid InnerNetObject: expected VoteBanSystem but got " + InnerNetObjectType[sender.type]);

        this.handleAddVote(<InnerVoteBanSystem>sender, packet.votingClientId, packet.targetClientId, receiver);
        break;
      }
      case RPCPacketType.CloseDoorsOfType: {
        let packet: CloseDoorsOfTypePacket = rawPacket as CloseDoorsOfTypePacket;

        if (!(sender instanceof BaseShipStatus))
          throw new Error("Received CloseDoorsOfType from invalid InnerNetObject: expected BaseShipStatus but got " + InnerNetObjectType[sender.type]);

        this.handleCloseDoorsOfType(<InnerLevel>sender, packet.system, receiver);
        break;
      }
      case RPCPacketType.RepairSystem: {
        let packet: RepairSystemPacket = rawPacket as RepairSystemPacket;

        if (!(sender instanceof BaseShipStatus))
          throw new Error("Received RepairSystem from invalid InnerNetObject: expected BaseShipStatus but got " + InnerNetObjectType[sender.type]);

        this.handleRepairSystem(<InnerLevel>sender, packet.system, packet.playerControlNetId, packet.amount, receiver);
        break;
      }
      case RPCPacketType.SetTasks: {
        let packet: SetTasksPacket = rawPacket as SetTasksPacket;

        if (sender.type != InnerNetObjectType.GameData)
          throw new Error("Received SetTasks from invalid InnerNetObject: expected GameData but got " + InnerNetObjectType[sender.type]);

        this.handleSetTasks(<InnerGameData>sender, packet.playerId, packet.tasks, receiver);
        break;
      }
      case RPCPacketType.UpdateGameData: {
        let packet: UpdateGameDataPacket = rawPacket as UpdateGameDataPacket;

        if (sender.type != InnerNetObjectType.GameData)
          throw new Error("Received UpdateGameData from invalid InnerNetObject: expected GameData but got " + InnerNetObjectType[sender.type]);

        this.handleUpdateGameData(<InnerGameData>sender, packet.players, receiver);
        break;
      }
      default:
        throw new Error("Unhandled RPC packet type: " + type);
    }
  }

  handlePlayAnimation(sender: InnerPlayerControl, taskId: number, receiver?: Connection) {
    sender.playAnimation(taskId);
  }
  
  handleCompleteTask(sender: InnerPlayerControl, taskIndex: number, receiver?: Connection) {
    sender.completeTask(taskIndex);
  }

  handleSyncSettings(sender: InnerPlayerControl, options: GameOptionsData, receiver?: Connection) {
    sender.syncSettings(options);
  }

  handleSetInfected(sender: InnerPlayerControl, impostorPlayerIds: number[], receiver?: Connection) {
    sender.setInfected(impostorPlayerIds);
  }

  handleExiled(sender: InnerPlayerControl, receiver?: Connection) {
    sender.exiled();
  }

  handleCheckName(sender: InnerPlayerControl, name: string, receiver?: Connection) {
    this.room.host.handleCheckName(sender, name);

    sender.checkName(name)
  }
  handleSetName(sender: InnerPlayerControl, name: string, receiver?: Connection) {
    sender.setName(name);
  }

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor, receiver?: Connection) {
    this.room.host.handleCheckColor(sender, color);

    sender.checkColor(name)
  }

  handleSetColor(sender: InnerPlayerControl, color: PlayerColor, receiver?: Connection) {
    sender.setColor(name);
  }

  handleSetHat(sender: InnerPlayerControl, hat: PlayerHat, receiver?: Connection) {
    sender.setHat(name);
  }

  handleSetSkin(sender: InnerPlayerControl, skin: PlayerSkin, receiver?: Connection) {
    sender.setSkin(skin);
  }

  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number, receiver?: Connection) {
    this.room.host.handleReportDeadBody(sender, victimPlayerId)

    sender.reportDeadBody(victimPlayerId);
  }

  handleMurderPlayer(sender: InnerPlayerControl, victimPlayerControlNetId: number, receiver?: Connection) {
    sender.murderPlayer(victimPlayerControlNetId);
  }

  handleSendChat(sender: InnerPlayerControl, message: string, receiver?: Connection) {
    sender.sendChat(message);
  }

  handleStartMeeting(sender: InnerPlayerControl, victimPlayerId?: number, receiver?: Connection) {
    sender.startMeeting(victimPlayerId);
  }

  handleSetScanner(sender: InnerPlayerControl, isScanning: boolean, sequenceId: number, receiver?: Connection) {
    sender.setScanner(isScanning);
  }

  handleSendChatNote(sender: InnerPlayerControl, playerId: number, noteType: ChatNoteType, receiver?: Connection) {
    sender.sendChatNote(playerId, noteType);
  }

  handleSetPet(sender: InnerPlayerControl, pet: PlayerPet, receiver?: Connection) {
    sender.setPet(pet);
  }

  handleSetStartCounter(sender: InnerPlayerControl, sequenceId: number, timeRemaining: number, receiver?: Connection) {
    sender.setStartCounter(sequenceId, timeRemaining);
  }

  handleEnterVent(sender: InnerPlayerPhysics, ventId: number, receiver?: Connection) {
    sender.enterVent(ventId);
  }

  handleExitVent(sender: InnerPlayerPhysics, ventId: number, receiver?: Connection) {
    sender.exitVent(ventId);
  }

  handleSnapTo(sender: InnerCustomNetworkTransform, position: Vector2, lastSequenceId: number, receiver?: Connection) {
    sender.snapTo(position, lastSequenceId);
  }

  handleClose(sender: InnerMeetingHud, receiver?: Connection) {
    sender.close();
  }

  handleVotingComplete(sender: InnerMeetingHud, voteStates: VoteState[], isTie: boolean, exiledPlayerId?: number, receiver?: Connection) {
    sender.votingComplete(voteStates, isTie, exiledPlayerId);
  }

  handleCastVote(sender: InnerMeetingHud, votingPlayerId: number, suspectPlayerId: number, receiver?: Connection) {
    sender.castVote(votingPlayerId, suspectPlayerId);
  }

  handleClearVote(sender: InnerMeetingHud, receiver?: Connection) {
    if (receiver) {
      sender.clearVote([ receiver ]);
    }
  }

  handleAddVote(sender: InnerVoteBanSystem, votingClientId: number, targetClientId: number, receiver?: Connection) {
    sender.addVote(votingClientId, targetClientId);
  }

  handleCloseDoorsOfType(sender: InnerLevel, system: SystemType, receiver?: Connection) {
    this.room.host.handleCloseDoorsOfType(sender, system)

    sender.closeDoorsOfType(system);
  }

  handleRepairSystem(sender: InnerLevel, systemId: SystemType, playerControlNetId: number, amount: RepairAmount, receiver?: Connection) {
    this.room.host.handleRepairSystem(sender, systemId, playerControlNetId, amount)

    sender.repairSystem(systemId, playerControlNetId, amount);
  }

  handleSetTasks(sender: InnerGameData, playerId: number, tasks: number[], receiver?: Connection) {
    sender.setTasks(playerId, tasks);
  }

  handleUpdateGameData(sender: InnerGameData, players: PlayerData[], receiver?: Connection) {
    sender.updateGameData(players);
  }
}
