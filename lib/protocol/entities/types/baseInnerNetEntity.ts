import { SpawnType, SpawnFlag } from "../../../types/enums";
import { SpawnPacket } from "../../packets/gameData";
import { LobbyImplementation } from ".";

export abstract class BaseInnerNetEntity {
  constructor(
    public readonly type: SpawnType,
    public readonly lobby: LobbyImplementation,
    public readonly owner: number,
    // TODO: Make this an array whenever the fuck I feel like it
    public readonly flags: SpawnFlag,
  ) {}

  // abstract getComponents(): BaseInnerNetObject[];

  abstract serializeSpawn(): SpawnPacket;
}
