import { ClimbLadderPacket, LadderSize, LadderDirection } from "../../packets/rpc/climbLadder";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/spawn";
import { EnterVentPacket } from "../../packets/rpc/enterVent";
import { ExitVentPacket } from "../../packets/rpc/exitVent";
import { DataPacket } from "../../packets/gameData/data";
import { BaseGameObject } from "../baseEntity";
import { Connection } from "../../connection";
import { InnerNetObjectType } from "../types";
import { EntityPlayer } from ".";

export class InnerPlayerPhysics extends BaseGameObject<InnerPlayerPhysics> {
  constructor(netId: number, public parent: EntityPlayer) {
    super(InnerNetObjectType.PlayerPhysics, netId, parent);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityPlayer): InnerPlayerPhysics {
    const playerPhysics = new InnerPlayerPhysics(object.innerNetObjectID, parent);

    playerPhysics.setSpawn(object.data);

    return playerPhysics;
  }

  enterVent(ventId: number, sendTo: Connection[]): void {
    this.sendRPCPacketTo(sendTo, new EnterVentPacket(ventId));
  }

  exitVent(ventId: number, sendTo: Connection[]): void {
    this.sendRPCPacketTo(sendTo, new ExitVentPacket(ventId));
  }

  climbLadder(ladderSize: LadderSize, ladderDirection: LadderDirection, sendTo: Connection[]): void {
    this.sendRPCPacketTo(sendTo, new ClimbLadderPacket(ladderSize, ladderDirection));
  }

  getData(): DataPacket {
    return new DataPacket(this.id, new MessageWriter());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setData(_packet: MessageReader | MessageWriter): void {}

  getSpawn(): SpawnInnerNetObject {
    return new DataPacket(
      this.id,
      new MessageWriter().startMessage(1).endMessage(),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSpawn(_data: MessageReader | MessageWriter): void {}

  clone(): InnerPlayerPhysics {
    return new InnerPlayerPhysics(this.id, this.parent);
  }
}
