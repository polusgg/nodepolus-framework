import { InnerCustomNetworkTransform, InnerPlayerControl, InnerPlayerPhysics } from "../protocol/entities/player";
import { ChatNoteType, PlayerColor, PlayerHat, PlayerPet, PlayerSkin, SystemType } from "../types/enums";
import { InnerGameData, InnerVoteBanSystem, PlayerData } from "../protocol/entities/gameData";
import { LadderSize, LadderDirection } from "../protocol/packets/rpc/climbLadderPacket";
import { InnerMeetingHud, VoteState } from "../protocol/entities/meetingHud";
import { RepairAmount } from "../protocol/packets/rpc/repairSystem/amounts";
import { InnerNetObjectType } from "../protocol/entities/types/enums";
import { BaseShipStatus } from "../protocol/entities/baseShipStatus";
import { RPCPacketType } from "../protocol/packets/types/enums";
import { Connection } from "../protocol/connection";
import { GameOptionsData, Vector2 } from "../types";
import { Lobby } from ".";
import {
  AddVotePacket,
  BaseRPCPacket,
  CastVotePacket,
  CheckColorPacket,
  CheckNamePacket,
  ClimbLadderPacket,
  CloseDoorsOfTypePacket,
  CompleteTaskPacket,
  EnterVentPacket,
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
  SetSkinPacket,
  SetStartCounterPacket,
  SetTasksPacket,
  SnapToPacket,
  StartMeetingPacket,
  SyncSettingsPacket,
  UpdateGameDataPacket,
  VotingCompletePacket,
} from "../protocol/packets/rpc";

export class RPCHandler {
  constructor(
    public readonly lobby: Lobby,
  ) {}

