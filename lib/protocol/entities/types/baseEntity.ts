import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { SpawnType, SpawnFlag } from "../../../types/enums";
import { SpawnPacket } from "../../packets/gameData";
import { LobbyImplementation } from ".";

export abstract class BaseEntity {
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
