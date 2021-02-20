import { ChatNoteType, GameState, PlayerColor, PlayerHat, PlayerPet, PlayerSkin, SystemType, TaskType, TeleportReason } from "../types/enums";
import { InnerCustomNetworkTransform, InnerPlayerControl, InnerPlayerPhysics } from "../protocol/entities/player";
import { LadderSize, LadderDirection } from "../protocol/packets/rpc/climbLadderPacket";
import { RepairAmount } from "../protocol/packets/rpc/repairSystem/amounts";
import { BaseInnerShipStatus } from "../protocol/entities/baseShipStatus";
import { InnerNetObjectType } from "../protocol/entities/types/enums";
import { InnerVoteBanSystem } from "../protocol/entities/gameData";
import { InnerMeetingHud } from "../protocol/entities/meetingHud";
import { RpcPacketType } from "../protocol/packets/types/enums";
import { Connection } from "../protocol/connection";
import { GameOptionsData, Vector2 } from "../types";
import { MaxValue } from "../util/constants";
import { InternalLobby } from ".";
import { Vents } from "../static";
import {
  AddVotePacket,
  BaseRpcPacket,
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
  SetPetPacket,
  SetScannerPacket,
  SetSkinPacket,
  SetStartCounterPacket,
  SnapToPacket,
  SyncSettingsPacket,
} from "../protocol/packets/rpc";

export class RpcHandler {
  constructor(
    private readonly lobby: InternalLobby,
  ) {}

