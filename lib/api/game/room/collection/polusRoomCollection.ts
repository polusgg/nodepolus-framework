import { BaseRoomCollection } from "./baseRoomCollection";
import { ElectricalGameRoom } from "../electrical";
import { Game } from "../..";

export class PolusRoomCollection extends BaseRoomCollection {
  public dropship: undefined;
  public electrical: ElectricalGameRoom;
  public security: undefined;
  public oxygen: undefined;
  public communications: undefined;
  public weapons: undefined;
  public storage: undefined;
  public office: undefined;
  public admin: undefined;
  public laboratory: undefined;
  public specimenRoom: undefined;
  public leftDecontamination: undefined;
  public rightDecontamination: undefined;

  constructor(game: Game) {
    super(game);

    this.electrical = new ElectricalGameRoom(this.game);
  }
}
