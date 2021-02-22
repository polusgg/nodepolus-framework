import { SpawnType, SpawnFlag } from "../../../types/enums";
import { SpawnPacket } from "../../packets/gameData";
import { LobbyInstance } from "../../../api/lobby";
import { BaseInnerNetObject } from ".";

export abstract class BaseInnerNetEntity {
  protected innerNetObjects: BaseInnerNetObject[] = [];

  constructor(
    public readonly type: SpawnType,
    public readonly lobby: LobbyInstance,
    public readonly ownerId: number,
    public readonly flags: SpawnFlag,
  ) {}

  abstract despawn(): void;

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      this.type,
      this.ownerId,
      this.flags,
      this.innerNetObjects.map(object => object.serializeSpawn()),
    );
  }

  getObjects(): BaseInnerNetObject[] {
    return this.innerNetObjects;
  }

  getObject<T extends BaseInnerNetObject>(index: number): T {
    if (index > this.innerNetObjects.length - 1 || index < 0) {
      throw new Error(`Tried to get an InnerNetObject from an index out of bounds: 0 <= ${index} <= ${this.innerNetObjects.length - 1}`);
    }

    return this.innerNetObjects[index] as T;
  }
}
