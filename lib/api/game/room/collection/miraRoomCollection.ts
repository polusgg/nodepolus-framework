import { BaseRoomCollection } from "./baseRoomCollection";
import { ElectricalGameRoom } from "../electrical";
import { Game } from "../..";

export class MiraRoomCollection extends BaseRoomCollection {
  public launchpad: undefined;
  public reactor: undefined;
  public laboratory: undefined;
  public decontamination: undefined;
  public lockerRoom: undefined;
  public medbay: undefined;
  public communications: undefined;
  public office: ElectricalGameRoom;
  public greenhouse: undefined;
  public admin: undefined;
  public storage: undefined;
  public cafeteria: undefined;
  public balcony: undefined;

  constructor(game: Game) {
    super(game);

    this.office = new ElectricalGameRoom(this.game);
  }
}
