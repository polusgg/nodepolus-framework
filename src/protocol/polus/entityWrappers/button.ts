import { DataPacket, RpcPacket } from "../../packets/gameData";
import { GameDataPacket } from "../../packets/root";
import { CNTSnapToPacket } from "../packets/rpc/customNetworkTransform";
import { ClickBehaviourEvents } from "../events/clickBehaviour";
import { EdgeAlignments } from "../../../types/enums/edgeAlignment";
import { Vector2 } from "../../../types";
import { EntityButton } from "../entities";
import Emittery from "emittery";
import { LobbyInstance } from "../../../api/lobby";
import { Connection } from "../../connection";
import { Asset } from "../assets";
import { ButtonCountdownUpdated } from "../events/buttonCountdownUpdated";
import { PlayerInstance } from "../../../api/player";
import { Attachable } from "../../../../src/types/attachable";

export type ButtonEvents = ClickBehaviourEvents & {
  "button.countdown.started": ButtonCountdownUpdated;
  "button.countdown.stopped": ButtonCountdownUpdated;
};

export class Button extends Emittery<ButtonEvents> {
  private destroyed = false;

  constructor(
    protected readonly entity: EntityButton,
    protected readonly sendTo: Connection[],
  ) {
    super();
  }

  getEntity(): EntityButton {
    return this.entity;
  }

  getLobby(): LobbyInstance {
    return this.getEntity().getLobby();
  }

  getOwner(): Connection {
    return this.getLobby().findSafeConnection(this.getEntity().getOwnerId());
  }

  destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.getEntity().despawn();
  }

  async setPosition(x: number, y: number): Promise<void>;
  async setPosition(position: Exclude<EdgeAlignments, EdgeAlignments.None> | Vector2): Promise<void>;
  async setPosition(arg0: Exclude<EdgeAlignments, EdgeAlignments.None> | Vector2 | number, arg1?: number): Promise<void> {
    let data: DataPacket;

    if (arg0 instanceof Vector2 || arg1 !== undefined) {
      let position: Vector2;

      if (arg0 instanceof Vector2) {
        position = arg0;
      } else {
        position = new Vector2(arg0, arg1!);
      }

      data = this
        .getEntity()
        .getCustomNetworkTransform()
        .setPosition(position)
        .serializeData();
    } else {
      data = this
        .getEntity()
        .getCustomNetworkTransform()
        .setAlignment(arg0)
        .serializeData();
    }

    await this.getLobby().sendRootGamePacket(new GameDataPacket([data], this.getLobby().getCode()), this.sendTo);
  }

  async snapPosition(x: number, y: number): Promise<void>;
  async snapPosition(position: EdgeAlignments | Vector2): Promise<void>;
  async snapPosition(arg0: EdgeAlignments | Vector2 | number, arg1?: number): Promise<void> {
    if (arg0 instanceof Vector2 || arg1 !== undefined) {
      let position: Vector2;

      if (arg0 instanceof Vector2) {
        position = arg0;
      } else {
        position = new Vector2(arg0, arg1!);
      }

      return this.getOwner().writeReliable(new GameDataPacket([
        new RpcPacket(this.getEntity().getCustomNetworkTransform().getNetId(), new CNTSnapToPacket(position)),
      ], this.getLobby().getCode()));
    }

    const data = this
      .getEntity()
      .getCustomNetworkTransform()
      .setAlignment(arg0)
      .serializeData();

    await this.getLobby().sendRootGamePacket(new GameDataPacket([data], this.getLobby().getCode()), this.sendTo);
  }

  async attach(to: Attachable): Promise<void> {
    return await this.getEntity()
      .attach(to, this.sendTo);
  }

  isDestroyed(): boolean {
    return this.destroyed;
  }

  async setColor(colorInput: [number, number, number, number] | [number, number, number]): Promise<void> {
    let color: [number, number, number, number];

    if (colorInput.length === 3) {
      color = [...colorInput, 0xff];
    } else {
      color = colorInput;
    }

    const data = this
      .getEntity()
      .getClickBehaviour()
      .setColor(color)
      .serializeData();

    return this.getOwner().writeReliable(new GameDataPacket([data], this.getLobby().getCode()));
  }

  getColor(): [number, number, number, number] {
    return this.getEntity().getClickBehaviour().getColor();
  }

  async setCountingDown(countingDown: boolean = true): Promise<void> {
    const data = this
      .getEntity()
      .getClickBehaviour()
      .setIsCountingDown(countingDown)
      .serializeData();

    await this.getLobby().sendRootGamePacket(new GameDataPacket([data], this.getLobby().getCode()), this.sendTo);
  }

  isCountingDown(): boolean {
    return this.getEntity().getClickBehaviour().getIsCountingDown();
  }

  async startCountingDown(): Promise<void> {
    if (this.isCountingDown()) {
      throw new Error("Attempted to start a button countdown while it is already counting down.");
    }

    return this.setCountingDown();
  }

  async stopCountingDown(): Promise<void> {
    if (!this.isCountingDown()) {
      throw new Error("Attempted to stop a button countdown while it is already stopped.");
    }

    return this.setCountingDown(false);
  }

  async setCurrentTime(currentTime: number): Promise<void> {
    const data = this
      .getEntity()
      .getClickBehaviour()
      .setCurrentTime(currentTime)
      .serializeData();

    await this.getLobby().sendRootGamePacket(new GameDataPacket([data], this.getLobby().getCode()), this.sendTo);
  }

  getCurrentTime(): number {
    return this.getEntity().getClickBehaviour().getCurrentTime();
  }

  async setMaxTime(maxTime: number): Promise<void> {
    const data = this
      .getEntity()
      .getClickBehaviour()
      .setMaxTimer(maxTime)
      .serializeData();

    await this.getLobby().sendRootGamePacket(new GameDataPacket([data], this.getLobby().getCode()), this.sendTo);
  }

  async setAsset(asset: Asset): Promise<void> {
    const data = this
      .getEntity()
      .getGraphic()
      .setAsset(asset.getId())
      .serializeData();

    await this.getLobby().sendRootGamePacket(new GameDataPacket([data], this.getLobby().getCode()), this.sendTo);
  }

  isSaturated(): boolean {
    return this.getEntity().getClickBehaviour().isSaturated();
  }

  async setSaturated(saturated: boolean): Promise<void> {
    const data = this
      .getEntity()
      .getClickBehaviour()
      .setSaturated(saturated)
      .serializeData();

    await this.getLobby().sendRootGamePacket(new GameDataPacket([data], this.getLobby().getCode()), this.sendTo);
  }

  getMaxTime(): number {
    return this.getEntity().getClickBehaviour().getMaxTimer();
  }

  getPosition(): Exclude<EdgeAlignments | Vector2, EdgeAlignments.None> {
    const alignment = this.getEntity().getCustomNetworkTransform().getAlignment();
    const position = this.getEntity().getCustomNetworkTransform().getPosition();

    return alignment === EdgeAlignments.None ? position : alignment;
  }

  getTargetsUnfiltered(range: number): PlayerInstance[] {
    return this
      .getLobby()
      .getPlayers()
      .filter(p => p.getConnection()?.getId() !== this.getOwner().getId() && p.getPosition().distance(this.getLobby().findSafePlayerByConnection(this.getOwner()).getPosition()) <= range)
      .sort((p1, p2) => p1.getPosition().distance(this.getLobby().findSafePlayerByConnection(this.getOwner()).getPosition()) - p2.getPosition().distance(this.getLobby().findSafePlayerByConnection(this.getOwner()).getPosition()));
  }

  getTargets(range: number): PlayerInstance[] {
    return this
      .getTargetsUnfiltered(range)
      .filter(player => player.getMeta<boolean>("pgg.api.targetable"));
  }

  getTargetUnfiltered(range: number): PlayerInstance | undefined {
    return this.getTargetsUnfiltered(range)[0];
  }

  getTarget(range: number): PlayerInstance | undefined {
    return this.getTargets(range)[0];
  }

  async reset(counts: boolean = true): Promise<void> {
    const data = this
      .getEntity()
      .getClickBehaviour()
      .setIsCountingDown(counts)
      .setCurrentTime(this.getMaxTime())
      .serializeData();

    await this.getLobby().sendRootGamePacket(new GameDataPacket([data], this.getLobby().getCode()), this.sendTo);
  }
}
