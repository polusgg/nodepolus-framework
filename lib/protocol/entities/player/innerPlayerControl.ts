import { ChatNoteType, PlayerColor, PlayerHat, PlayerPet, PlayerSkin } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SetStartCounterPacket } from "../../packets/rpc/setStartCounter";
import { ReportDeadBodyPacket } from "../../packets/rpc/reportDeadBody";
import { PlayAnimationPacket } from "../../packets/rpc/playAnimation";
import { CompleteTaskPacket } from "../../packets/rpc/completeTask";
import { MurderPlayerPacket } from "../../packets/rpc/murderPlayer";
import { SendChatNotePacket } from "../../packets/rpc/sendChatNote";
import { StartMeetingPacket } from "../../packets/rpc/startMeeting";
import { SyncSettingsPacket } from "../../packets/rpc/syncSettings";
import { SpawnInnerNetObject } from "../../packets/gameData/spawn";
import { SetInfectedPacket } from "../../packets/rpc/setInfected";
import { GameOptionsData } from "../../../types/gameOptionsData";
import { SetScannerPacket } from "../../packets/rpc/setScanner";
import { SendChatPacket } from "../../packets/rpc/sendChat";
import { SetColorPacket } from "../../packets/rpc/setColor";
import { SetNamePacket } from "../../packets/rpc/setName";
import { SetSkinPacket } from "../../packets/rpc/setSkin";
import { DataPacket } from "../../packets/gameData/data";
import { ExiledPacket } from "../../packets/rpc/exiled";
import { SetHatPacket } from "../../packets/rpc/setHat";
import { SetPetPacket } from "../../packets/rpc/setPet";
import { BaseGameObject } from "../baseEntity";
import { Connection } from "../../connection";
import { InnerNetObjectType } from "../types";
import { Player } from "../../../player";
import { EntityPlayer } from ".";

export class InnerPlayerControl extends BaseGameObject<InnerPlayerControl> {
  public scannerSequenceId = 1;

  constructor(netId: number, public parent: EntityPlayer, public isNew: boolean, public playerId: number) {
    super(InnerNetObjectType.PlayerControl, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityPlayer): InnerPlayerControl {
    const playerControl = new InnerPlayerControl(object.innerNetObjectID, parent, true, 256);

    playerControl.setSpawn(object.data);

    return playerControl;
  }

  setInfected(infected: number[], sendTo: Connection[]): void {
    const gameData = this.parent.lobby.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
    }

    for (let i = 0; i < infected.length; i++) {
      const infectedPlayerId = infected[i];
      const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == infectedPlayerId);

      if (gameDataPlayerIndex == -1) {
        throw new Error(`Player ${this.playerId} does not have an instance in GameData`);
      }

      gameData.gameData.players[gameDataPlayerIndex].isImpostor = true;
    }

