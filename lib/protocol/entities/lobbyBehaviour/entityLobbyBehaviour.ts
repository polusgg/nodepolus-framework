import { BaseInnerNetEntity, LobbyImplementation } from "../types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { InnerLobbyBehaviour } from ".";

export class EntityLobbyBehaviour extends BaseInnerNetEntity {
  public innerNetObjects: [ InnerLobbyBehaviour ];

  get lobbyBehaviour(): InnerLobbyBehaviour {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation, lobbyBehaviourNetId: number) {
    super(SpawnType.LobbyBehaviour, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerLobbyBehaviour(lobbyBehaviourNetId, this),
    ];
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.LobbyBehaviour,
      GLOBAL_OWNER,
      SpawnFlag.None,
      [
        this.lobbyBehaviour.serializeSpawn(),
      ],
    );
  }
}
