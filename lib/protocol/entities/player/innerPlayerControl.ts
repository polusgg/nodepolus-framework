import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MessageWriter } from "../../../util/hazelMessage";
import { PlayerInstance } from "../../../api/player";
import { BaseInnerNetObject } from "../baseEntity";
import { TextComponent } from "../../../api/text";
import { GameOptionsData } from "../../../types";
import { PlayerData } from "../gameData/types";
import { Connection } from "../../connection";
import { EntityGameData } from "../gameData";
import { EntityPlayer } from ".";
import {
  PlayerChatMessageEvent,
  PlayerChatNoteEvent,
  PlayerColorUpdatedEvent,
  PlayerDiedEvent,
  PlayerHatUpdatedEvent,
  PlayerMurderedEvent,
  PlayerNameUpdatedEvent,
  PlayerPetUpdatedEvent,
  PlayerSkinUpdatedEvent,
  PlayerTaskAnimationEvent,
  PlayerTaskCompletedEvent,
} from "../../../api/events/player";
import {
  ChatNoteType,
  DeathReason,
  GameState,
  InnerNetObjectType,
  PlayerColor,
  PlayerHat,
  PlayerPet,
  PlayerSkin,
  RpcPacketType,
  TaskType,
} from "../../../types/enums";
import {
  BaseRpcPacket,
  CheckColorPacket,
  CheckNamePacket,
  CompleteTaskPacket,
  ExiledPacket,
  MurderPlayerPacket,
  PlayAnimationPacket,
  ReportDeadBodyPacket,
  SendChatNotePacket,
  SendChatPacket,
  SetColorPacket,
  SetHatPacket,
  SetNamePacket,
  SetPetPacket,
  SetScannerPacket,
  SetSkinPacket,
  SetStartCounterPacket,
  SetTasksPacket,
  SyncSettingsPacket,
} from "../../packets/rpc";

export class InnerPlayerControl extends BaseInnerNetObject {
  public scannerSequenceId = 1;

