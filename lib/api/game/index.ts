import { AirshipRoomCollection } from "./room/collection/airshipRoomCollection";
import { PolusRoomCollection } from "./room/collection/polusRoomCollection";
import { SkeldRoomCollection } from "./room/collection/skeldRoomCollection";
import { BaseRoomCollection } from "./room/collection/baseRoomCollection";
import { MiraRoomCollection } from "./room/collection/miraRoomCollection";
import { Level } from "../../types/enums";
import { Lobby } from "../lobby";
import Emittery from "emittery";

export type GameEvents = {
  ended: never;
};

export class Game extends Emittery.Typed<GameEvents> {
  public rooms: BaseRoomCollection;

  constructor(public lobby: Lobby) {
    super();

    switch (lobby.settings.level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        this.rooms = new SkeldRoomCollection(this);
        break;
      case Level.MiraHq:
        this.rooms = new MiraRoomCollection(this);
        break;
      case Level.Polus:
        this.rooms = new PolusRoomCollection(this);
        break;
      case Level.Airship:
        this.rooms = new AirshipRoomCollection(this);
        break;
    }
  }
}
