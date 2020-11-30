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
  constructor(readonly room: Room) {}

  handleBaseRPC(type: RPCPacketType, senderNetId: number, rawPacket: BaseRPCPacket, reciever: Connection | undefined): void {
    const sender = this.room.findInnerNetObject(senderNetId);

    if (!sender) {
      throw new Error(`RPC packet sent from unknown InnerNetObject: ${senderNetId}`);
    }

    switch (type) {
      case RPCPacketType.PlayAnimation: {
        const packet: PlayAnimationPacket = rawPacket as PlayAnimationPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received PlayAnimation from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handlePlayAnimation(sender as InnerPlayerControl, packet.taskId);
        break;
      }
      case RPCPacketType.CompleteTask: {
        const packet: CompleteTaskPacket = rawPacket as CompleteTaskPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received CompleteTask from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleCompleteTask(sender as InnerPlayerControl, packet.taskIndex);
        break;
      }
      case RPCPacketType.SyncSettings: {
        const packet: SyncSettingsPacket = rawPacket as SyncSettingsPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SyncSettings from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSyncSettings(sender as InnerPlayerControl, packet.options);
        break;
      }
      case RPCPacketType.SetInfected: {
        const packet: SetInfectedPacket = rawPacket as SetInfectedPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetInfected from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSetInfected(sender as InnerPlayerControl, packet.impostorPlayerIds);
        break;
      }
      case RPCPacketType.Exiled: {
        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received Exiled from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleExiled(sender as InnerPlayerControl);
        break;
      }
      case RPCPacketType.CheckName: {
        const packet: CheckNamePacket = rawPacket as CheckNamePacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received CheckName from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleCheckName(sender as InnerPlayerControl, packet.name);
        break;
      }
      case RPCPacketType.SetName: {
        const packet: SetNamePacket = rawPacket as SetNamePacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetName from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSetName(sender as InnerPlayerControl, packet.name);
        break;
      }
      case RPCPacketType.CheckColor: {
        const packet: CheckColorPacket = rawPacket as CheckColorPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received CheckColor from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleCheckColor(sender as InnerPlayerControl, packet.color);
        break;
      }
      case RPCPacketType.SetColor: {
        const packet: SetColorPacket = rawPacket as SetColorPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetColor from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSetColor(sender as InnerPlayerControl, packet.color);
        break;
      }
      case RPCPacketType.SetHat: {
        const packet: SetHatPacket = rawPacket as SetHatPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetHat from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSetHat(sender as InnerPlayerControl, packet.hat);
        break;
      }
      case RPCPacketType.SetSkin: {
        const packet: SetSkinPacket = rawPacket as SetSkinPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetSkin from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSetSkin(sender as InnerPlayerControl, packet.skin);
        break;
      }
      case RPCPacketType.ReportDeadBody: {
        const packet: ReportDeadBodyPacket = rawPacket as ReportDeadBodyPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received ReportDeadBody from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleReportDeadBody(sender as InnerPlayerControl, packet.victimPlayerId);
        break;
      }
      case RPCPacketType.MurderPlayer: {
        const packet: MurderPlayerPacket = rawPacket as MurderPlayerPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received MurderPlayer from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleMurderPlayer(sender as InnerPlayerControl, packet.victimPlayerControlNetId);
        break;
      }
      case RPCPacketType.SendChat: {
        const packet: SendChatPacket = rawPacket as SendChatPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SendChat from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSendChat(sender as InnerPlayerControl, packet.message);
        break;
      }
      case RPCPacketType.StartMeeting: {
        const packet: StartMeetingPacket = rawPacket as StartMeetingPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received StartMeeting from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleStartMeeting(sender as InnerPlayerControl, packet.victimPlayerId);
        break;
      }
      case RPCPacketType.SetScanner: {
        const packet: SetScannerPacket = rawPacket as SetScannerPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SetScanner from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSetScanner(sender as InnerPlayerControl, packet.isScanning, packet.sequenceId);
        break;
      }
      case RPCPacketType.SendChatNote: {
        const packet: SendChatNotePacket = rawPacket as SendChatNotePacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SendChatNote from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSendChatNote(sender as InnerPlayerControl, packet.playerId, packet.noteType);
        break;
      }
      case RPCPacketType.SetPet: {
        const packet: SetPetPacket = rawPacket as SetPetPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SetPet from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSetPet(sender as InnerPlayerControl, packet.pet);
        break;
      }
      case RPCPacketType.SetStartCounter: {
        const packet: SetStartCounterPacket = rawPacket as SetStartCounterPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SetStartCounter from invalid InnerNetObject: expected PlayerControl but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSetStartCounter(sender as InnerPlayerControl, packet.sequenceId, packet.timeRemaining);
        break;
      }
      case RPCPacketType.EnterVent: {
        const packet: EnterVentPacket = rawPacket as EnterVentPacket;

        if (sender.type != InnerNetObjectType.PlayerPhysics) {
          throw new Error(`Received EnterVent from invalid InnerNetObject: expected PlayerPhysics but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleEnterVent(sender as InnerPlayerPhysics, packet.ventId);
        break;
      }
      case RPCPacketType.ExitVent: {
        const packet: ExitVentPacket = rawPacket as ExitVentPacket;

        if (sender.type != InnerNetObjectType.PlayerPhysics) {
          throw new Error(`Received ExitVent from invalid InnerNetObject: expected PlayerPhysics but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleExitVent(sender as InnerPlayerPhysics, packet.ventId);
        break;
      }
      case RPCPacketType.SnapTo: {
        const packet: SnapToPacket = rawPacket as SnapToPacket;

        if (sender.type != InnerNetObjectType.CustomNetworkTransform) {
          throw new Error(`Received SnapTo from invalid InnerNetObject: expected CustomNetworkTransform but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSnapTo(sender as InnerCustomNetworkTransform, packet.position, packet.lastSequenceId);
        break;
      }
      case RPCPacketType.Close: {
        if (sender.type != InnerNetObjectType.MeetingHud) {
          throw new Error(`Received Close from invalid InnerNetObject: expected MeetingHud but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleClose(sender as InnerMeetingHud);
        break;
      }
      case RPCPacketType.VotingComplete: {
        const packet: VotingCompletePacket = rawPacket as VotingCompletePacket;

        if (sender.type != InnerNetObjectType.MeetingHud) {
          throw new Error(`Received VotingComplete from invalid InnerNetObject: expected MeetingHud but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleVotingComplete(sender as InnerMeetingHud, packet.states, packet.isTie, packet.exiledPlayerId);
        break;
      }
      case RPCPacketType.CastVote: {
        const packet: CastVotePacket = rawPacket as CastVotePacket;

        if (sender.type != InnerNetObjectType.MeetingHud) {
          throw new Error(`Received CastVote from invalid InnerNetObject: expected MeetingHud but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleCastVote(sender as InnerMeetingHud, packet.votingPlayerId, packet.suspectPlayerId);
        break;
      }
      case RPCPacketType.ClearVote: {
        if (sender.type != InnerNetObjectType.MeetingHud) {
          throw new Error(`Received ClearVote from invalid InnerNetObject: expected MeetingHud but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleClearVote(sender as InnerMeetingHud, reciever);
        break;
      }
      case RPCPacketType.AddVote: {
        const packet: AddVotePacket = rawPacket as AddVotePacket;

        if (sender.type != InnerNetObjectType.VoteBanSystem) {
          throw new Error(`Received AddVote from invalid InnerNetObject: expected VoteBanSystem but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleAddVote(sender as InnerVoteBanSystem, packet.votingClientId, packet.targetClientId);
        break;
      }
      case RPCPacketType.CloseDoorsOfType: {
        const packet: CloseDoorsOfTypePacket = rawPacket as CloseDoorsOfTypePacket;

        if (!(sender instanceof BaseShipStatus)) {
          throw new Error(`Received CloseDoorsOfType from invalid InnerNetObject: expected BaseShipStatus but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleCloseDoorsOfType(sender as InnerLevel, packet.system);
        break;
      }
      case RPCPacketType.RepairSystem: {
        const packet: RepairSystemPacket = rawPacket as RepairSystemPacket;

        if (!(sender instanceof BaseShipStatus)) {
          throw new Error(`Received RepairSystem from invalid InnerNetObject: expected BaseShipStatus but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleRepairSystem(sender as InnerLevel, packet.system, packet.playerControlNetId, packet.amount);
        break;
      }
      case RPCPacketType.SetTasks: {
        const packet: SetTasksPacket = rawPacket as SetTasksPacket;

        if (sender.type != InnerNetObjectType.GameData) {
          throw new Error(`Received SetTasks from invalid InnerNetObject: expected GameData but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleSetTasks(sender as InnerGameData, packet.playerId, packet.tasks);
        break;
      }
      case RPCPacketType.UpdateGameData: {
        const packet: UpdateGameDataPacket = rawPacket as UpdateGameDataPacket;

        if (sender.type != InnerNetObjectType.GameData) {
          throw new Error(`Received UpdateGameData from invalid InnerNetObject: expected GameData but got ${InnerNetObjectType[sender.type]}`);
        }

        this.handleUpdateGameData(sender as InnerGameData, packet.players);
        break;
      }
      default:
        throw new Error(`Unhandled RPC packet type: ${RPCPacketType[type]}`);
    }
  }

  handlePlayAnimation(sender: InnerPlayerControl, taskId: number): void {
    sender.playAnimation(taskId);
  }

  handleCompleteTask(sender: InnerPlayerControl, taskIndex: number): void {
    sender.completeTask(taskIndex);
  }

  handleSyncSettings(sender: InnerPlayerControl, options: GameOptionsData): void {
    sender.syncSettings(options);
  }

  handleSetInfected(sender: InnerPlayerControl, impostorPlayerIds: number[]): void {
    sender.setInfected(impostorPlayerIds);
  }

  handleExiled(sender: InnerPlayerControl): void {
    sender.exiled();
  }

  handleCheckName(sender: InnerPlayerControl, name: string): void {
    if (!this.room.host) {
      throw new Error("Hostful RPC Handle call sent without room host");
    }

    this.room.host.handleCheckName(sender, name);

    sender.checkName(name);
  }

  handleSetName(sender: InnerPlayerControl, name: string): void {
    sender.setName(name);
  }

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void {
    if (!this.room.host) {
      throw new Error("Hostful RPC Handle call sent without room host");
    }

    this.room.host.handleCheckColor(sender, color);

    sender.checkColor(color);
  }

  handleSetColor(sender: InnerPlayerControl, color: PlayerColor): void {
    sender.setColor(color);
  }

  handleSetHat(sender: InnerPlayerControl, hat: PlayerHat): void {
    sender.setHat(hat);
  }

  handleSetSkin(sender: InnerPlayerControl, skin: PlayerSkin): void {
    sender.setSkin(skin);
  }

  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): void {
    if (!this.room.host) {
      throw new Error("Hostful RPC Handle call sent without room host");
    }

    this.room.host.handleReportDeadBody(sender, victimPlayerId);

    sender.reportDeadBody(victimPlayerId);
  }

  handleMurderPlayer(sender: InnerPlayerControl, victimPlayerControlNetId: number): void {
    sender.murderPlayer(victimPlayerControlNetId);
  }

  handleSendChat(sender: InnerPlayerControl, message: string): void {
    sender.sendChat(message);
  }

  handleStartMeeting(sender: InnerPlayerControl, victimPlayerId?: number): void {
    sender.startMeeting(victimPlayerId);
  }

  /**
   * TODO: Figure out what sequenceId does
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleSetScanner(sender: InnerPlayerControl, isScanning: boolean, _sequenceId: number): void {
    // TODO: Why is sequenceId not being passed?
    sender.setScanner(isScanning);
  }

  handleSendChatNote(sender: InnerPlayerControl, playerId: number, noteType: ChatNoteType): void {
    sender.sendChatNote(playerId, noteType);
  }

  handleSetPet(sender: InnerPlayerControl, pet: PlayerPet): void {
    sender.setPet(pet);
  }

  handleSetStartCounter(sender: InnerPlayerControl, sequenceId: number, timeRemaining: number): void {
    sender.setStartCounter(sequenceId, timeRemaining);
  }

  handleEnterVent(sender: InnerPlayerPhysics, ventId: number): void {
    sender.enterVent(ventId);
  }

  handleExitVent(sender: InnerPlayerPhysics, ventId: number): void {
    sender.exitVent(ventId);
  }

  handleSnapTo(sender: InnerCustomNetworkTransform, position: Vector2, lastSequenceId: number): void {
    sender.snapTo(position, lastSequenceId);
  }

  handleClose(sender: InnerMeetingHud): void {
    sender.close();
  }

  handleVotingComplete(sender: InnerMeetingHud, voteStates: VoteState[], isTie: boolean, exiledPlayerId?: number): void {
    sender.votingComplete(voteStates, isTie, exiledPlayerId);
  }

  handleCastVote(sender: InnerMeetingHud, votingPlayerId: number, suspectPlayerId: number): void {
    sender.castVote(votingPlayerId, suspectPlayerId);
  }

  handleClearVote(sender: InnerMeetingHud, reciever?: Connection): void {
    if (reciever) {
      sender.clearVote([ reciever ]);
    }
  }

  handleAddVote(sender: InnerVoteBanSystem, votingClientId: number, targetClientId: number): void {
    sender.addVote(votingClientId, targetClientId);
  }

  handleCloseDoorsOfType(sender: InnerLevel, system: SystemType): void {
    if (!this.room.host) {
      throw new Error("Hostful RPC Handle call sent without room host");
    }

    this.room.host.handleCloseDoorsOfType(sender, system);

    sender.closeDoorsOfType(system);
  }

  handleRepairSystem(sender: InnerLevel, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void {
    if (!this.room.host) {
      throw new Error("Hostful RPC Handle call sent without room host");
    }

    this.room.host.handleRepairSystem(sender, systemId, playerControlNetId, amount);

    sender.repairSystem(systemId, playerControlNetId, amount);
  }

  handleSetTasks(sender: InnerGameData, playerId: number, tasks: number[]): void {
    sender.setTasks(playerId, tasks);
  }

  handleUpdateGameData(sender: InnerGameData, players: PlayerData[]): void {
    sender.updateGameData(players);
  }
}