  handleBaseRpc(type: RpcPacketType, connection: Connection, senderNetId: number, rawPacket: BaseRpcPacket, sendTo: Connection[]): void {
    if (senderNetId === MaxValue.UInt32) {
      this.lobby.getLogger().warn("RPC packet sent from unexpected InnerNetObject: -1");

      return;
    }

    const sender = this.lobby.findInnerNetObject(senderNetId);
    const typeString = InnerNetObjectType[type];

    if (!sender) {
      throw new Error(`RPC packet sent from unknown InnerNetObject: ${senderNetId}`);
    }

    switch (type) {
      case RpcPacketType.PlayAnimation: {
        const packet: PlayAnimationPacket = rawPacket as PlayAnimationPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received PlayAnimation packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handlePlayAnimation(sender as InnerPlayerControl, packet.taskType, sendTo);
        break;
      }
      case RpcPacketType.CompleteTask: {
        const packet: CompleteTaskPacket = rawPacket as CompleteTaskPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received CompleteTask packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleCompleteTask(sender as InnerPlayerControl, packet.taskIndex, sendTo);
        break;
      }
      case RpcPacketType.SyncSettings: {
        const packet: SyncSettingsPacket = rawPacket as SyncSettingsPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SyncSettings packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSyncSettings(sender as InnerPlayerControl, packet.options, sendTo);
        break;
      }
      case RpcPacketType.SetInfected: {
        this.lobby.getLogger().warn("Received SetInfected packet from connection %s in a server-as-host state", connection);
        break;
      }
      case RpcPacketType.Exiled: {
        this.lobby.getLogger().warn("Received Exiled packet from connection %s in a server-as-host state", connection);
        break;
      }
      case RpcPacketType.CheckName: {
        const packet: CheckNamePacket = rawPacket as CheckNamePacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received CheckName packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleCheckName(sender as InnerPlayerControl, packet.name);
        break;
      }
      case RpcPacketType.SetName: {
        this.lobby.getLogger().warn("Received SetName packet from connection %s in a server-as-host state", connection);
        break;
      }
      case RpcPacketType.CheckColor: {
        const packet: CheckColorPacket = rawPacket as CheckColorPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received CheckColor packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleCheckColor(sender as InnerPlayerControl, packet.color);
        break;
      }
      case RpcPacketType.SetColor: {
        const packet: SetColorPacket = rawPacket as SetColorPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetColor packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetColor(sender as InnerPlayerControl, packet.color);
        break;
      }
      case RpcPacketType.SetHat: {
        const packet: SetHatPacket = rawPacket as SetHatPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetHat packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetHat(sender as InnerPlayerControl, packet.hat, sendTo);
        break;
      }
      case RpcPacketType.SetSkin: {
        const packet: SetSkinPacket = rawPacket as SetSkinPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received SetSkin packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetSkin(sender as InnerPlayerControl, packet.skin, sendTo);
        break;
      }
      case RpcPacketType.ReportDeadBody: {
        const packet: ReportDeadBodyPacket = rawPacket as ReportDeadBodyPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received ReportDeadBody packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleReportDeadBody(sender as InnerPlayerControl, packet.victimPlayerId);
        break;
      }
      case RpcPacketType.MurderPlayer: {
        const packet: MurderPlayerPacket = rawPacket as MurderPlayerPacket;

        if (!(sender instanceof InnerPlayerControl)) {
          throw new Error(`Received MurderPlayer packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleMurderPlayer(sender as InnerPlayerControl, packet.victimPlayerControlNetId, sendTo);
        break;
      }
      case RpcPacketType.SendChat: {
        const packet: SendChatPacket = rawPacket as SendChatPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SendChat packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSendChat(sender as InnerPlayerControl, packet.message, sendTo);
        break;
      }
      case RpcPacketType.StartMeeting: {
        this.lobby.getLogger().warn("Received StartMeeting packet from connection %s in a server-as-host state", connection);
        break;
      }
      case RpcPacketType.SetScanner: {
        const packet: SetScannerPacket = rawPacket as SetScannerPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SetScanner packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetScanner(sender as InnerPlayerControl, packet.isScanning, packet.sequenceId, sendTo);
        break;
      }
      case RpcPacketType.SendChatNote: {
        const packet: SendChatNotePacket = rawPacket as SendChatNotePacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SendChatNote packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSendChatNote(sender as InnerPlayerControl, packet.playerId, packet.chatNoteType, sendTo);
        break;
      }
      case RpcPacketType.SetPet: {
        const packet: SetPetPacket = rawPacket as SetPetPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SetPet packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetPet(sender as InnerPlayerControl, packet.pet, sendTo);
        break;
      }
      case RpcPacketType.SetStartCounter: {
        const packet: SetStartCounterPacket = rawPacket as SetStartCounterPacket;

        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received SetStartCounter packet from invalid InnerNetObject: expected PlayerControl but got ${type as number} (${typeString})`);
        }

        this.handleSetStartCounter(sender as InnerPlayerControl, packet.sequenceId, packet.timeRemaining);
        break;
      }
      case RpcPacketType.EnterVent: {
        const packet: EnterVentPacket = rawPacket as EnterVentPacket;

        if (sender.type != InnerNetObjectType.PlayerPhysics) {
          throw new Error(`Received EnterVent packet from invalid InnerNetObject: expected PlayerPhysics but got ${type as number} (${typeString})`);
        }

        this.handleEnterVent(sender as InnerPlayerPhysics, packet.ventId, sendTo);
        break;
      }
      case RpcPacketType.ExitVent: {
        const packet: ExitVentPacket = rawPacket as ExitVentPacket;

        if (sender.type != InnerNetObjectType.PlayerPhysics) {
          throw new Error(`Received ExitVent packet from invalid InnerNetObject: expected PlayerPhysics but got ${type as number} (${typeString})`);
        }

        this.handleExitVent(sender as InnerPlayerPhysics, packet.ventId, sendTo);
        break;
      }
      case RpcPacketType.SnapTo: {
        const packet: SnapToPacket = rawPacket as SnapToPacket;

        if (sender.type != InnerNetObjectType.CustomNetworkTransform) {
          throw new Error(`Received SnapTo packet from invalid InnerNetObject: expected CustomNetworkTransform but got ${type as number} (${typeString})`);
        }

        this.handleSnapTo(sender as InnerCustomNetworkTransform, packet.position, packet.lastSequenceId, sendTo);
        break;
      }
      case RpcPacketType.Close: {
        this.lobby.getLogger().warn("Received Close packet from connection %s in a server-as-host state", connection);
        break;
      }
      case RpcPacketType.VotingComplete: {
        this.lobby.getLogger().warn("Received VotingComplete packet from connection %s in a server-as-host state", connection);
        break;
      }
      case RpcPacketType.CastVote: {
        const packet: CastVotePacket = rawPacket as CastVotePacket;

        if (sender.type != InnerNetObjectType.MeetingHud) {
          throw new Error(`Received CastVote packet from invalid InnerNetObject: expected MeetingHud but got ${type as number} (${typeString})`);
        }

        this.handleCastVote(sender as InnerMeetingHud, packet.votingPlayerId, packet.suspectPlayerId);
        break;
      }
      case RpcPacketType.ClearVote: {
        this.lobby.getLogger().warn("Received ClearVote packet from connection %s in a server-as-host state", connection);
        break;
      }
      case RpcPacketType.AddVote: {
        const packet: AddVotePacket = rawPacket as AddVotePacket;

        if (sender.type != InnerNetObjectType.VoteBanSystem) {
          throw new Error(`Received AddVote packet from invalid InnerNetObject: expected VoteBanSystem but got ${type as number} (${typeString})`);
        }

        this.handleAddVote(sender as InnerVoteBanSystem, packet.votingClientId, packet.targetClientId, sendTo);
        break;
      }
      case RpcPacketType.CloseDoorsOfType: {
        const packet: CloseDoorsOfTypePacket = rawPacket as CloseDoorsOfTypePacket;

        if (!(sender instanceof BaseInnerShipStatus)) {
          throw new Error(`Received CloseDoorsOfType packet from invalid InnerNetObject: expected BaseShipStatus but got ${type as number} (${typeString})`);
        }

        this.handleCloseDoorsOfType(sender as BaseInnerShipStatus, packet.system);
        break;
      }
      case RpcPacketType.RepairSystem: {
        const packet: RepairSystemPacket = rawPacket as RepairSystemPacket;

        if (!(sender instanceof BaseInnerShipStatus)) {
          throw new Error(`Received RepairSystem packet from invalid InnerNetObject: expected BaseShipStatus but got ${type as number} (${typeString})`);
        }

        this.handleRepairSystem(sender as BaseInnerShipStatus, packet.system, packet.playerControlNetId, packet.getAmount());
        break;
      }
      case RpcPacketType.SetTasks: {
        this.lobby.getLogger().warn("Received SetTasks packet from connection %s in a server-as-host state", connection);
        break;
      }
      case RpcPacketType.UpdateGameData: {
        break;
      }
      case RpcPacketType.ClimbLadder: {
        const packet: ClimbLadderPacket = rawPacket as ClimbLadderPacket;

        if (sender.type != InnerNetObjectType.PlayerPhysics) {
          throw new Error(`Received ClimbLadder packet from invalid InnerNetObject: expected PlayerPhysics but got ${type as number} (${typeString})`);
        }

        this.handleClimbLadder(sender as InnerPlayerPhysics, packet.ladderSize, packet.ladderDirection);
        break;
      }
      case RpcPacketType.UsePlatform: {
        if (sender.type != InnerNetObjectType.PlayerControl) {
          throw new Error(`Received UsePlatform packet from invalid InnerNetObject: expected PlayerPhysics but got ${type as number} (${typeString})`);
        }

        this.lobby.getHostInstance().handleUsePlatform(sender as InnerPlayerControl);
        this.handleUsePlatform(sender as InnerPlayerControl);
        break;
      }
      default:
        throw new Error(`Attempted to handle an unimplemented RPC packet type: ${type as number} (${RpcPacketType[type]})`);
    }
  }

