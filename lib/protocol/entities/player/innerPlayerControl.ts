import { SetStartCounterPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setStartCounter";
import { ReportDeadBodyPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/reportDeadBody";
import { PlayAnimationPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/playAnimation";
import { CompleteTaskPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/completeTask";
import { MurderPlayerPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/murderPlayer";
import { SendChatNotePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/sendChatNote";
import { StartMeetingPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/startMeeting";
import { SyncSettingsPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/syncSettings";
import { SetInfectedPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setInfected";
import { CheckColorPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/checkColor";
import { SetScannerPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setScanner";
import { CheckNamePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/checkName";
import { SendChatPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/sendChat";
import { SetColorPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setColor";
import { SetNamePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setName";
import { SetSkinPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setSkin";
import { ExiledPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/exiled";
import { SetHatPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setHat";
import { SetPetPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setPet";
import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData } from "../../../types/gameOptionsData";
import { ChatNoteType } from "../../../types/chatNoteType";
import { PlayerColor } from "../../../types/playerColor";
import { PlayerSkin } from "../../../types/playerSkin";
import { PlayerHat } from "../../../types/playerHat";
import { PlayerPet } from "../../../types/playerPet";
import { BaseGameObject } from "../baseEntity";
import { Connection } from "../../connection";
import { InnerNetObjectType } from "../types";
import { EntityPlayer } from ".";

export class InnerPlayerControl extends BaseGameObject<InnerPlayerControl> {
  public scannerSequenceId = 1;

  constructor(netId: number, parent: EntityPlayer, public isNew: boolean, public playerId: number) {
    super(InnerNetObjectType.PlayerControl, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityPlayer): InnerPlayerControl {
    const playerControl = new InnerPlayerControl(object.innerNetObjectID, parent, true, 0);

    playerControl.setSpawn(object.data);

    return playerControl;
  }

  setInfected(infected: number[]): void {
    const gameData = this.parent.room.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the RoomImplementation");
    }

    for (let i = 0; i < infected.length; i++) {
      const infectedPlayerId = infected[i];
      const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == infectedPlayerId);

      if (gameDataPlayerIndex == -1) {
        throw new Error(`Player #${this.playerId} does not have an instance in GameData`);
      }

      gameData.gameData.players[gameDataPlayerIndex].isImpostor = true;
    }

    this.sendRPCPacket(new SetInfectedPacket(infected));
  }

  playAnimation(taskId: number): void {
    this.sendRPCPacket(new PlayAnimationPacket(taskId));
  }

  completeTask(taskIdx: number): void {
    const gameData = this.parent.room.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the RoomImplementation");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player #${this.playerId} does not have an instance in GameData`);
    }

    const taskCount = gameData.gameData.players[gameDataPlayerIndex].tasks.length;

    if (taskCount < taskIdx) {
      throw new Error(`Player #${this.playerId} has fewer tasks (${taskCount}) than the requested index ${taskIdx}`);
    }

    gameData.gameData.players[gameDataPlayerIndex].tasks[taskIdx][1] = true;

    this.sendRPCPacket(new CompleteTaskPacket(taskIdx));
  }

  syncSettings(options: GameOptionsData): void {
    this.parent.room.options = options;

    this.sendRPCPacket(new SyncSettingsPacket(options));
  }

  exiled(): void {
    const gameData = this.parent.room.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the RoomImplementation");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player #${this.playerId} does not have an instance in GameData`);
    }

    gameData.gameData.players[gameDataPlayerIndex].isDead = true;

    const thisPlayer = this.parent.room.players.find(player => player.id == this.playerId);

    if (!thisPlayer) {
      throw new Error("Exiled packet sent to a recipient that has no connection or player instance");
    }

    this.sendRPCPacketTo([ thisPlayer ], new ExiledPacket());
  }

  exile(player: InnerPlayerControl): void {
    player.exiled();
  }

  checkName(name: string): void {
    if (this.parent.room.isHost) {
      return;
    }

    if (!this.parent.room.host) {
      throw new Error("CheckName sent to room without a host");
    }

    this.sendRPCPacketTo([ this.parent.room.host as Connection ], new CheckNamePacket(name));
  }

  setName(name: string): void {
    const gameData = this.parent.room.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the RoomImplementation");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      console.log(gameData.gameData.players);
      throw new Error(`Player #${this.playerId} does not have an instance in GameData`);
    }

    gameData.gameData.players[gameDataPlayerIndex].name = name;

    this.sendRPCPacket(new SetNamePacket(name));
  }

  checkColor(color: PlayerColor): void {
    if (this.parent.room.isHost) {
      return;
    }

    if (!this.parent.room.host) {
      throw new Error("CheckColor sent to room without a host");
    }

    this.sendRPCPacketTo([ this.parent.room.host ], new CheckColorPacket(color));
  }

  setColor(color: PlayerColor): void {
    const gameData = this.parent.room.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the RoomImplementation");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player #${this.playerId} does not have an instance in GameData`);
    }

    gameData.gameData.players[gameDataPlayerIndex].color = color;

    this.sendRPCPacket(new SetColorPacket(color));
  }

  setHat(hat: PlayerHat): void {
    const gameData = this.parent.room.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the RoomImplementation");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player #${this.playerId} does not have an instance in GameData`);
    }

    gameData.gameData.players[gameDataPlayerIndex].hat = hat;

    this.sendRPCPacket(new SetHatPacket(hat));
  }

  setSkin(skin: PlayerSkin): void {
    const gameData = this.parent.room.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the RoomImplementation");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player #${this.playerId} does not have an instance in GameData`);
    }

    gameData.gameData.players[gameDataPlayerIndex].skin = skin;

    this.sendRPCPacket(new SetSkinPacket(skin));
  }

  reportDeadBody(victimPlayerId?: number): void {
    this.sendRPCPacket(new ReportDeadBodyPacket(victimPlayerId));
  }

  murderPlayer(victimPlayerControlNetId: number): void {
    const victimPlayerId: number | undefined = this.parent.room.players.find(player => player.gameObject.playerControl.id == victimPlayerControlNetId)?.id;

    if (!victimPlayerId) {
      throw new Error("AAAAAAAAAAAAAAAAAAAAAAAAAAA");
    }

    const gameData = this.parent.room.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the RoomImplementation");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == victimPlayerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`player ${victimPlayerId} does not have an instance in GameData`);
    }

    gameData.gameData.players[gameDataPlayerIndex].isDead = true;

    this.sendRPCPacket(new MurderPlayerPacket(victimPlayerControlNetId));
  }

  sendChat(message: string): void {
    this.sendRPCPacket(new SendChatPacket(message));
  }

  startMeeting(victimPlayerId?: number): void {
    this.sendRPCPacket(new StartMeetingPacket(victimPlayerId));
  }

  setScanner(isScanning: boolean): void {
    this.sendRPCPacket(new SetScannerPacket(isScanning, this.scannerSequenceId++));
  }

  sendChatNote(playerId: number, type: ChatNoteType): void {
    this.sendRPCPacket(new SendChatNotePacket(playerId, type));
  }

  setPet(pet: PlayerPet): void {
    const gameData = this.parent.room.gameData;

    if (!gameData) {
      throw new Error("GameData does not exist on the RoomImplementation");
    }

    const gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.playerId);

    if (gameDataPlayerIndex == -1) {
      throw new Error(`Player #${this.playerId} does not have an instance in GameData`);
    }

    gameData.gameData.players[gameDataPlayerIndex].pet = pet;

    this.sendRPCPacket(new SetPetPacket(pet));
  }

  setStartCounter(sequenceId: number, timeRemaining: number): void {
    this.sendRPCPacket(new SetStartCounterPacket(sequenceId, timeRemaining));
  }

  getData(): DataPacket {
    const writer = new MessageWriter().writeByte(this.id);

    return new DataPacket(this.id, writer);
  }

  setData(packet: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromRawBytes(packet.buffer);

    this.id = reader.readByte();
  }

  getSpawn(): SpawnInnerNetObject {
    const writer = new MessageWriter().writeBoolean(this.isNew)
      .writeByte(this.playerId);

    return new DataPacket(this.id, writer);
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromRawBytes(data.buffer);

    this.isNew = reader.readBoolean();
    this.playerId = reader.readByte();
  }
}