  handleBaseRPC(type: RPCPacketType, senderNetId: number, rawPacket: BaseRPCPacket, sendTo: Connection[]): void {
    const sender = this.lobby.findInnerNetObject(senderNetId);
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

        this.lobby.emit("player", this.lobby.findPlayerByConnection(this.lobby.findConnection(sender.parent.owner)!)!);
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

        this.handleCloseDoorsOfType(sender as BaseShipStatus, packet.system);
        break;
      }
      case RPCPacketType.RepairSystem: {
        const packet: RepairSystemPacket = rawPacket as RepairSystemPacket;

        if (!(sender instanceof BaseShipStatus)) {
          throw new Error(`Received RepairSystem packet from invalid InnerNetObject: expected BaseShipStatus but got ${type as number} (${typeString})`);
        }

        this.handleRepairSystem(sender as BaseShipStatus, packet.system, packet.playerControlNetId, packet.amount);
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
      case RPCPacketType.ClimbLadder: {
        const packet: ClimbLadderPacket = rawPacket as ClimbLadderPacket;

        if (sender.type != InnerNetObjectType.PlayerPhysics) {
          throw new Error(`Received ClimbLadder packet from invalid InnerNetObject: expected PlayerPhysics but got ${type as number} (${typeString})`);
        }

        this.handleClimbLadder(sender as InnerPlayerPhysics, packet.ladderSize, packet.ladderDirection);
        break;
      }
      case RPCPacketType.UsePlatform: {
        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received UsePlatform packet from invalid InnerNetObject: expected PlayerPhysics but got ${type as number} (${typeString})`);
        }

        this.lobby.customHostInstance.handleUsePlatform(sender as InnerPlayerControl);

        this.handleUsePlatform(sender as InnerPlayerControl);
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
    this.lobby.customHostInstance.handleCompleteTask(sender, taskIndex);

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
    this.lobby.customHostInstance.handleCheckName(sender, name);

    sender.checkName(name, sendTo);
  }

  handleSetName(sender: InnerPlayerControl, name: string, sendTo: Connection[]): void {
    this.lobby.emit("nameChanged", {
      clientId: sender.parent.owner,
      newName: name,
    });

    sender.setName(name, sendTo);
  }

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor, sendTo: Connection[]): void {
    this.lobby.customHostInstance.handleCheckColor(sender, color);

    sender.checkColor(color, sendTo);
  }

  handleSetColor(sender: InnerPlayerControl, color: PlayerColor, sendTo: Connection[]): void {
    this.lobby.emit("colorChanged", {
      clientId: sender.parent.owner,
      newColor: color,
    });

    sender.setColor(color, sendTo);
  }

  handleSetHat(sender: InnerPlayerControl, hat: PlayerHat, sendTo: Connection[]): void {
    this.lobby.emit("hatChanged", {
      clientId: sender.parent.owner,
      newHat: hat,
    });

    sender.setHat(hat, sendTo);
  }

  handleSetSkin(sender: InnerPlayerControl, skin: PlayerSkin, sendTo: Connection[]): void {
    this.lobby.emit("skinChanged", {
      clientId: sender.parent.owner,
      newSkin: skin,
    });

    sender.setSkin(skin, sendTo);
  }

  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId: number | undefined, sendTo: Connection[]): void {
    this.lobby.customHostInstance.handleReportDeadBody(sender, victimPlayerId);

    sender.reportDeadBody(victimPlayerId, sendTo);
  }

  handleMurderPlayer(sender: InnerPlayerControl, victimPlayerControlNetId: number, sendTo: Connection[]): void {
    sender.murderPlayer(victimPlayerControlNetId, sendTo);

    this.lobby.customHostInstance.handleMurderPlayer(sender, victimPlayerControlNetId);
  }

  handleSendChat(sender: InnerPlayerControl, message: string, sendTo: Connection[]): void {
    // const event = new ChatEvent(this.lobby.findPlayerByInnerNetObject(sender)!, TextComponent.from(message));

    // this.lobby.emit("chat", event);

    // if (!event.isCancelled()) {
    sender.sendChat(message, sendTo);
    // }
  }

  handleStartMeeting(sender: InnerPlayerControl, victimPlayerId: number | undefined, sendTo: Connection[]): void {
    sender.startMeeting(victimPlayerId, sendTo);
  }

  handleSetScanner(sender: InnerPlayerControl, isScanning: boolean, sequenceId: number, sendTo: Connection[]): void {
    sender.setScanner(isScanning, sequenceId, sendTo);
  }

  handleSendChatNote(sender: InnerPlayerControl, playerId: number, noteType: ChatNoteType, sendTo: Connection[]): void {
    sender.sendChatNote(playerId, noteType, sendTo);
  }

  handleSetPet(sender: InnerPlayerControl, pet: PlayerPet, sendTo: Connection[]): void {
    this.lobby.emit("petChanged", {
      clientId: sender.parent.owner,
      newPet: pet,
    });

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

    delete this.lobby.meetingHud;
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

  handleCloseDoorsOfType(sender: BaseShipStatus, system: SystemType): void {
    this.lobby.customHostInstance.handleCloseDoorsOfType(sender, system);

    sender.closeDoorsOfType(system);
  }

  handleRepairSystem(sender: BaseShipStatus, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void {
    this.lobby.customHostInstance.handleRepairSystem(sender, systemId, playerControlNetId, amount);

    sender.repairSystem(systemId, playerControlNetId, amount);
  }

  handleClimbLadder(sender: InnerPlayerPhysics, ladderSize: LadderSize, ladderDirection: LadderDirection): void {
    sender.climbLadder(ladderSize, ladderDirection, this.lobby.connections);
  }

  handleUsePlatform(sender: InnerPlayerControl): void {
    this.lobby.customHostInstance.handleUsePlatform(sender);
  }

  handleSetTasks(sender: InnerGameData, playerId: number, tasks: number[], sendTo: Connection[]): void {
    sender.setTasks(playerId, tasks, sendTo);
  }

  handleUpdateGameData(sender: InnerGameData, players: PlayerData[], sendTo: Connection[]): void {
    sender.updateGameData(players, sendTo);
  }
}
