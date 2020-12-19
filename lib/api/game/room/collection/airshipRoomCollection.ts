import { BaseRoomCollection } from "./baseRoomCollection";
import { ElectricalGameRoom } from "../electrical";
import { Game } from "../..";

export class AirshipRoomCollection extends BaseRoomCollection {
  public vault: never;
  public brig: never;
  public meetingRoom: never;
  public gapRoom: never;
  public records: never;
  public lounge: never;
  public cockpit: never;
  public communications: never;
  public engineRoom: never;
  public mainHall: never;
  public showers: never;
  public cargoBay: never;
  public armory: never;
  public viewingDeck: never;
  public kitchen: never;
  public security: never;
  public electrical: ElectricalGameRoom;
  public medbay: never;

  constructor(game: Game) {
    super(game);

    this.electrical = new ElectricalGameRoom(this.game);
  }
}
