import { SpawnType, SpawnFlag } from "../../../types/enums";
import { SpawnPacket } from "../../packets/gameData";
import { LobbyInstance } from "../../../api/lobby";
import { BaseInnerNetObject } from ".";

export abstract class BaseInnerNetEntity {
  protected innerNetObjects: BaseInnerNetObject[] = [];

  constructor(
    public readonly type: SpawnType,
    public readonly lobby: LobbyInstance,
    public readonly owner: number,
    public readonly flags: SpawnFlag,
  ) {}

  abstract despawn(): void;

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      this.type,
      this.owner,
      this.flags,
      this.innerNetObjects.map(object => object.serializeSpawn()),
    );
  }
}
