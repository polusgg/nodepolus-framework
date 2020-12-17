import Emittery from "emittery";
import { Room } from "./room";
import { InnerLevel } from "../protocol/entities/types";
import { GameDataPacket } from "../protocol/packets/rootGamePackets/gameData";

export type GameEvents = {
  ended: never;
};

export class BaseGameRoom extends Emittery.Typed<GameEvents> {
  private shipStatusBackup?: InnerLevel;

  constructor(public game: Game) {
    super();
  }

  private backupShipStatus(): void {
    if (!this.game.room.internalRoom.shipStatus) {
      throw new Error("TODO fill this in");
    }

    this.shipStatusBackup = this.game.room.internalRoom.shipStatus.innerNetObjects[0].clone();
  }

  private updateShipStatus(): void {
    if (!this.game.room.internalRoom.shipStatus) {
      throw new Error("fill this in");
    }

    if (!this.shipStatusBackup) {
      throw new Error("fill this in");
    }

    //@ts-ignore Talk to cody about this.
    const data = this.game.room.internalRoom.shipStatus.innerNetObjects[0].data(this.shipSatusBackup);

    this.game.room.internalRoom.sendRootGamePacket(new GameDataPacket([data], this.game.room.code));
  }
}

export class ElectricalGameRoom extends BaseGameRoom {
  private sabotage() {
    
  }
}

export class Game extends Emittery.Typed<GameEvents> {
  constructor(public room: Room) {
    super();
  }
}