  handlePlayAnimation(sender: InnerPlayerControl, taskType: TaskType, sendTo: Connection[]): void {
    sender.playAnimation(taskType, sendTo);
  }

  handleCompleteTask(sender: InnerPlayerControl, taskIndex: number, sendTo: Connection[]): void {
    if (this.lobby.getGameState() == GameState.Ended || this.lobby.getGameState() == GameState.Destroyed) {
      return;
    }

    sender.completeTask(taskIndex, sendTo);
    this.lobby.getHostInstance().handleCompleteTask();
  }

  handleSyncSettings(sender: InnerPlayerControl, options: GameOptionsData, sendTo: Connection[]): void {
    sender.syncSettings(options, sendTo);
  }

  handleCheckName(sender: InnerPlayerControl, name: string): void {
    this.lobby.getHostInstance().handleCheckName(sender, name);
  }

  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void {
    this.lobby.getHostInstance().handleCheckColor(sender, color);
  }

  handleSetColor(sender: InnerPlayerControl, color: PlayerColor): void {
    this.lobby.getHostInstance().handleSetColor(sender, color);
  }

  handleSetHat(sender: InnerPlayerControl, hat: PlayerHat, sendTo: Connection[]): void {
    sender.setHat(hat, sendTo);
  }

  handleSetSkin(sender: InnerPlayerControl, skin: PlayerSkin, sendTo: Connection[]): void {
    sender.setSkin(skin, sendTo);
  }

  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): void {
    this.lobby.getHostInstance().handleReportDeadBody(sender, victimPlayerId);
  }

  async handleMurderPlayer(sender: InnerPlayerControl, victimPlayerControlNetId: number, sendTo: Connection[]): Promise<void> {
    await sender.murderPlayer(victimPlayerControlNetId, sendTo);

    this.lobby.getHostInstance().handleMurderPlayer(sender, victimPlayerControlNetId);
  }

  handleSendChat(sender: InnerPlayerControl, message: string, sendTo: Connection[]): void {
    sender.sendChat(message, sendTo);
  }

  handleSetScanner(sender: InnerPlayerControl, isScanning: boolean, sequenceId: number, sendTo: Connection[]): void {
    sender.setScanner(isScanning, sequenceId, sendTo);
  }

  handleSendChatNote(sender: InnerPlayerControl, playerId: number, noteType: ChatNoteType, sendTo: Connection[]): void {
    sender.sendChatNote(playerId, noteType, sendTo);
  }

  handleSetPet(sender: InnerPlayerControl, pet: PlayerPet, sendTo: Connection[]): void {
    sender.setPet(pet, sendTo);
  }

  handleSetStartCounter(sender: InnerPlayerControl, sequenceId: number, timeRemaining: number): void {
    const player = sender.parent.lobby.findPlayerByClientId(sender.parent.owner);

    if (!player) {
      throw new Error(`Client ${sender.parent.owner} does not have a PlayerInstance on the lobby instance`);
    }

    this.lobby.getHostInstance().handleSetStartCounter(player, sequenceId, timeRemaining);
  }

  handleEnterVent(sender: InnerPlayerPhysics, ventId: number, sendTo: Connection[]): void {
    sender.enterVent(Vents.forLevelFromId(this.lobby.getLevel(), ventId), sendTo);
  }

  handleExitVent(sender: InnerPlayerPhysics, ventId: number, sendTo: Connection[]): void {
    sender.exitVent(Vents.forLevelFromId(this.lobby.getLevel(), ventId), sendTo);
  }

  handleSnapTo(sender: InnerCustomNetworkTransform, position: Vector2, _lastSequenceId: number, sendTo: Connection[]): void {
    sender.snapTo(position, sendTo, TeleportReason.Unknown);
  }

  handleCastVote(sender: InnerMeetingHud, votingPlayerId: number, suspectPlayerId: number): void {
    sender.castVote(votingPlayerId, suspectPlayerId);
  }

  handleAddVote(sender: InnerVoteBanSystem, votingClientId: number, targetClientId: number, sendTo: Connection[]): void {
    const voter = this.lobby.findPlayerByClientId(votingClientId);
    const target = this.lobby.findPlayerByClientId(targetClientId);

    if (!voter) {
      throw new Error(`Voting client ${sender.parent.owner} does not have a PlayerInstance on the lobby instance`);
    }

    if (!target) {
      throw new Error(`Target client ${sender.parent.owner} does not have a PlayerInstance on the lobby instance`);
    }

    sender.addVote(voter, target, sendTo);
  }

  handleCloseDoorsOfType(sender: BaseInnerShipStatus, system: SystemType): void {
    this.lobby.getHostInstance().handleCloseDoorsOfType(sender, system);

    sender.closeDoorsOfType(system);
  }

  handleRepairSystem(sender: BaseInnerShipStatus, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void {
    this.lobby.getHostInstance().handleRepairSystem(sender, systemId, playerControlNetId, amount);

    sender.repairSystem(systemId, playerControlNetId, amount);
  }

  handleClimbLadder(sender: InnerPlayerPhysics, ladderSize: LadderSize, ladderDirection: LadderDirection): void {
    sender.climbLadder(ladderSize, ladderDirection, this.lobby.getConnections());
  }

  handleUsePlatform(sender: InnerPlayerControl): void {
    this.lobby.getHostInstance().handleUsePlatform(sender);
  }
}
