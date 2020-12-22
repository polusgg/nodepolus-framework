import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { BaseInnerNetObject, LobbyImplementation } from ".";
import { SpawnType, SpawnFlag } from "../../../types/enums";
import { SpawnPacket } from "../../packets/gameData";

export abstract class BaseInnerNetEntity {
  public owner!: number;
  public flags!: SpawnFlag;
  public innerNetObjects!: BaseInnerNetObject[];

  constructor(
    public readonly type: SpawnType,
    public readonly lobby: LobbyImplementation,
  ) {}

  abstract setSpawn(owner: number, flags: SpawnFlag, innerNetObjects: SpawnInnerNetObject[]): void;

  abstract getSpawn(): SpawnPacket;

  spawn(): SpawnPacket {
    return this.getSpawn();
  }
}
