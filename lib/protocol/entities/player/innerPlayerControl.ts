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
  protected scanning = false;
  protected scannerSequenceId = 1;

  constructor(
    protected readonly parent: EntityPlayer,
    protected playerId: number = parent.getLobby().getHostInstance().getNextPlayerId(),
    protected newPlayer: boolean = false,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.PlayerControl, parent, netId);
  }

  getPlayerId(): number {
    return this.playerId;
  }

  setPlayerId(playerId: number): this {
    this.playerId = playerId;

    return this;
  }

  isNewPlayer(): boolean {
    return this.newPlayer;
  }

  setNewPlayer(newPlayer: boolean): this {
    this.newPlayer = newPlayer;

    return this;
  }

  isScanning(): boolean {
    return this.scanning;
  }

  setScanning(scanning: boolean): this {
    this.scanning = scanning;

    return this;
  }

  getScannerSequenceId(): number {
    return this.scannerSequenceId;
  }

  setScannerSequenceId(scannerSequenceId: number): this {
    this.scannerSequenceId = scannerSequenceId;

    return this;
  }

  async playAnimation(taskType: TaskType, sendTo?: Connection[]): Promise<void> {
    const event = new PlayerTaskAnimationEvent(this.getPlayerInstance(), taskType);

    await this.parent.getLobby().getServer().emit("player.task.animation", event);

    if (event.isCancelled()) {
      return;
    }

    this.sendRpcPacket(new PlayAnimationPacket(event.getTaskType()), sendTo);
  }

  async completeTask(taskIndex: number, sendTo?: Connection[]): Promise<void> {
    const playerData = this.getPlayerData();
    const taskCount = playerData.getTasks().length;

    if (taskCount < taskIndex) {
      throw new Error(`Player ${this.playerId} has fewer tasks (${taskCount}) than the requested index (${taskIndex})`);
    }

    const event = new PlayerTaskCompletedEvent(this.getPlayerInstance(), taskIndex, playerData.getTasks()[taskIndex][0]);

    await this.parent.getLobby().getServer().emit("player.task.completed", event);

    if (event.isCancelled()) {
      const connection = this.getConnection();
      const tasks = [...playerData.getTasks()];
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

    await this.parent.getLobby().getServer().emit("player.died", event);

    if (event.isCancelled()) {
      return;
    }

    this.getPlayerData().setDead(true);
    this.sendRpcPacket(new ExiledPacket(), [this.getConnection()]);
  }

  async setName(name: string, sendTo?: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerNameUpdatedEvent(player, player.getName(), TextComponent.from(name));

    await this.parent.getLobby().getServer().emit("player.name.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewName(event.getOldName());
    }

    this.getPlayerData().setName(event.getNewName().toString());
    this.sendRpcPacket(new SetNamePacket(event.getNewName().toString()), sendTo);
  }

  async setColor(color: PlayerColor, sendTo?: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerColorUpdatedEvent(player, player.getColor(), color);

    await this.parent.getLobby().getServer().emit("player.color.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewColor(event.getOldColor());
    }

    this.getPlayerData().setColor(event.getNewColor());
    this.sendRpcPacket(new SetColorPacket(event.getNewColor()), sendTo);
  }

  async setHat(hat: PlayerHat, sendTo?: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerHatUpdatedEvent(player, player.getHat(), hat);

    await this.parent.getLobby().getServer().emit("player.hat.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewHat(event.getOldHat());
    }

    this.getPlayerData().setHat(event.getNewHat());
    this.sendRpcPacket(new SetHatPacket(event.getNewHat()), sendTo);
  }

  async setPet(pet: PlayerPet, sendTo?: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerPetUpdatedEvent(player, player.getPet(), pet);

    await this.parent.getLobby().getServer().emit("player.pet.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewPet(event.getOldPet());
    }

    this.getPlayerData().setPet(event.getNewPet());
    this.sendRpcPacket(new SetPetPacket(event.getNewPet()), sendTo);
  }

  async setSkin(skin: PlayerSkin, sendTo?: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerSkinUpdatedEvent(player, player.getSkin(), skin);

    await this.parent.getLobby().getServer().emit("player.skin.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewSkin(event.getOldSkin());
    }

    this.getPlayerData().setSkin(event.getNewSkin());
    this.sendRpcPacket(new SetSkinPacket(event.getNewSkin()), sendTo);
  }

  async murderPlayer(victimPlayerControlNetId: number, sendTo?: Connection[]): Promise<void> {
    const victim = this.parent.getLobby().findPlayerByNetId(victimPlayerControlNetId);

    if (victim === undefined) {
      throw new Error("Victim does not have a PlayerInstance on the lobby instance");
    }

    const event = new PlayerMurderedEvent(victim, this.getPlayerInstance());

    await this.parent.getLobby().getServer().emit("player.died", event);
    await this.parent.getLobby().getServer().emit("player.murdered", event);

    if (event.isCancelled()) {
      // TODO: Find way to despawn dead body
      return;
    }

    victim.getGameDataEntry().setDead(true);
    this.sendRpcPacket(new MurderPlayerPacket(victimPlayerControlNetId), sendTo);
  }

  async sendChat(message: string, sendTo?: Connection[]): Promise<void> {
    const event = new PlayerChatMessageEvent(this.getPlayerInstance(), TextComponent.from(message));

    await this.parent.getLobby().getServer().emit("player.chat.message", event);

    if (event.isCancelled()) {
      return;
    }

    this.sendRpcPacket(new SendChatPacket(message), sendTo);
  }

  setScanner(isScanning: boolean, sequenceId: number, sendTo?: Connection[]): void {
    if (sequenceId < ++this.scannerSequenceId) {
      return;
    }

    this.scanning = isScanning;

    this.sendRpcPacket(new SetScannerPacket(isScanning, this.scannerSequenceId), sendTo);
  }

  async sendChatNote(playerId: number, chatNoteType: ChatNoteType, sendTo?: Connection[]): Promise<void> {
    const event = new PlayerChatNoteEvent(this.getPlayerInstance(), chatNoteType);

    await this.parent.getLobby().getServer().emit("player.chat.note", event);

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
        if (this.parent.getLobby().getGameState() == GameState.Ended || this.parent.getLobby().getGameState() == GameState.Destroyed) {
          return;
        }

        this.completeTask((packet as CompleteTaskPacket).taskIndex, sendTo);
        // TODO: InnerNetObject refactor
        this.parent.getLobby().getHostInstance().handleCompleteTask();
        break;
      }
      case RpcPacketType.SyncSettings:
        // TODO: InnerNetObject refactor
        this.parent.getLobby().getHostInstance().handleSyncSettings(this, (packet as SyncSettingsPacket).options);
        // this.syncSettings((packet as SyncSettingsPacket).options, sendTo);
        break;
      case RpcPacketType.SetInfected:
        this.parent.getLobby().getLogger().warn("Received SetInfected packet from connection %s in a server-as-host state", connection);
        break;
      case RpcPacketType.Exiled:
        this.parent.getLobby().getLogger().warn("Received Exiled packet from connection %s in a server-as-host state", connection);
        break;
      case RpcPacketType.CheckName:
        // TODO: InnerNetObject refactor
        this.parent.getLobby().getHostInstance().handleCheckName(this, (packet as CheckNamePacket).name);
        break;
      case RpcPacketType.SetName:
        this.parent.getLobby().getLogger().warn("Received SetName packet from connection %s in a server-as-host state", connection);
        break;
      case RpcPacketType.CheckColor:
        // TODO: InnerNetObject refactor
        this.parent.getLobby().getHostInstance().handleCheckColor(this, (packet as CheckColorPacket).color);
        break;
      case RpcPacketType.SetColor:
        // TODO: InnerNetObject refactor
        this.parent.getLobby().getHostInstance().handleSetColor(this, (packet as SetColorPacket).color);
        break;
      case RpcPacketType.SetHat:
        this.setHat((packet as SetHatPacket).hat, sendTo);
        break;
      case RpcPacketType.SetSkin:
        this.setSkin((packet as SetSkinPacket).skin, sendTo);
        break;
      case RpcPacketType.ReportDeadBody:
        // TODO: InnerNetObject refactor
        this.parent.getLobby().getHostInstance().handleReportDeadBody(this, (packet as ReportDeadBodyPacket).victimPlayerId);
        break;
      case RpcPacketType.MurderPlayer: {
        const data = packet as MurderPlayerPacket;

        await this.murderPlayer(data.victimPlayerControlNetId, sendTo);

        // TODO: InnerNetObject refactor
        this.parent.getLobby().getHostInstance().handleMurderPlayer(this, data.victimPlayerControlNetId);
        break;
      }
      case RpcPacketType.SendChat:
        this.sendChat((packet as SendChatPacket).message, sendTo);
        break;
      case RpcPacketType.StartMeeting:
        this.parent.getLobby().getLogger().warn("Received StartMeeting packet from connection %s in a server-as-host state", connection);
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
        const player = this.parent.getLobby().findPlayerByClientId(this.parent.getOwnerId());

        if (player === undefined) {
          throw new Error(`Client ${this.parent.getOwnerId()} does not have a PlayerInstance on the lobby instance`);
        }

        this.parent.getLobby().getHostInstance().handleSetStartCounter(player, data.sequenceId, data.timeRemaining);
        break;
      }
      case RpcPacketType.UsePlatform:
        // TODO: InnerNetObject refactor
        this.parent.getLobby().getHostInstance().handleUsePlatform(this);
        break;
      default:
        break;
    }
  }

  getParent(): EntityPlayer {
    return this.parent;
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
        .writeBoolean(this.newPlayer)
        .writeByte(this.playerId),
    );
  }

  clone(): InnerPlayerControl {
    const clone = new InnerPlayerControl(this.parent, this.playerId, this.newPlayer, this.netId);

    clone.scanning = this.scanning;
    clone.scannerSequenceId = this.scannerSequenceId;

    return clone;
  }

  protected getPlayerInstance(): PlayerInstance {
    const player = this.parent.getLobby().findPlayerByPlayerId(this.playerId);

    if (player === undefined) {
      throw new Error(`Player ${this.playerId} does not have a PlayerInstance on the lobby instance`);
    }

    return player;
  }

  protected getConnection(): Connection {
    const playerInstance = this.getPlayerInstance();
    const playerConnection = playerInstance.getConnection();

    if (playerConnection === undefined) {
      throw new Error(`Player ${playerInstance.getId()} does not have a connection`);
    }

    return playerConnection;
  }

  protected getGameData(): EntityGameData {
    const gameData = this.parent.getLobby().getGameData();

    if (gameData === undefined) {
      throw new Error("Lobby does not have a GameData instance");
    }

    return gameData;
  }

  protected getPlayerData(playerId: number = this.playerId): PlayerData {
    const gameData = this.getGameData();

    return gameData.getGameData().getPlayer(playerId)!;
  }
}
