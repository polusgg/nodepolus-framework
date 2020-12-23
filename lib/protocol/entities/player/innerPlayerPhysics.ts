import { ClimbLadderPacket, EnterVentPacket, ExitVentPacket } from "../../packets/rpc";
import { LadderSize, LadderDirection } from "../../packets/rpc/climbLadderPacket";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { DataPacket } from "../../packets/gameData";
import { Connection } from "../../connection";
import { BaseInnerNetObject } from "../types";
import { EntityPlayer } from ".";

export class InnerPlayerPhysics extends BaseInnerNetObject {
  constructor(
    netId: number,
    public parent: EntityPlayer,
  ) {
    super(InnerNetObjectType.PlayerPhysics, netId, parent);
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
    return new DataPacket(this.netId, new MessageWriter());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setData(_packet: MessageReader | MessageWriter): void {}

  serializeSpawn(): SpawnInnerNetObject {
    return new SpawnInnerNetObject(
      this.netId,
      new MessageWriter(),
    );
  }

  clone(): InnerPlayerPhysics {
    return new InnerPlayerPhysics(this.netId, this.parent);
  }
}
