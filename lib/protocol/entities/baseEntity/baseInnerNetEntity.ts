import { SpawnType, SpawnFlag } from "../../../types/enums";
import { SpawnPacket } from "../../packets/gameData";
import { LobbyInstance } from "../../../api/lobby";
import { BaseInnerNetObject } from ".";

export abstract class BaseInnerNetEntity {
  protected innerNetObjects: BaseInnerNetObject[] = [];

  constructor(
    protected readonly type: SpawnType,
    protected readonly lobby: LobbyInstance,
    protected readonly ownerId: number,
    protected readonly flags: SpawnFlag,
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

  getType(): SpawnType {
    return this.type;
  }

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  getOwnerId(): number {
    return this.ownerId;
  }

  getFlags(): SpawnFlag {
    return this.flags;
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
