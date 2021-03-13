import { BaseRpcPacket, ClimbLadderPacket, EnterVentPacket, ExitVentPacket } from "../../packets/rpc";
import { GameVentEnteredEvent, GameVentExitedEvent } from "../../../api/events/game";
import { LadderSize, LadderDirection } from "../../packets/rpc/climbLadderPacket";
import { InnerNetObjectType, RpcPacketType } from "../../../types/enums";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MessageWriter } from "../../../util/hazelMessage";
import { BaseInnerNetObject } from "../baseEntity";
import { Connection } from "../../connection";
import { LevelVent } from "../../../types";
import { Vents } from "../../../static";
import { EntityPlayer } from ".";

export class InnerPlayerPhysics extends BaseInnerNetObject {
  protected vent?: LevelVent;

  constructor(
    protected readonly parent: EntityPlayer,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.PlayerPhysics, parent, netId);
  }

  getVent(): LevelVent | undefined {
    return this.vent;
  }

  async enterVent(vent: LevelVent | undefined, sendTo?: Connection[]): Promise<void> {
    if (vent === undefined) {
      return;
    }

    const player = this.parent.getLobby().findSafePlayerByNetId(this.netId);
    const event = new GameVentEnteredEvent(
      this.parent.getLobby().getSafeGame(),
      player,
      vent,
    );

    await this.parent.getLobby().getServer().emit("game.vent.entered", event);

    if (event.isCancelled()) {
      const connection = player.getConnection();

      if (connection !== undefined) {
        // TODO: Add delay
        this.sendRpcPacket(new ExitVentPacket(vent.getId()), [connection]);
      }

      return;
    }

    this.vent = vent;

    this.sendRpcPacket(new EnterVentPacket(vent.getId()), sendTo);
  }

  async exitVent(vent: LevelVent | undefined, sendTo?: Connection[]): Promise<void> {
    if (vent === undefined) {
      return;
    }

    const player = this.parent.getLobby().findSafePlayerByNetId(this.netId);
    const event = new GameVentExitedEvent(
      this.parent.getLobby().getSafeGame(),
      player,
      vent,
    );

    await this.parent.getLobby().getServer().emit("game.vent.exited", event);

    if (event.isCancelled()) {
      const connection = player.getConnection();

      if (connection !== undefined) {
        // TODO: Add delay
        this.sendRpcPacket(new EnterVentPacket(vent.getId()), [connection]);
      }

      return;
    }

    this.vent = undefined;

    this.sendRpcPacket(new ExitVentPacket(vent.getId()), sendTo);
  }

  climbLadder(ladderSize: LadderSize, ladderDirection: LadderDirection, sendTo?: Connection[]): void {
    this.sendRpcPacket(new ClimbLadderPacket(ladderSize, ladderDirection), sendTo);
  }

  handleRpc(connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, sendTo: Connection[]): void {
    switch (type) {
      case RpcPacketType.EnterVent:
        this.enterVent(Vents.forLevelFromId(this.parent.getLobby().getLevel(), (packet as EnterVentPacket).ventId), sendTo);
        break;
      case RpcPacketType.ExitVent:
        this.exitVent(Vents.forLevelFromId(this.parent.getLobby().getLevel(), (packet as ExitVentPacket).ventId), sendTo);
        break;
      case RpcPacketType.ClimbLadder: {
        const data = packet as ClimbLadderPacket;

        this.climbLadder(data.ladderSize, data.ladderDirection, sendTo);
        break;
      }
      default:
        break;
    }
  }

  getParent(): EntityPlayer {
    return this.parent;
  }

  serializeData(): DataPacket {
    return new DataPacket(this.netId, new MessageWriter());
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(
      this.netId,
      new MessageWriter(),
    );
  }

  clone(): InnerPlayerPhysics {
    const clone = new InnerPlayerPhysics(this.parent, this.netId);

    clone.vent = this.vent;

    return clone;
  }
}
