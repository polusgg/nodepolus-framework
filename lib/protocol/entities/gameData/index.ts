import { SpawnInnerNetObject, SpawnPacket } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerVoteBanSystem } from "./innerVoteBanSystem";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { InnerGameData } from "./innerGameData";
import { BaseEntity } from "../baseEntity";
import { RoomImplementation } from "../types";

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

  private constructor(room: RoomImplementation) {
    super(SpawnType.GameData, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityGameData {
    let gameData = new EntityGameData(room);

    gameData.setSpawn(flags, owner, innerNetObjects);

    return gameData;
  }

  getSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.PlayerControl,
      this.owner,
      this.flags,
      [
        this.gameData.spawn(),
        this.voteBanSystem.spawn(),
      ],
    );
  }

  setSpawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]) {
    this.owner = owner;
    this.innerNetObjects = [
      InnerGameData.spawn(innerNetObjects[0], this),
      InnerVoteBanSystem.spawn(innerNetObjects[1], this),
    ];
  }
}
