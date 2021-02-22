import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { BaseInnerNetEntity } from "../baseEntity";
import { LobbyInstance } from "../../../api/lobby";
import { InnerLobbyBehaviour } from ".";

export class EntityLobbyBehaviour extends BaseInnerNetEntity {
  constructor(
    lobby: LobbyInstance,
    lobbyBehaviourNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.LobbyBehaviour, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerLobbyBehaviour(this, lobbyBehaviourNetId),
    ];
  }

  getLobbyBehaviour(): InnerLobbyBehaviour {
    return this.getObject(0);
  }

  despawn(): void {
    this.lobby.despawn(this.getLobbyBehaviour());
    this.lobby.deleteLobbyBehaviour();
  }
}
