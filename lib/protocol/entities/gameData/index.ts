import { SpawnInnerNetObject, SpawnPacket } from "../../packets/gameData/spawn";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { InnerVoteBanSystem } from "./innerVoteBanSystem";
import { InnerGameData } from "./innerGameData";
import { LobbyImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type GameDataInnerNetObjects = [ InnerGameData, InnerVoteBanSystem ];

export class EntityGameData extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: GameDataInnerNetObjects;

  get gameData(): InnerGameData {
    return this.innerNetObjects[0];
  }

  get voteBanSystem(): InnerVoteBanSystem {
    return this.innerNetObjects[1];
  }

  constructor(lobby: LobbyImplementation) {
    super(SpawnType.GameData, lobby);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntityGameData {
    const gameData = new EntityGameData(lobby);

    gameData.setSpawn(flags, owner, innerNetObjects);

    return gameData;
  }

  getSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.GameData,
      this.owner,
      this.flags,
      [
        this.gameData.spawn(),
        this.voteBanSystem.spawn(),
      ],
    );
  }

  setSpawn(_flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerGameData.spawn(innerNetObjects[0], this),
      InnerVoteBanSystem.spawn(innerNetObjects[1], this),
    ];
  }
}
