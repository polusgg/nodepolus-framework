import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { InnerGameData, InnerVoteBanSystem } from ".";
import { BaseInnerNetEntity } from "../baseEntity";
import { LobbyInstance } from "../../../api/lobby";
import { PlayerData } from "./types";

export class EntityGameData extends BaseInnerNetEntity {
  constructor(
    lobby: LobbyInstance,
    players: PlayerData[] = [],
    votes: Map<number, number[]> = new Map(),
    gameDataNetId: number = lobby.getHostInstance().getNextNetId(),
    voteBanSystemNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.GameData, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerGameData(this, players, gameDataNetId),
      new InnerVoteBanSystem(this, votes, voteBanSystemNetId),
    ];
  }

  getGameData(): InnerGameData {
    return this.getObject(0);
  }

  getVoteBanSystem(): InnerVoteBanSystem {
    return this.getObject(1);
  }

  despawn(): void {
    this.lobby.despawn(this.getGameData());
    this.lobby.deleteGameData();
  }
}
