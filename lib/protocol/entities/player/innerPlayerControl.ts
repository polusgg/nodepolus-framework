import { ChatNoteType, DeathReason, PlayerColor, PlayerHat, PlayerPet, PlayerSkin, TaskType } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { PlayerInstance } from "../../../api/player";
import { InnerNetObjectType } from "../types/enums";
import { DataPacket } from "../../packets/gameData";
import { TextComponent } from "../../../api/text";
import { GameOptionsData } from "../../../types";
import { InternalLobby } from "../../../lobby";
import { PlayerData } from "../gameData/types";
import { Connection } from "../../connection";
import { BaseInnerNetObject } from "../types";
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
  CompleteTaskPacket,
  ExiledPacket,
  MurderPlayerPacket,
  PlayAnimationPacket,
  SendChatNotePacket,
  SendChatPacket,
  SetColorPacket,
  SetHatPacket,
  SetNamePacket,
  SetPetPacket,
  SetScannerPacket,
  SetSkinPacket,
  SetTasksPacket,
  SyncSettingsPacket,
} from "../../packets/rpc";

export class InnerPlayerControl extends BaseInnerNetObject {
  public scannerSequenceId = 1;

  constructor(
    netId: number,
    public readonly parent: EntityPlayer,
    public isNew: boolean,
    public playerId: number,
  ) {
    super(InnerNetObjectType.PlayerControl, netId, parent);
  }

  async playAnimation(taskType: TaskType, sendTo: Connection[]): Promise<void> {
    const event = new PlayerTaskAnimationEvent(this.getPlayerInstance(), taskType);

    await this.parent.lobby.getServer().emit("player.task.animation", event);

    if (event.isCancelled()) {
      return;
    }

    this.sendRPCPacketTo(sendTo, new PlayAnimationPacket(event.getTaskType()));
  }

  async completeTask(taskIndex: number, sendTo: Connection[]): Promise<void> {
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

      this.sendRPCPacketTo([connection], new SetTasksPacket(this.playerId, tasks.map(task => task[0].id)));
      tasks.splice(taskIndex, 0, deleted[0]);
      this.sendRPCPacketTo([connection], new SetTasksPacket(this.playerId, tasks.map(task => task[0].id)));

      for (let i = 0; i < tasks.length; i++) {
        if (!tasks[1]) {
          continue;
        }

        this.sendRPCPacketTo([connection], new CompleteTaskPacket(i));
      }

      return;
    }

    playerData.tasks[taskIndex][1] = true;

    this.sendRPCPacketTo(sendTo, new CompleteTaskPacket(taskIndex));
  }

  syncSettings(options: GameOptionsData, sendTo: Connection[]): void {
    (this.parent.lobby as InternalLobby).setOptions(options);

    this.sendRPCPacketTo(sendTo, new SyncSettingsPacket(options));
  }

  async exile(): Promise<void> {
    const event = new PlayerDiedEvent(this.getPlayerInstance(), DeathReason.Unknown);

    await this.parent.lobby.getServer().emit("player.died", event);

    if (event.isCancelled()) {
      return;
    }

    this.getPlayerData().isDead = true;

    this.sendRPCPacketTo([this.getConnection()], new ExiledPacket());
  }

  async setName(name: string, sendTo: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerNameUpdatedEvent(player, player.getName(), TextComponent.from(name));

    await this.parent.lobby.getServer().emit("player.name.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewName(event.getOldName());
    }

    this.getPlayerData().name = event.getNewName().toString();

    this.sendRPCPacketTo(sendTo, new SetNamePacket(event.getNewName().toString()));
  }

  async setColor(color: PlayerColor, sendTo: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerColorUpdatedEvent(player, player.getColor(), color);

    await this.parent.lobby.getServer().emit("player.color.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewColor(event.getOldColor());
    }

    this.getPlayerData().color = event.getNewColor();

    this.sendRPCPacketTo(sendTo, new SetColorPacket(event.getNewColor()));
  }

  async setHat(hat: PlayerHat, sendTo: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerHatUpdatedEvent(player, player.getHat(), hat);

    await this.parent.lobby.getServer().emit("player.hat.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewHat(event.getOldHat());
    }

    this.getPlayerData().hat = event.getNewHat();

    this.sendRPCPacketTo(sendTo, new SetHatPacket(event.getNewHat()));
  }

  async setPet(pet: PlayerPet, sendTo: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerPetUpdatedEvent(player, player.getPet(), pet);

    await this.parent.lobby.getServer().emit("player.pet.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewPet(event.getOldPet());
    }

    this.getPlayerData().pet = event.getNewPet();

    this.sendRPCPacketTo(sendTo, new SetPetPacket(event.getNewPet()));
  }

  async setSkin(skin: PlayerSkin, sendTo: Connection[]): Promise<void> {
    const player = this.getPlayerInstance();
    const event = new PlayerSkinUpdatedEvent(player, player.getSkin(), skin);

    await this.parent.lobby.getServer().emit("player.skin.updated", event);

    if (event.isCancelled()) {
      sendTo = [this.getConnection()];

      event.setNewSkin(event.getOldSkin());
    }

    this.getPlayerData().skin = event.getNewSkin();

    this.sendRPCPacketTo(sendTo, new SetSkinPacket(event.getNewSkin()));
  }

  async murderPlayer(victimPlayerControlNetId: number, sendTo: Connection[]): Promise<void> {
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

    this.getPlayerData(victim.getId()).isDead = true;

    this.sendRPCPacketTo(sendTo, new MurderPlayerPacket(victimPlayerControlNetId));
  }

  async sendChat(message: string, sendTo: Connection[]): Promise<void> {
    const event = new PlayerChatMessageEvent(this.getPlayerInstance(), TextComponent.from(message));

    await this.parent.lobby.getServer().emit("player.chat.message", event);

    if (event.isCancelled()) {
      return;
    }

    this.sendRPCPacketTo(sendTo, new SendChatPacket(message));
  }

  setScanner(isScanning: boolean, sequenceId: number, sendTo: Connection[]): void {
    this.scannerSequenceId++;

    if (sequenceId < this.scannerSequenceId) {
      return;
    }

    this.sendRPCPacketTo(sendTo, new SetScannerPacket(isScanning, this.scannerSequenceId));
  }

  async sendChatNote(playerId: number, chatNoteType: ChatNoteType, sendTo: Connection[]): Promise<void> {
    const event = new PlayerChatNoteEvent(this.getPlayerInstance(), chatNoteType);

    await this.parent.lobby.getServer().emit("player.chat.note", event);

    if (event.isCancelled()) {
      return;
    }

    this.sendRPCPacketTo(sendTo, new SendChatNotePacket(playerId, chatNoteType));
  }

  getData(): DataPacket {
    return new DataPacket(
      this.netId,
      new MessageWriter().writeByte(this.playerId),
    );
  }

  setData(packet: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromRawBytes(packet.getBuffer());

    this.playerId = reader.readByte();
  }

  serializeSpawn(): SpawnInnerNetObject {
    return new SpawnInnerNetObject(
      this.netId,
      new MessageWriter()
        .writeBoolean(this.isNew)
        .writeByte(this.playerId),
    );
  }

  clone(): InnerPlayerControl {
    return new InnerPlayerControl(this.netId, this.parent, this.isNew, this.playerId);
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
      throw new Error(`Player ${playerInstance.getId()} does not have a connection on the lobby instance`);
    }

    return playerConnection;
  }

  private getGameData(): EntityGameData {
    const gameData = this.parent.lobby.getGameData();

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
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
