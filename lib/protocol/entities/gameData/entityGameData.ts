import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { BaseEntity, LobbyImplementation } from "../types";
import { InnerGameData, InnerVoteBanSystem } from ".";
import { SpawnPacket } from "../../packets/gameData";

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

  static spawn(owner: number, flags: SpawnFlag, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntityGameData {
    const gameData = new EntityGameData(lobby);

    gameData.setSpawn(owner, flags, innerNetObjects);

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

  setSpawn(owner: number, _flags: SpawnFlag, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerGameData.spawn(innerNetObjects[0], this),
      InnerVoteBanSystem.spawn(innerNetObjects[1], this),
    ];
  }
}
