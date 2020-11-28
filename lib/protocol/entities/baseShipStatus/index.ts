import { SpawnType } from "../../../types/spawnType";
import { BaseEntity } from "../baseEntity";

export abstract class BaseShipStatus extends BaseEntity {
  constructor(public type: SpawnType) {
    super(type);
  }
}
