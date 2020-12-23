import { BaseInnerNetEntity, LobbyImplementation } from "../types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { InnerGameData, InnerVoteBanSystem } from ".";
import { SpawnPacket } from "../../packets/gameData";
import { PlayerData } from "./types";

export class EntityGameData extends BaseInnerNetEntity {
  public innerNetObjects: [ InnerGameData, InnerVoteBanSystem ];

  get gameData(): InnerGameData {
    return this.innerNetObjects[0];
  }

  get voteBanSystem(): InnerVoteBanSystem {
    return this.innerNetObjects[1];
  }

  constructor(lobby: LobbyImplementation, gameDataNetId: number, players: PlayerData[], voteBanSystemNetId: number) {
    super(SpawnType.GameData, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerGameData(gameDataNetId, this, players),
      new InnerVoteBanSystem(voteBanSystemNetId, this),
    ];
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.GameData,
      this.owner,
      this.flags,
      [
        this.gameData.serializeSpawn(),
        this.voteBanSystem.serializeSpawn(),
      ],
    );
  }
}
