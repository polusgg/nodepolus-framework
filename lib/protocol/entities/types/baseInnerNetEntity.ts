import { SpawnType, SpawnFlag } from "../../../types/enums";
import { SpawnPacket } from "../../packets/gameData";
import { LobbyInstance } from "../../../api/lobby";

export abstract class BaseInnerNetEntity {
  constructor(
    public readonly type: SpawnType,
    public readonly lobby: LobbyInstance,
    public readonly owner: number,
    public readonly flags: SpawnFlag,
  ) {}

  abstract serializeSpawn(): SpawnPacket;

  abstract despawn(): void;
}
