import { ClimbLadderPacket, EnterVentPacket, ExitVentPacket } from "../../packets/rpc";
import { GameVentEnteredEvent, GameVentExitedEvent } from "../../../api/events/game";
import { LadderSize, LadderDirection } from "../../packets/rpc/climbLadderPacket";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { MessageWriter } from "../../../util/hazelMessage";
import { InnerNetObjectType } from "../types/enums";
import { DataPacket } from "../../packets/gameData";
import { Connection } from "../../connection";
import { BaseInnerNetObject } from "../types";
import { LevelVent } from "../../../types";
import { EntityPlayer } from ".";

export class InnerPlayerPhysics extends BaseInnerNetObject {
  private vent?: LevelVent;

  constructor(
    netId: number,
    public readonly parent: EntityPlayer,
  ) {
    super(InnerNetObjectType.PlayerPhysics, netId, parent);
  }

  getVent(): LevelVent | undefined {
    return this.vent;
  }

  async enterVent(vent: LevelVent | undefined, sendTo: Connection[]): Promise<void> {
    if (vent === undefined) {
      return;
    }

    const player = this.parent.lobby.findPlayerByNetId(this.netId);

    if (!player) {
      throw new Error(`InnerNetObject ${this.netId} does not have a PlayerInstance on the lobby instance`);
    }

    const event = new GameVentEnteredEvent(
      this.parent.lobby.getGame()!,
      player,
      vent,
    );

    await this.parent.lobby.getServer().emit("game.vent.entered", event);

    if (event.isCancelled()) {
      const connection = player.getConnection();

      if (connection) {
        // TODO: Add delay
        this.sendRpcPacket(new ExitVentPacket(vent.getId()), [connection]);
      }

      return;
    }

    this.vent = vent;

    this.sendRpcPacket(new EnterVentPacket(vent.getId()), sendTo);
  }

  async exitVent(vent: LevelVent | undefined, sendTo: Connection[]): Promise<void> {
    if (vent === undefined) {
      return;
    }

    const player = this.parent.lobby.findPlayerByNetId(this.netId);

    if (!player) {
      throw new Error(`InnerNetObject ${this.netId} does not have a PlayerInstance on the lobby instance`);
    }

    const event = new GameVentExitedEvent(
      this.parent.lobby.getGame()!,
      player,
      vent,
    );

    await this.parent.lobby.getServer().emit("game.vent.exited", event);

    if (event.isCancelled()) {
      const connection = player.getConnection();

      if (connection) {
        // TODO: Add delay
        this.sendRpcPacket(new EnterVentPacket(vent.getId()), [connection]);
      }

      return;
    }

    this.vent = undefined;

    this.sendRpcPacket(new ExitVentPacket(vent.getId()), sendTo);
  }

  climbLadder(ladderSize: LadderSize, ladderDirection: LadderDirection, sendTo: Connection[]): void {
    this.sendRpcPacket(new ClimbLadderPacket(ladderSize, ladderDirection), sendTo);
  }

  serializeData(): DataPacket {
    return new DataPacket(this.netId, new MessageWriter());
  }

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
