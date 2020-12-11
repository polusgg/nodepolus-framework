import { RepairAmount, RepairSystemPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { CloseDoorsOfTypePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/closeDoorsOfType";
import { SetStartCounterPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setStartCounter";
import { ReportDeadBodyPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/reportDeadBody";
import { UpdateGameDataPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/updateGameData";
import { VotingCompletePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/votingComplete";
import { PlayAnimationPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/playAnimation";
import { CompleteTaskPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/completeTask";
import { MurderPlayerPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/murderPlayer";
import { SendChatNotePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/sendChatNote";
import { StartMeetingPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/startMeeting";
import { SyncSettingsPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/syncSettings";
import { SetInfectedPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setInfected";
import { CheckColorPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/checkColor";
import { SetScannerPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setScanner";
import { CheckNamePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/checkName";
import { EnterVentPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/enterVent";
import { CastVotePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/castVote";
import { ExitVentPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/exitVent";
import { SendChatPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/sendChat";
import { SetColorPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setColor";
import { SetTasksPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setTasks";
import { AddVotePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/addVote";
import { SetNamePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setName";
import { SetSkinPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setSkin";
import { InnerCustomNetworkTransform } from "../protocol/entities/player/innerCustomNetworkTransform";
import { SetHatPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setHat";
import { SetPetPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/setPet";
import { SnapToPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpcPackets/snapTo";
import { InnerMeetingHud, VoteState } from "../protocol/entities/meetingHud/innerMeetingHud";
import { InnerVoteBanSystem } from "../protocol/entities/gameData/innerVoteBanSystem";
import { InnerPlayerPhysics } from "../protocol/entities/player/innerPlayerPhysics";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { InnerGameData } from "../protocol/entities/gameData/innerGameData";
import { InnerLevel, InnerNetObjectType } from "../protocol/entities/types";
import { PlayerData } from "../protocol/entities/gameData/playerData";
import { BaseShipStatus } from "../protocol/entities/baseShipStatus";
import { BaseRPCPacket } from "../protocol/packets/basePacket";
import { GameOptionsData } from "../types/gameOptionsData";
import { RPCPacketType } from "../protocol/packets/types";
import { ChatNoteType } from "../types/chatNoteType";
import { Connection } from "../protocol/connection";
import { PlayerColor } from "../types/playerColor";
import { PlayerSkin } from "../types/playerSkin";
import { SystemType } from "../types/systemType";
import { PlayerHat } from "../types/playerHat";
import { PlayerPet } from "../types/playerPet";
import { Vector2 } from "../util/vector2";
import { Room } from ".";

export class RPCHandler {
  constructor(public readonly room: Room) {}

  handleBaseRPC(type: RPCPacketType, senderNetId: number, rawPacket: BaseRPCPacket, sendTo: Connection[]): void {
    const sender = this.room.findInnerNetObject(senderNetId);
    const typeString = InnerNetObjectType[type];

    if (!sender) {
      throw new Error(`RPC packet sent from unknown InnerNetObject: ${senderNetId}`);
    }

    switch (type) {
      case RPCPacketType.PlayAnimation: {
        const packet: PlayAnimationPacket = rawPacket as PlayAnimationPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received PlayAnimation packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handlePlayAnimation(sender as InnerPlayerControl, packet.taskId, sendTo);
        break;
      }
      case RPCPacketType.CompleteTask: {
        const packet: CompleteTaskPacket = rawPacket as CompleteTaskPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received CompleteTask packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleCompleteTask(sender as InnerPlayerControl, packet.taskIndex, sendTo);
        break;
      }
      case RPCPacketType.SyncSettings: {
        const packet: SyncSettingsPacket = rawPacket as SyncSettingsPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SyncSettings packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSyncSettings(sender as InnerPlayerControl, packet.options, sendTo);
        break;
      }
      case RPCPacketType.SetInfected: {
        const packet: SetInfectedPacket = rawPacket as SetInfectedPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetInfected packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetInfected(sender as InnerPlayerControl, packet.impostorPlayerIds, sendTo);
        break;
      }
      case RPCPacketType.Exiled: {
        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received Exiled packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleExiled(sender as InnerPlayerControl, sendTo);
        break;
      }
      case RPCPacketType.CheckName: {
        const packet: CheckNamePacket = rawPacket as CheckNamePacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received CheckName packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleCheckName(sender as InnerPlayerControl, packet.name, sendTo);

        this.room.emit("player", this.room.findPlayerByConnection(this.room.findConnection(sender.parent.owner)!)!);
        break;
      }
      case RPCPacketType.SetName: {
        const packet: SetNamePacket = rawPacket as SetNamePacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetName packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetName(sender as InnerPlayerControl, packet.name, sendTo);
        break;
      }
      case RPCPacketType.CheckColor: {
        const packet: CheckColorPacket = rawPacket as CheckColorPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received CheckColor packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleCheckColor(sender as InnerPlayerControl, packet.color, sendTo);
        break;
      }
      case RPCPacketType.SetColor: {
        const packet: SetColorPacket = rawPacket as SetColorPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetColor packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetColor(sender as InnerPlayerControl, packet.color, sendTo);
        break;
      }
      case RPCPacketType.SetHat: {
        const packet: SetHatPacket = rawPacket as SetHatPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetHat packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetHat(sender as InnerPlayerControl, packet.hat, sendTo);
        break;
      }
      case RPCPacketType.SetSkin: {
        const packet: SetSkinPacket = rawPacket as SetSkinPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetSkin packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetSkin(sender as InnerPlayerControl, packet.skin, sendTo);
        break;
      }
      case RPCPacketType.ReportDeadBody: {
        const packet: ReportDeadBodyPacket = rawPacket as ReportDeadBodyPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received ReportDeadBody packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleReportDeadBody(sender as InnerPlayerControl, packet.victimPlayerId, sendTo);
        break;
      }
      case RPCPacketType.MurderPlayer: {
        const packet: MurderPlayerPacket = rawPacket as MurderPlayerPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received MurderPlayer packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleMurderPlayer(sender as InnerPlayerControl, packet.victimPlayerControlNetId, sendTo);
        break;
      }
      case RPCPacketType.SendChat: {
        const packet: SendChatPacket = rawPacket as SendChatPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SendChat packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSendChat(sender as InnerPlayerControl, packet.message, sendTo);
        break;
      }
      case RPCPacketType.StartMeeting: {
        const packet: StartMeetingPacket = rawPacket as StartMeetingPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received StartMeeting packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleStartMeeting(sender as InnerPlayerControl, packet.victimPlayerId, sendTo);
        break;
      }
      case RPCPacketType.SetScanner: {
        const packet: SetScannerPacket = rawPacket as SetScannerPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SetScanner packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetScanner(sender as InnerPlayerControl, packet.isScanning, packet.sequenceId, sendTo);
        break;
      }
      case RPCPacketType.SendChatNote: {
        const packet: SendChatNotePacket = rawPacket as SendChatNotePacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SendChatNote packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSendChatNote(sender as InnerPlayerControl, packet.playerId, packet.noteType, sendTo);
        break;
      }
      case RPCPacketType.SetPet: {
        const packet: SetPetPacket = rawPacket as SetPetPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SetPet packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetPet(sender as InnerPlayerControl, packet.pet, sendTo);
        break;
      }
      case RPCPacketType.SetStartCounter: {
        const packet: SetStartCounterPacket = rawPacket as SetStartCounterPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SetStartCounter packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetStartCounter(sender as InnerPlayerControl, packet.sequenceId, packet.timeRemaining, sendTo);
        break;
      }
      case RPCPacketType.EnterVent: {
        const packet: EnterVentPacket = rawPacket as EnterVentPacket;

        if (sender.type != InnerNetObjectType.PlayerPhysics) {
          throw new Error(`Received EnterVent packet from invalid InnerNetObject: expected PlayerPhysics but got ${type as number} (${typeString})`);
        }

        this.handleEnterVent(sender as InnerPlayerPhysics, packet.ventId, sendTo);
        break;
      }
      case RPCPacketType.ExitVent: {
        const packet: ExitVentPacket = rawPacket as ExitVentPacket;

        if (sender.type != InnerNetObjectType.PlayerPhysics) {
          throw new Error(`Received ExitVent packet from invalid InnerNetObject: expected PlayerPhysics but got ${type as number} (${typeString})`);
        }

        this.handleExitVent(sender as InnerPlayerPhysics, packet.ventId, sendTo);
        break;
      }
      case RPCPacketType.SnapTo: {
        const packet: SnapToPacket = rawPacket as SnapToPacket;

        if (sender.type != InnerNetObjectType.CustomNetworkTransform) {
          throw new Error(`Received SnapTo packet from invalid InnerNetObject: expected CustomNetworkTransform but got ${type as number} (${typeString})`);
        }

        this.handleSnapTo(sender as InnerCustomNetworkTransform, packet.position, packet.lastSequenceId, sendTo);
        break;
      }
      case RPCPacketType.Close: {
        if (sender.type != InnerNetObjectType.MeetingHud) {
          throw new Error(`Received Close packet from invalid InnerNetObject: expected MeetingHud but got ${type as number} (${typeString})`);
        }

        this.handleClose(sender as InnerMeetingHud, sendTo);
        break;
      }
      case RPCPacketType.VotingComplete: {
        const packet: VotingCompletePacket = rawPacket as VotingCompletePacket;

        if (sender.type != InnerNetObjectType.MeetingHud) {
          throw new Error(`Received VotingComplete packet from invalid InnerNetObject: expected MeetingHud but got ${type as number} (${typeString})`);
        }

        this.handleVotingComplete(sender as InnerMeetingHud, packet.states, packet.didVotePlayerOff, packet.exiledPlayerId, packet.isTie, sendTo);
        break;
      }
      case RPCPacketType.CastVote: {
        const packet: CastVotePacket = rawPacket as CastVotePacket;

        if (sender.type != InnerNetObjectType.MeetingHud) {
          throw new Error(`Received CastVote packet from invalid InnerNetObject: expected MeetingHud but got ${type as number} (${typeString})`);
        }

        this.handleCastVote(sender as InnerMeetingHud, packet.votingPlayerId, packet.suspectPlayerId);
        break;
      }
      case RPCPacketType.ClearVote: {
        if (sender.type != InnerNetObjectType.MeetingHud) {
          throw new Error(`Received ClearVote packet from invalid InnerNetObject: expected MeetingHud but got ${type as number} (${typeString})`);
        }

        this.handleClearVote(sender as InnerMeetingHud, sendTo);
        break;
      }
      case RPCPacketType.AddVote: {
        const packet: AddVotePacket = rawPacket as AddVotePacket;

        if (sender.type != InnerNetObjectType.VoteBanSystem) {
          throw new Error(`Received AddVote packet from invalid InnerNetObject: expected VoteBanSystem but got ${type as number} (${typeString})`);
        }

        this.handleAddVote(sender as InnerVoteBanSystem, packet.votingClientId, packet.targetClientId, sendTo);
        break;
      }
      case RPCPacketType.CloseDoorsOfType: {
        const packet: CloseDoorsOfTypePacket = rawPacket as CloseDoorsOfTypePacket;

        if (!(sender instanceof BaseShipStatus)) {
          throw new Error(`Received CloseDoorsOfType packet from invalid InnerNetObject: expected BaseShipStatus but got ${type as number} (${typeString})`);
        }

        this.handleCloseDoorsOfType(sender as InnerLevel, packet.system);
        break;
      }
      case RPCPacketType.RepairSystem: {
        const packet: RepairSystemPacket = rawPacket as RepairSystemPacket;

        if (!(sender instanceof BaseShipStatus)) {
          throw new Error(`Received RepairSystem packet from invalid InnerNetObject: expected BaseShipStatus but got ${type as number} (${typeString})`);
        }

        this.handleRepairSystem(sender as InnerLevel, packet.system, packet.playerControlNetId, packet.amount);
        break;
      }
      case RPCPacketType.SetTasks: {
        const packet: SetTasksPacket = rawPacket as SetTasksPacket;

        if (sender.type != InnerNetObjectType.GameData) {
          throw new Error(`Received SetTasks packet from invalid InnerNetObject: expected GameData but got ${type as number} (${typeString})`);
        }

        this.handleSetTasks(sender as InnerGameData, packet.playerId, packet.tasks, sendTo);
        break;
      }
      case RPCPacketType.UpdateGameData: {
        const packet: UpdateGameDataPacket = rawPacket as UpdateGameDataPacket;

        if (sender.type != InnerNetObjectType.GameData) {
          throw new Error(`Received UpdateGameData packet from invalid InnerNetObject: expected GameData but got ${type as number} (${typeString})`);
        }

        this.handleUpdateGameData(sender as InnerGameData, packet.players, sendTo);
        break;
      }
      default:
        throw new Error(`Attempted to handle an unimplemented RPC packet type: ${type as number} (${RPCPacketType[type]})`);
    }
  }

  handlePlayAnimation(sender: InnerPlayerControl, taskId: number, sendTo: Connection[]): void {
    sender.playAnimation(taskId, sendTo);
  }

  handleCompleteTask(sender: InnerPlayerControl, taskIndex: number, sendTo: Connection[]): void {
    if (!this.room.host) {
      throw new Error("CompleteTask RPC handler called without a host");
    }

    this.room.host.handleCompleteTask(sender, taskIndex);

    sender.completeTask(taskIndex, sendTo);
  }

  handleSyncSettings(sender: InnerPlayerControl, options: GameOptionsData, sendTo: Connection[]): void {
    sender.syncSettings(options, sendTo);
  }

  handleSetInfected(sender: InnerPlayerControl, impostorPlayerIds: number[], sendTo: Connection[]): void {
    sender.setInfected(impostorPlayerIds, sendTo);
  }

  handleExiled(sender: InnerPlayerControl, sendTo: Connection[]): void {
    sender.exiled(sendTo);
  }

  handleCheckName(sender: InnerPlayerControl, name: string, sendTo: Connection[]): void {
    if (!this.room.host) {
      throw new Error("CheckName RPC handler called without a host");
    }

    this.room.host.handleCheckName(sender, name);

    sender.checkName(name, sendTo);
  }

  handleSetName(sender: InnerPlayerControl, name: string, sendTo: Connection[]): void {
    sender.setName(name, sendTo);
  }

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor, sendTo: Connection[]): void {
    if (!this.room.host) {
      throw new Error("CheckColor RPC handler called without a host");
    }

    this.room.host.handleCheckColor(sender, color);

    sender.checkColor(color, sendTo);
  }

  handleSetColor(sender: InnerPlayerControl, color: PlayerColor, sendTo: Connection[]): void {
    sender.setColor(color, sendTo);
  }

  handleSetHat(sender: InnerPlayerControl, hat: PlayerHat, sendTo: Connection[]): void {
    sender.setHat(hat, sendTo);
  }

  handleSetSkin(sender: InnerPlayerControl, skin: PlayerSkin, sendTo: Connection[]): void {
    sender.setSkin(skin, sendTo);
  }

  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId: number | undefined, sendTo: Connection[]): void {
    if (!this.room.host) {
      throw new Error("ReportDeadBody RPC handler called without a host");
    }

    this.room.host.handleReportDeadBody(sender, victimPlayerId);

    sender.reportDeadBody(victimPlayerId, sendTo);
  }

  handleMurderPlayer(sender: InnerPlayerControl, victimPlayerControlNetId: number, sendTo: Connection[]): void {
    if (!this.room.host) {
      throw new Error("MurderPlayer RPC handler called without a host");
    }

    sender.murderPlayer(victimPlayerControlNetId, sendTo);

    this.room.host.handleMurderPlayer(sender, victimPlayerControlNetId);
  }

  handleSendChat(sender: InnerPlayerControl, message: string, sendTo: Connection[]): void {
    sender.sendChat(message, sendTo);
  }

  handleStartMeeting(sender: InnerPlayerControl, victimPlayerId: number | undefined, sendTo: Connection[]): void {
    sender.startMeeting(victimPlayerId, sendTo);
  }

  // TODO: Figure out what sequenceId does
  handleSetScanner(sender: InnerPlayerControl, isScanning: boolean, _sequenceId: number, sendTo: Connection[]): void {
    // TODO: Why is sequenceId not being passed?
    sender.setScanner(isScanning, sendTo);
  }

  handleSendChatNote(sender: InnerPlayerControl, playerId: number, noteType: ChatNoteType, sendTo: Connection[]): void {
    sender.sendChatNote(playerId, noteType, sendTo);
  }

  handleSetPet(sender: InnerPlayerControl, pet: PlayerPet, sendTo: Connection[]): void {
    sender.setPet(pet, sendTo);
  }

  handleSetStartCounter(sender: InnerPlayerControl, sequenceId: number, timeRemaining: number, sendTo: Connection[]): void {
    sender.setStartCounter(sequenceId, timeRemaining, sendTo);
  }

  handleEnterVent(sender: InnerPlayerPhysics, ventId: number, sendTo: Connection[]): void {
    sender.enterVent(ventId, sendTo);
  }

  handleExitVent(sender: InnerPlayerPhysics, ventId: number, sendTo: Connection[]): void {
    sender.exitVent(ventId, sendTo);
  }

  handleSnapTo(sender: InnerCustomNetworkTransform, position: Vector2, lastSequenceId: number, sendTo: Connection[]): void {
    sender.snapTo(position, lastSequenceId, sendTo);
  }

  handleClose(sender: InnerMeetingHud, sendTo: Connection[]): void {
    sender.close(sendTo);
  }

  handleVotingComplete(sender: InnerMeetingHud, voteStates: VoteState[], didVotePlayerOff: boolean, exiledPlayerId: number, isTie: boolean, sendTo: Connection[]): void {
    sender.votingComplete(voteStates, didVotePlayerOff, exiledPlayerId, isTie, sendTo);
  }

  handleCastVote(sender: InnerMeetingHud, votingPlayerId: number, suspectPlayerId: number): void {
    sender.castVote(votingPlayerId, suspectPlayerId);
  }

  handleClearVote(sender: InnerMeetingHud, sendTo: Connection[]): void {
    sender.clearVote(sendTo);
  }

  handleAddVote(sender: InnerVoteBanSystem, votingClientId: number, targetClientId: number, sendTo: Connection[]): void {
    sender.addVote(votingClientId, targetClientId, sendTo);
  }

  handleCloseDoorsOfType(sender: InnerLevel, system: SystemType): void {
    if (!this.room.host) {
      throw new Error("CloseDoorsOfType RPC handler called without a host");
    }

    this.room.host.handleCloseDoorsOfType(sender, system);

    sender.closeDoorsOfType(system);
  }

  handleRepairSystem(sender: InnerLevel, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void {
    if (!this.room.host) {
      throw new Error("RepairSystem RPC handler called without a host");
    }

    this.room.host.handleRepairSystem(sender, systemId, playerControlNetId, amount);

    sender.repairSystem(systemId, playerControlNetId, amount);
  }

  handleSetTasks(sender: InnerGameData, playerId: number, tasks: number[], sendTo: Connection[]): void {
    sender.setTasks(playerId, tasks, sendTo);
  }

  handleUpdateGameData(sender: InnerGameData, players: PlayerData[], sendTo: Connection[]): void {
    sender.updateGameData(players, sendTo);


  }
}
