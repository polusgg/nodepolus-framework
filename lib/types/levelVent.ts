import { Level, SystemType } from "./enums";
import { Vector2 } from "./vector2";

export class LevelVent {
  constructor(
    protected readonly level: Level,
    protected readonly id: number,
    protected readonly name: string,
    protected readonly system: SystemType,
    protected readonly position: Vector2,
    protected readonly connectedVents: readonly number[],
  ) {}

  getLevel(): Level {
    return this.level;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getSystem(): SystemType {
    return this.system;
  }

  getPosition(): Vector2 {
    return this.position;
  }

  getConnectedVents(): readonly number[] {
    return this.connectedVents;
  }

  isOnSameLevelAs(other?: LevelVent): boolean {
    return this.level === other?.level;
  }

  isConnectedTo(other?: LevelVent): boolean {
    return this.canMoveTo(other) || this.canMoveFrom(other);
  }

  canMoveTo(other?: LevelVent): boolean {
    if (other === undefined) {
      return false;
    }

    if (!this.isOnSameLevelAs(other)) {
      return false;
    }

    return this.connectedVents.includes(other.id);
  }

  canMoveFrom(other?: LevelVent): boolean {
    return other?.canMoveTo(this) ?? false;
  }
}
