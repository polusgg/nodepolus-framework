import { EnterVentPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/enterVent";
import { ExitVentPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/exitVent";
import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseGameObject } from "../baseEntity";
import { InnerNetObjectType } from "../types";
import { EntityPlayer } from ".";

export class InnerPlayerPhysics extends BaseGameObject<InnerPlayerPhysics> {
  constructor(netId: number, parent: EntityPlayer) {
    super(InnerNetObjectType.PlayerPhysics, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityPlayer): InnerPlayerPhysics {
    const playerPhysics = new InnerPlayerPhysics(object.innerNetObjectID, parent);

    playerPhysics.setSpawn(object.data);

    return playerPhysics;
  }

  enterVent(ventId: number): void {
    this.sendRPCPacket(new EnterVentPacket(ventId));
  }

  exitVent(ventId: number): void {
    this.sendRPCPacket(new ExitVentPacket(ventId));
  }

  getData(): DataPacket {
    return new DataPacket(this.id, new MessageWriter());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setData(_packet: MessageReader | MessageWriter): void {}

  getSpawn(): SpawnInnerNetObject {
    return new DataPacket(this.id, new MessageWriter());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setSpawn(_data: MessageReader | MessageWriter): void {}
}
