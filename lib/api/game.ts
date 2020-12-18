import { GameDataPacket } from "../protocol/packets/rootGamePackets/gameData";
import { InnerLevel } from "../protocol/entities/types";
import Emittery from "emittery";
import { Room } from "./room";

export type GameEvents = {
  ended: never;
};

export abstract class BaseGameRoom extends Emittery.Typed<GameEvents> {
  private shipStatusBackup?: InnerLevel;

  constructor(public game: Game) {
    super();
  }

  private backupShipStatus(): void {
    if (!this.game.room.internalRoom.shipStatus) {
      throw new Error("Attempted to make a copy of ShipStatus without an instance on the room");
    }

    this.shipStatusBackup = this.game.room.internalRoom.shipStatus.innerNetObjects[0].clone();
  }

  private updateShipStatus(): void {
    if (!this.game.room.internalRoom.shipStatus) {
      throw new Error("Attempted to update ShipStatus without an instance on the room");
    }

    if (!this.shipStatusBackup) {
      this.backupShipStatus();
    }

    //@ts-ignore Talk to cody about this.
    const data = this.game.room.internalRoom.shipStatus.innerNetObjects[0].data(this.shipSatusBackup);

    this.game.room.internalRoom.sendRootGamePacket(new GameDataPacket([data], this.game.room.code));
  }
}

export class ElectricalGameRoom extends BaseGameRoom {
  private sabotage(): void {
    
  }
}

export class Game extends Emittery.Typed<GameEvents> {
  constructor(public room: Room) {
    super();
  }
}
