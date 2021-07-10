import { LobbyInstance } from "../../../api/lobby";
import { Connection } from "../../connection";
import { GameDataPacket } from "../../packets/root";
import { Vector2 } from "../../../types";
import Emittery from "emittery";
import { EntityDeadBody } from "../entities";
import { ClickBehaviourEvents } from "../events/clickBehaviour";
import { BodyDirection, EdgeAlignments } from "../../../types/enums";

export type DeadBodyEvents = ClickBehaviourEvents;

export class DeadBody extends Emittery<DeadBodyEvents> {
  constructor(
    private readonly entity: EntityDeadBody,
  ) {
    super();
  }

  getOwner(): Connection | undefined {
    return this.getLobby().findConnection(this.getEntity().getOwnerId());
  }

  getEntity(): EntityDeadBody {
    return this.entity;
  }

  getLobby(): LobbyInstance {
    return this.getEntity().getLobby();
  }

  getColor(): [number, number, number, number] {
    return this.getEntity().getDeadBody().color;
  }

  async setColor(color: [number, number, number, number] | number[]): Promise<void> {
    this.getEntity().getDeadBody().color = color as [number, number, number, number];

    return this.getOwner()?.writeReliable(new GameDataPacket([
      this.getEntity().getDeadBody().serializeData(),
    ], this.getLobby().getCode())) ?? new Promise(r => r());
  }

  getShadowColor(): [number, number, number, number] {
    return this.getEntity().getDeadBody().shadowColor;
  }

  async setShadowColor(color: [number, number, number, number] | number[]): Promise<void> {
    this.getEntity().getDeadBody().shadowColor = color as [number, number, number, number];

    return this.getOwner()?.writeReliable(new GameDataPacket([
      this.getEntity().getDeadBody().serializeData(),
    ], this.getLobby().getCode())) ?? new Promise(r => r());
  }

  getPosition(): Vector2 {
    return this.getEntity().getCustomNetworkTransform().getPosition();
  }

  async setPosition(position: Vector2): Promise<void> {
    this.getEntity().getCustomNetworkTransform().setPosition(position);

    return this.getOwner()?.writeReliable(new GameDataPacket([
      this.getEntity().getCustomNetworkTransform().serializeData(),
    ], this.getLobby().getCode())) ?? new Promise(r => r());
  }

  hasFallen(): boolean {
    return this.getEntity().getDeadBody().hasFallen;
  }

  async setFallen(fallen: boolean): Promise<void> {
    this.getEntity().getDeadBody().hasFallen = fallen;

    return this.getOwner()?.writeReliable(new GameDataPacket([
      this.getEntity().getDeadBody().serializeData(),
    ], this.getLobby().getCode())) ?? new Promise(r => r());
  }

  getFacing(): BodyDirection {
    return this.getEntity().getDeadBody().bodyFacing;
  }

  async setFacing(facing: BodyDirection): Promise<void> {
    this.getEntity().getDeadBody().bodyFacing = facing;

    return this.getOwner()?.writeReliable(new GameDataPacket([
      this.getEntity().getDeadBody().serializeData(),
    ], this.getLobby().getCode())) ?? new Promise(r => r());
  }

  getAlignment(): EdgeAlignments {
    return this.getEntity().getCustomNetworkTransform().getAlignment();
  }

  getZ(): number {
    return this.getEntity().getCustomNetworkTransform().getZ();
  }
}
