import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageWriter, MessageReader } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";
import { EntityPlayer } from ".";
import { CompleteTaskPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/completeTask";
import { GameOptionsData } from "../../../types/gameOptionsData";
import { SyncSettingsPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/syncSettings";
import { SetInfectedPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setInfected";
import { PlayAnimationPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/playAnimation";
import { ExiledPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/exiled";
import { Connection } from "../../connection";
import { CheckNamePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/checkName";
import { SetNamePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setName";
import { CheckColorPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/checkColor";
import { PlayerColor } from "../../../types/playerColor";
import { SetHatPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setHat";
import { PlayerHat } from "../../../types/playerHat";
import { SetColorPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setColor";
import { SetSkinPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setSkin";
import { PlayerSkin } from "../../../types/playerSkin";
import { ReportDeadBodyPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/reportDeadBody";
import { MurderPlayerPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/murderPlayer";
import { SendChatPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/sendChat";
import { StartMeetingPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/startMeeting";
import { SetScannerPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setScanner";
import { ChatNoteType } from "../../../types/chatNoteType";
import { SendChatNotePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/sendChatNote";
import { PlayerPet } from "../../../types/playerPet";
import { SetPetPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setPet";
import { SetStartCounterPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/setStartCounter";

export class InnerPlayerControl extends BaseGameObject<InnerPlayerControl> {
  scannerSequenceId: number = 1;

  constructor(netId: number, parent: EntityPlayer, public isNew: boolean, public playerId: number) {
    super(InnerNetObjectType.PlayerControl, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityPlayer) {
    let playerControl = new InnerPlayerControl(object.innerNetObjectID, parent, true, 0);

    playerControl.setSpawn(object.data);

    return playerControl;
  }

  getData(old: InnerPlayerControl): DataPacket {
    let writer = new MessageWriter().writeByte(this.playerId);

    return new DataPacket(this.id, writer);
  }

  setData(packet: MessageReader | MessageWriter): void {
    let reader = MessageReader.fromRawBytes(packet.buffer);

    this.playerId = reader.readByte();
  }

  getSpawn(): SpawnInnerNetObject {
    let writer = new MessageWriter().writeBoolean(this.isNew).writeByte(this.playerId);

    return new DataPacket(this.id, writer);
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    let reader = MessageReader.fromRawBytes(data.buffer);

    this.isNew = reader.readBoolean();
    this.playerId = reader.readByte();
  }

  setInfected(infected: number[]) {
    let gameData = this.parent.room.gameData

    if (!gameData)
      throw new Error("gameData does not exist on the RoomImplementation")

    for (let i = 0; i < infected.length; i++) {
      const infectedPlayerId = infected[i];
      let gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == infectedPlayerId)
  
      if (gameDataPlayerIndex == -1)
        throw new Error("player " + this.id + " does not have an instance in gameData")
      
      gameData.gameData.players[gameDataPlayerIndex].isImpostor = true;
    }

    this.sendRPCPacket(new SetInfectedPacket(infected))
  }

  playAnimation(taskId: number) {
    this.sendRPCPacket(new PlayAnimationPacket(taskId))
  }

  completeTask(taskIdx: number) {
    let gameData = this.parent.room.gameData

    if (!gameData)
      throw new Error("gameData does not exist on the RoomImplementation")
    
    let gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.id)

    if (gameDataPlayerIndex == -1)
      throw new Error("player " + this.id + " does not have an instance in gameData")
    if (gameData.gameData.players[gameDataPlayerIndex].tasks.length < taskIdx)
      throw new Error("player " + this.id + "'s task length is less than the requested index " + taskIdx)

    gameData.gameData.players[gameDataPlayerIndex].tasks[taskIdx][1] = true

    this.sendRPCPacket(new CompleteTaskPacket(taskIdx))
  }

  syncSettings(options: GameOptionsData) {
    this.parent.room.options = options;

    this.sendRPCPacket(new SyncSettingsPacket(options))
  }

  exiled() {
    let gameData = this.parent.room.gameData

    if (!gameData)
      throw new Error("gameData does not exist on the RoomImplementation")

    let gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.id)

    if (gameDataPlayerIndex == -1)
      throw new Error("player " + this.id + " does not have an instance in gameData")

    gameData.gameData.players[gameDataPlayerIndex].isDead = true;

    let thisConnection = this.parent.room.connections.find(c => c.player?.id == this.id)

    if(!thisConnection) throw new Error("Exiled packet sent but the recipient has no connection / player")

    this.sendRPCPacketTo([thisConnection], new ExiledPacket())
  }

  exile(player: InnerPlayerControl) {
    player.exiled()
  }

  checkName(name: string) {
    if(this.parent.room.isHost) return

    this.sendRPCPacketTo([<Connection>this.parent.room.host], new CheckNamePacket(name))
  }

  setName(name: string) {
    let gameData = this.parent.room.gameData

    if (!gameData)
      throw new Error("gameData does not exist on the RoomImplementation")

    let gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.id)

    if (gameDataPlayerIndex == -1)
      throw new Error("player " + this.id + " does not have an instance in gameData")

    gameData.gameData.players[gameDataPlayerIndex].name = name;

    this.sendRPCPacket(new SetNamePacket(name))
  }

  checkColor(color: PlayerColor) {
    if (this.parent.room.isHost) return

    this.sendRPCPacketTo([<Connection>this.parent.room.host], new CheckColorPacket(color))
  }

  setColor(color: PlayerColor) {
    let gameData = this.parent.room.gameData

    if (!gameData)
      throw new Error("gameData does not exist on the RoomImplementation")

    let gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.id)

    if (gameDataPlayerIndex == -1)
      throw new Error("player " + this.id + " does not have an instance in gameData")

    gameData.gameData.players[gameDataPlayerIndex].color = color;

    this.sendRPCPacket(new SetColorPacket(color))
  }

  setHat(hat: PlayerHat) {
    let gameData = this.parent.room.gameData

    if (!gameData)
      throw new Error("gameData does not exist on the RoomImplementation")

    let gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.id)

    if (gameDataPlayerIndex == -1)
      throw new Error("player " + this.id + " does not have an instance in gameData")

    gameData.gameData.players[gameDataPlayerIndex].hat = hat;

    this.sendRPCPacket(new SetHatPacket(hat))
  }

  setSkin(skin: PlayerSkin) {
    let gameData = this.parent.room.gameData

    if (!gameData)
      throw new Error("gameData does not exist on the RoomImplementation")

    let gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.id)

    if (gameDataPlayerIndex == -1)
      throw new Error("player " + this.id + " does not have an instance in gameData")

    gameData.gameData.players[gameDataPlayerIndex].skin = skin;

    this.sendRPCPacket(new SetSkinPacket(skin))
  }

  reportDeadBody(victimPlayerId?: number) {
    this.sendRPCPacket(new ReportDeadBodyPacket(victimPlayerId))
  }

  murderPlayer(victimPlayerControlNetId: number) {
    let victimPlayerId: number | undefined = this.parent.room.connections.find(c => c.player?.gameObject.playerControl.id == victimPlayerControlNetId)?.player?.id
    
    if(!victimPlayerId)
      throw new Error("AAAAAAAAAAAAAAAAAAAAAAAAAAA")

    let gameData = this.parent.room.gameData

    if (!gameData)
      throw new Error("gameData does not exist on the RoomImplementation")

    let gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == victimPlayerId)

    if (gameDataPlayerIndex == -1)
      throw new Error("player " + victimPlayerId + " does not have an instance in gameData")

    gameData.gameData.players[gameDataPlayerIndex].isDead = true;

    this.sendRPCPacket(new MurderPlayerPacket(victimPlayerControlNetId))
  }

  sendChat(message: string) {
    this.sendRPCPacket(new SendChatPacket(message));
  }

  startMeeting(victimPlayerId?: number) {
    this.sendRPCPacket(new StartMeetingPacket(victimPlayerId));
  }

  setScanner(isScanning: boolean) {
    this.sendRPCPacket(new SetScannerPacket(isScanning, this.scannerSequenceId++))
  }

  sendChatNote(playerId: number, type: ChatNoteType) {
    this.sendRPCPacket(new SendChatNotePacket(playerId, type))
  }

  setPet(pet: PlayerPet) {
    let gameData = this.parent.room.gameData

    if (!gameData)
      throw new Error("gameData does not exist on the RoomImplementation")

    let gameDataPlayerIndex: number = gameData.gameData.players.findIndex(p => p.id == this.id)

    if (gameDataPlayerIndex == -1)
      throw new Error("player " + this.id + " does not have an instance in gameData")

    gameData.gameData.players[gameDataPlayerIndex].pet = pet;

    this.sendRPCPacket(new SetPetPacket(pet))
  }

  setStartCounter(sequenceId: number, timeRemaining: number) {
    this.sendRPCPacket(new SetStartCounterPacket(sequenceId, timeRemaining))
  }
}
