import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { BaseInnerNetEntity } from "../baseEntity";
import { LobbyInstance } from "../../../api/lobby";
import { InnerLobbyBehaviour } from ".";

export class EntityLobbyBehaviour extends BaseInnerNetEntity {
  public innerNetObjects: [ InnerLobbyBehaviour ];

  get lobbyBehaviour(): InnerLobbyBehaviour {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyInstance, lobbyBehaviourNetId: number) {
    super(SpawnType.LobbyBehaviour, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerLobbyBehaviour(lobbyBehaviourNetId, this),
    ];
  }

  despawn(): void {
    this.lobby.despawn(this.lobbyBehaviour);
    this.lobby.deleteLobbyBehaviour();
  }
}