  constructor(
    public readonly parent: EntityPlayer,
    public playerId: number = parent.lobby.getHostInstance().getNextPlayerId(),
    public isNew: boolean = false,
    netId: number = parent.lobby.getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.PlayerControl, parent, netId);
  }

  async playAnimation(taskType: TaskType, sendTo?: Connection[]): Promise<void> {
    const event = new PlayerTaskAnimationEvent(this.getPlayerInstance(), taskType);

    await this.parent.lobby.getServer().emit("player.task.animation", event);

    if (event.isCancelled()) {
      return;
    }

    this.sendRpcPacket(new PlayAnimationPacket(event.getTaskType()), sendTo);
  }

  async completeTask(taskIndex: number, sendTo?: Connection[]): Promise<void> {
    const playerData = this.getPlayerData();
    const taskCount = playerData.tasks.length;

    if (taskCount < taskIndex) {
      throw new Error(`Player ${this.playerId} has fewer tasks (${taskCount}) than the requested index (${taskIndex})`);
    }

    const event = new PlayerTaskCompletedEvent(this.getPlayerInstance(), taskIndex, playerData.tasks[taskIndex][0]);

    await this.parent.lobby.getServer().emit("player.task.completed", event);

    if (event.isCancelled()) {
      const connection = this.getConnection();
      const tasks = [...playerData.tasks];
      const deleted = tasks.splice(taskIndex, 1);

      this.sendRpcPacket(new SetTasksPacket(this.playerId, tasks.map(task => task[0].id)), [connection]);
      tasks.splice(taskIndex, 0, deleted[0]);
      this.sendRpcPacket(new SetTasksPacket(this.playerId, tasks.map(task => task[0].id)), [connection]);

      for (let i = 0; i < tasks.length; i++) {
        if (!tasks[1]) {
          continue;
        }

        this.sendRpcPacket(new CompleteTaskPacket(i), [connection]);
      }

      return;
    }

    playerData.completeTaskAtIndex(taskIndex);
    this.sendRpcPacket(new CompleteTaskPacket(taskIndex), sendTo);
  }

  syncSettings(options: GameOptionsData, sendTo?: Connection[]): void {
    this.sendRpcPacket(new SyncSettingsPacket(options), sendTo);
  }

  async exile(): Promise<void> {
    const event = new PlayerDiedEvent(this.getPlayerInstance(), DeathReason.Unknown);

    await this.parent.lobby.getServer().emit("player.died", event);

    if (event.isCancelled()) {
      return;
    }

    this.getPlayerData().isDead = true;

    this.sendRpcPacket(new ExiledPacket(), [this.getConnection()]);
  }

  async setName(name: string, sendTo?: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerNameUpdatedEvent(player, player.getName(), TextComponent.from(name));

    await this.parent.lobby.getServer().emit("player.name.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewName(event.getOldName());
    }

    this.getPlayerData().name = event.getNewName().toString();

    this.sendRpcPacket(new SetNamePacket(event.getNewName().toString()), sendTo);
  }

  async setColor(color: PlayerColor, sendTo?: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerColorUpdatedEvent(player, player.getColor(), color);

    await this.parent.lobby.getServer().emit("player.color.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewColor(event.getOldColor());
    }

    this.getPlayerData().color = event.getNewColor();

    this.sendRpcPacket(new SetColorPacket(event.getNewColor()), sendTo);
  }

  async setHat(hat: PlayerHat, sendTo?: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerHatUpdatedEvent(player, player.getHat(), hat);

    await this.parent.lobby.getServer().emit("player.hat.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewHat(event.getOldHat());
    }

    this.getPlayerData().hat = event.getNewHat();

    this.sendRpcPacket(new SetHatPacket(event.getNewHat()), sendTo);
  }

  async setPet(pet: PlayerPet, sendTo?: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerPetUpdatedEvent(player, player.getPet(), pet);

    await this.parent.lobby.getServer().emit("player.pet.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewPet(event.getOldPet());
    }

    this.getPlayerData().pet = event.getNewPet();

    this.sendRpcPacket(new SetPetPacket(event.getNewPet()), sendTo);
  }

  async setSkin(skin: PlayerSkin, sendTo?: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerSkinUpdatedEvent(player, player.getSkin(), skin);

    await this.parent.lobby.getServer().emit("player.skin.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewSkin(event.getOldSkin());
    }

    this.getPlayerData().skin = event.getNewSkin();

    this.sendRpcPacket(new SetSkinPacket(event.getNewSkin()), sendTo);
  }

  async murderPlayer(victimPlayerControlNetId: number, sendTo?: Connection[]): Promise<void> {
    const victim = this.parent.lobby.findPlayerByNetId(victimPlayerControlNetId);

    if (!victim) {
      throw new Error("Victim does not have a PlayerInstance on the lobby instance");
    }

    const event = new PlayerMurderedEvent(victim, this.getPlayerInstance());

    await this.parent.lobby.getServer().emit("player.died", event);
    await this.parent.lobby.getServer().emit("player.murdered", event);

    if (event.isCancelled()) {
      // TODO: Find way to despawn dead body
      return;
    }

    victim.getGameDataEntry().isDead = true;

    this.sendRpcPacket(new MurderPlayerPacket(victimPlayerControlNetId), sendTo);
  }

  async sendChat(message: string, sendTo?: Connection[]): Promise<void> {
    const event = new PlayerChatMessageEvent(this.getPlayerInstance(), TextComponent.from(message));

    await this.parent.lobby.getServer().emit("player.chat.message", event);

    if (event.isCancelled()) {
      return;
    }

    this.sendRpcPacket(new SendChatPacket(message), sendTo);
  }

  setScanner(isScanning: boolean, sequenceId: number, sendTo?: Connection[]): void {
    this.scannerSequenceId++;

    if (sequenceId < this.scannerSequenceId) {
      return;
    }

    this.sendRpcPacket(new SetScannerPacket(isScanning, this.scannerSequenceId), sendTo);
  }

  async sendChatNote(playerId: number, chatNoteType: ChatNoteType, sendTo?: Connection[]): Promise<void> {
    const event = new PlayerChatNoteEvent(this.getPlayerInstance(), chatNoteType);

    await this.parent.lobby.getServer().emit("player.chat.note", event);

    if (event.isCancelled()) {
      return;
    }

    this.sendRpcPacket(new SendChatNotePacket(playerId, chatNoteType), sendTo);
  }

  async handleRpc(connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, sendTo: Connection[]): Promise<void> {
    switch (type) {
      case RpcPacketType.PlayAnimation:
        this.playAnimation((packet as PlayAnimationPacket).taskType, sendTo);
        break;
      case RpcPacketType.CompleteTask: {
        if (this.parent.lobby.getGameState() == GameState.Ended || this.parent.lobby.getGameState() == GameState.Destroyed) {
          return;
        }

        this.completeTask((packet as CompleteTaskPacket).taskIndex, sendTo);
        // TODO: InnerNetObject refactor
        this.parent.lobby.getHostInstance().handleCompleteTask();
        break;
      }
      case RpcPacketType.SyncSettings:
        this.syncSettings((packet as SyncSettingsPacket).options, sendTo);
        break;
      case RpcPacketType.SetInfected:
        this.parent.lobby.getLogger().warn("Received SetInfected packet from connection %s in a server-as-host state", connection);
        break;
      case RpcPacketType.Exiled:
        this.parent.lobby.getLogger().warn("Received Exiled packet from connection %s in a server-as-host state", connection);
        break;
      case RpcPacketType.CheckName:
        // TODO: InnerNetObject refactor
        this.parent.lobby.getHostInstance().handleCheckName(this, (packet as CheckNamePacket).name);
        break;
      case RpcPacketType.SetName:
        this.parent.lobby.getLogger().warn("Received SetName packet from connection %s in a server-as-host state", connection);
        break;
      case RpcPacketType.CheckColor:
        // TODO: InnerNetObject refactor
        this.parent.lobby.getHostInstance().handleCheckColor(this, (packet as CheckColorPacket).color);
        break;
      case RpcPacketType.SetColor:
        // TODO: InnerNetObject refactor
        this.parent.lobby.getHostInstance().handleSetColor(this, (packet as SetColorPacket).color);
        break;
      case RpcPacketType.SetHat:
        this.setHat((packet as SetHatPacket).hat, sendTo);
        break;
      case RpcPacketType.SetSkin:
        this.setSkin((packet as SetSkinPacket).skin, sendTo);
        break;
      case RpcPacketType.ReportDeadBody:
        // TODO: InnerNetObject refactor
        this.parent.lobby.getHostInstance().handleReportDeadBody(this, (packet as ReportDeadBodyPacket).victimPlayerId);
        break;
      case RpcPacketType.MurderPlayer: {
        const data = packet as MurderPlayerPacket;

        await this.murderPlayer(data.victimPlayerControlNetId, sendTo);

        // TODO: InnerNetObject refactor
        this.parent.lobby.getHostInstance().handleMurderPlayer(this, data.victimPlayerControlNetId);
        break;
      }
      case RpcPacketType.SendChat:
        this.sendChat((packet as SendChatPacket).message, sendTo);
        break;
      case RpcPacketType.StartMeeting:
        this.parent.lobby.getLogger().warn("Received StartMeeting packet from connection %s in a server-as-host state", connection);
        break;
      case RpcPacketType.SetScanner: {
        const data = packet as SetScannerPacket;

        this.setScanner(data.isScanning, data.sequenceId, sendTo);
        break;
      }
      case RpcPacketType.SendChatNote: {
        const data = packet as SendChatNotePacket;

        this.sendChatNote(data.playerId, data.chatNoteType, sendTo);
        break;
      }
      case RpcPacketType.SetPet:
        this.setPet((packet as SetPetPacket).pet, sendTo);
        break;
      case RpcPacketType.SetStartCounter: {
        // TODO: InnerNetObject refactor
        const data = packet as SetStartCounterPacket;
        const player = this.parent.lobby.findPlayerByClientId(this.parent.owner);

        if (!player) {
          throw new Error(`Client ${this.parent.owner} does not have a PlayerInstance on the lobby instance`);
        }

        this.parent.lobby.getHostInstance().handleSetStartCounter(player, data.sequenceId, data.timeRemaining);
        break;
      }
      case RpcPacketType.UsePlatform:
        // TODO: InnerNetObject refactor
        this.parent.lobby.getHostInstance().handleUsePlatform(this);
        break;
      default:
        break;
    }
  }

  serializeData(): DataPacket {
    return new DataPacket(
      this.netId,
      new MessageWriter().writeByte(this.playerId),
    );
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(
      this.netId,
      new MessageWriter()
        .writeBoolean(this.isNew)
        .writeByte(this.playerId),
    );
  }

  clone(): InnerPlayerControl {
    return new InnerPlayerControl(this.parent, this.playerId, this.isNew, this.netId);
  }

  private getPlayerInstance(): PlayerInstance {
    const playerInstance = this.parent.lobby.findPlayerByPlayerId(this.playerId);

    if (!playerInstance) {
      throw new Error(`Player ${this.playerId} does not have a PlayerInstance on the lobby instance`);
    }

    return playerInstance;
  }

  private getConnection(): Connection {
    const playerInstance = this.getPlayerInstance();
    const playerConnection = playerInstance.getConnection();

    if (playerConnection === undefined) {
      throw new Error(`Player ${playerInstance.getId()} does not have a connection`);
    }

    return playerConnection;
  }

  private getGameData(): EntityGameData {
    const gameData = this.parent.lobby.getGameData();

    if (!gameData) {
      throw new Error("Lobby does not have a GameData instance");
    }

    return gameData;
  }

  private getGameDataIndex(playerId: number = this.playerId): number {
    const gameDataIndex: number = this.getGameData().gameData.players.findIndex(p => p.id == playerId);

    if (gameDataIndex == -1) {
      throw new Error(`Player ${playerId} does not have a PlayerData instance in GameData`);
    }

    return gameDataIndex;
  }

  private getPlayerData(playerId: number = this.playerId): PlayerData {
    const gameData = this.getGameData();
    const gameDataPlayerIndex = this.getGameDataIndex(playerId);

    return gameData.gameData.players[gameDataPlayerIndex];
  }
}
