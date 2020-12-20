import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { BaseEntity, LobbyImplementation } from "../types";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { InnerLobbyBehaviour } from ".";

export type LobbyBehaviourInnerNetObjects = [ InnerLobbyBehaviour ];

export class EntityLobbyBehaviour extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: LobbyBehaviourInnerNetObjects;

  get lobbyBehaviour(): InnerLobbyBehaviour {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation) {
    super(SpawnType.LobbyBehaviour, lobby);
  }

  static spawn(owner: number, flags: SpawnFlag, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntityLobbyBehaviour {
    const lobbyBehaviour = new EntityLobbyBehaviour(lobby);

    lobbyBehaviour.setSpawn(owner, flags, innerNetObjects);

    return lobbyBehaviour;
  }

  getSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.LobbyBehaviour,
      GLOBAL_OWNER,
      SpawnFlag.None,
      [
        this.lobbyBehaviour.spawn(),
      ],
    );
  }

  setSpawn(owner: number, _flags: SpawnFlag, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerLobbyBehaviour.spawn(innerNetObjects[0], this),
    ];
  }
}
