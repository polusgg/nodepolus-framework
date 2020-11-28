import { SpawnType } from "../../types/spawnType";
import { InnerNetObjectType } from "./types";
import { DataPacket } from "../packets/rootGamePackets/gameDataPackets/data";
import { SpawnPacket, SpawnInnerNetObject } from "../packets/rootGamePackets/gameDataPackets/spawn";

export abstract class BaseEntity {
  constructor(public readonly type: SpawnType) {}

  abstract setSpawn(packet: SpawnPacket): void;

  abstract getSpawn(): SpawnPacket;
}

export abstract class BaseGameObject {
  constructor(public readonly type: InnerNetObjectType, public id: number) {}

  abstract setData(packet: DataPacket): void;

  abstract getData(old: this): DataPacket;

  data(packet: DataPacket): void;
  data(old: this): DataPacket;
  data(arg0: DataPacket | this): DataPacket | void {
    if (arg0 instanceof DataPacket) {
      this.setData(arg0);
    } else {
      return this.getData(arg0);
    }
  }

  abstract setSpawn(packet: SpawnInnerNetObject): void;

  abstract getSpawn(): SpawnInnerNetObject;

  spawn(packet: SpawnInnerNetObject): void;
  spawn(): SpawnInnerNetObject;
  spawn(fromPacket?: SpawnInnerNetObject): SpawnInnerNetObject | void {
    if (fromPacket) {
      this.setSpawn(fromPacket);
    } else {
      return this.getSpawn();
    }
  }
}