    this.sendRPCPacketTo(sendTo, new SetInfectedPacket(infected));
  }

  playAnimation(taskId: number, sendTo: Connection[]): void {
    this.sendRPCPacketTo(sendTo, new PlayAnimationPacket(taskId));
  }

  completeTask(taskIndex: number, sendTo: Connection[]): void {
    const gameData = this.parent.lobby.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player ${this.playerId} does not have an instance in GameData`);
    }

    const taskCount = gameData.gameData.players[gameDataPlayerIndex].tasks.length;

    if (taskCount < taskIndex) {
      throw new Error(`Player ${this.playerId} has fewer tasks (${taskCount}) than the requested index (${taskIndex})`);
    }

    gameData.gameData.players[gameDataPlayerIndex].tasks[taskIndex][1] = true;

    this.sendRPCPacketTo(sendTo, new CompleteTaskPacket(taskIndex));
  }

  syncSettings(options: GameOptionsData, sendTo: Connection[]): void {
    this.parent.lobby.options = options;

    this.sendRPCPacketTo(sendTo, new SyncSettingsPacket(options));
  }

  exiled(_sendTo: Connection[]): void {
    const gameData = this.parent.lobby.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player ${this.playerId} does not have an instance in GameData`);
    }

    gameData.gameData.players[gameDataPlayerIndex].isDead = true;

    const thisPlayer = this.parent.lobby.players.find(player => player.id == this.playerId);

    if (!thisPlayer) {
      throw new Error("Exiled packet sent to a recipient that has no connection or player instance");
    }

    this.sendRPCPacketTo([thisPlayer], new ExiledPacket());
  }

  exile(player: InnerPlayerControl, sendTo: Connection[]): void {
    player.exiled(sendTo);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  checkName(_name: string, _sendTo: Connection[]): void {}

  setName(name: string, sendTo: Connection[]): void {
    const gameData = this.parent.lobby.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player ${this.playerId} does not have an instance in GameData`);
    }

    if (gameDataPlayerIndex != -1) {
      gameData.gameData.players[gameDataPlayerIndex].name = name;
    }

    this.sendRPCPacketTo(sendTo, new SetNamePacket(name));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  checkColor(_color: PlayerColor, _sendTo: Connection[]): void {}

  setColor(color: PlayerColor, sendTo: Connection[]): void {
    const gameData = this.parent.lobby.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player ${this.playerId} does not have an instance in GameData`);
    }

    if (gameDataPlayerIndex != -1) {
      gameData.gameData.players[gameDataPlayerIndex].color = color;
    }

    this.sendRPCPacketTo(sendTo, new SetColorPacket(color));
  }

  setHat(hat: PlayerHat, sendTo: Connection[]): void {
    const gameData = this.parent.lobby.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player ${this.playerId} does not have an instance in GameData`);
    }

    if (gameDataPlayerIndex != -1) {
      gameData.gameData.players[gameDataPlayerIndex].hat = hat;
    }

    this.sendRPCPacketTo(sendTo, new SetHatPacket(hat));
  }

  setSkin(skin: PlayerSkin, sendTo: Connection[]): void {
    const gameData = this.parent.lobby.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player ${this.playerId} does not have an instance in GameData`);
    }

    if (gameDataPlayerIndex != -1) {
      gameData.gameData.players[gameDataPlayerIndex].skin = skin;
    }

    this.sendRPCPacketTo(sendTo, new SetSkinPacket(skin));
  }

  reportDeadBody(victimPlayerId: number | undefined, sendTo: Connection[]): void {
    this.sendRPCPacketTo(sendTo, new ReportDeadBodyPacket(victimPlayerId));
  }

  murderPlayer(victimPlayerControlNetId: number, sendTo: Connection[]): void {
    const victimPlayer: Player | undefined = this.parent.lobby.players.find(player => player.gameObject.playerControl.id == victimPlayerControlNetId);

    if (!victimPlayer) {
      throw new Error("Could not find victim Player");
    }

    const gameData = this.parent.lobby.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == victimPlayer.id);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player ${victimPlayer.id} does not have an instance in GameData`);
    }

    gameData.gameData.players[gameDataPlayerIndex].isDead = true;

    // console.log("Player", this.id, "Murdered", victimPlayer.id);

    this.sendRPCPacketTo(sendTo, new MurderPlayerPacket(victimPlayer.gameObject.playerControl.id));
  }

  sendChat(message: string, sendTo: Connection[]): void {
    this.sendRPCPacketTo(sendTo, new SendChatPacket(message));
  }

  startMeeting(victimPlayerId: number | undefined, sendTo: Connection[]): void {
    this.sendRPCPacketTo(sendTo, new StartMeetingPacket(victimPlayerId));
  }

  setScanner(isScanning: boolean, sequenceId: number, sendTo: Connection[]): void {
    this.scannerSequenceId++;

    if (sequenceId < this.scannerSequenceId) {
      return;
    }

    this.sendRPCPacketTo(sendTo, new SetScannerPacket(isScanning, this.scannerSequenceId));
  }

  sendChatNote(playerId: number, noteType: ChatNoteType, sendTo: Connection[]): void {
    this.sendRPCPacketTo(sendTo, new SendChatNotePacket(playerId, noteType));
  }

  setPet(pet: PlayerPet, sendTo: Connection[]): void {
    const gameData = this.parent.lobby.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the lobby instance");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player ${this.playerId} does not have an instance in GameData`);
    }

    if (gameDataPlayerIndex != -1) {
      gameData.gameData.players[gameDataPlayerIndex].pet = pet;
    }

    this.sendRPCPacketTo(sendTo, new SetPetPacket(pet));
  }

  setStartCounter(sequenceId: number, timeRemaining: number, sendTo: Connection[]): void {
    this.parent.lobby.customHostInstance.handleSetStartCounter(sequenceId, timeRemaining);

    this.sendRPCPacketTo(sendTo, new SetStartCounterPacket(sequenceId, timeRemaining));
  }

  getData(): DataPacket {
    return new DataPacket(
      this.id,
      new MessageWriter().writeByte(this.id),
    );
  }

  setData(packet: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromRawBytes(packet.buffer);

    this.id = reader.readByte();
  }

  getSpawn(): SpawnInnerNetObject {
    return new DataPacket(
      this.id,
      new MessageWriter()
        .startMessage(1)
        .writeBoolean(this.isNew)
        .writeByte(this.playerId)
        .endMessage(),
    );
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromMessage(data.buffer);

    this.isNew = reader.readBoolean();
    this.playerId = reader.readByte();
  }

  clone(): InnerPlayerControl {
    return new InnerPlayerControl(this.id, this.parent, this.isNew, this.playerId);
  }
}
