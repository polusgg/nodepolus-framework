import { SpawnInnerNetObject, SpawnPacket } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerVoteBanSystem } from "./innerVoteBanSystem";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { InnerGameData } from "./innerGameData";
import { RoomImplementation } from "../types";
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

  constructor(room: RoomImplementation) {
    super(SpawnType.GameData, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityGameData {
    const gameData = new EntityGameData(room);

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
