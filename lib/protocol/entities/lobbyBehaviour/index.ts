import { SpawnInnerNetObject, SpawnPacket } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerLobbyBehaviour } from "./innerLobbyBehaviour";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { RoomImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type LobbyBehaviourInnerNetObjects = [ InnerLobbyBehaviour ];

export class EntityLobbyBehaviour extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: LobbyBehaviourInnerNetObjects;

  get lobbyBehaviour(): InnerLobbyBehaviour {
    return this.innerNetObjects[0];
  }

  constructor(room: RoomImplementation) {
    super(SpawnType.LobbyBehaviour, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityLobbyBehaviour {
    const lobbyBehaviour = new EntityLobbyBehaviour(room);

    lobbyBehaviour.setSpawn(flags, owner, innerNetObjects);

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

  setSpawn(_flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerLobbyBehaviour.spawn(innerNetObjects[0], this),
    ];
  }
}
