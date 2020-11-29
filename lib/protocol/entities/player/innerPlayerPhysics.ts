import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageWriter, MessageReader } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";
import { EntityPlayer } from ".";
import { EnterVentPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/enterVent";
import { ExitVentPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/exitVent";

export class InnerPlayerPhysics extends BaseGameObject<InnerPlayerPhysics> {
  constructor(netId: number, parent: EntityPlayer) {
    super(InnerNetObjectType.PlayerPhysics, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityPlayer) {
    let playerControl = new InnerPlayerPhysics(object.innerNetObjectID, parent);

    playerControl.setSpawn(object.data);

    return playerControl;
  }

  getData(old: InnerPlayerPhysics): DataPacket {
    return new DataPacket(this.id, new MessageWriter());
  }

  setData(packet: MessageReader | MessageWriter): void {}

  getSpawn(): SpawnInnerNetObject {
    return new DataPacket(this.id, new MessageWriter());
  }

  setSpawn(data: MessageReader | MessageWriter): void {}

  enterVent(ventId: number) {
    this.sendRPCPacket(new EnterVentPacket(ventId))
  }

  exitVent(ventId: number) {
    this.sendRPCPacket(new ExitVentPacket(ventId))
  }
}
