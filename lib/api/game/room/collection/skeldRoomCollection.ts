import { BaseRoomCollection } from "./baseRoomCollection";
import { SystemType } from "../../../../types/enums";
import { ElectricalGameRoom } from "../electrical";
import { SecurityGameRoom } from "../security";
import { ReactorGameRoom } from "../reactor";
import { BaseDoorGameRoom } from "../base";
import { MedbayGameRoom } from "../medbay";
import { Game } from "../..";

export class SkeldRoomCollection extends BaseRoomCollection {
  public cafeteria: BaseDoorGameRoom;
  public weapons: BaseDoorGameRoom;
  public oxygen: undefined;
  public navigation: BaseDoorGameRoom;
  public shields: BaseDoorGameRoom;
  public communications: undefined;
  public admin: BaseDoorGameRoom;
  public storage: BaseDoorGameRoom;
  public medbay: MedbayGameRoom;
  public electrical: ElectricalGameRoom;
  public security: SecurityGameRoom;
  public upperEngine: BaseDoorGameRoom;
  public lowerEngine: BaseDoorGameRoom;
  public reactor: ReactorGameRoom;

  constructor(game: Game) {
    super(game);

    this.cafeteria = new BaseDoorGameRoom(this.game, SystemType.Cafeteria);
    this.weapons = new BaseDoorGameRoom(this.game, SystemType.Weapons);
    // this.oxygen = new
    this.navigation = new BaseDoorGameRoom(this.game, SystemType.Navigation);
    this.shields = new BaseDoorGameRoom(this.game, SystemType.Shields);
    // this.communications = new
    this.admin = new BaseDoorGameRoom(this.game, SystemType.Admin);
    this.storage = new BaseDoorGameRoom(this.game, SystemType.Storage);
    this.medbay = new MedbayGameRoom(this.game);
    this.electrical = new ElectricalGameRoom(this.game);
    this.security = new SecurityGameRoom(this.game);
    this.upperEngine = new BaseDoorGameRoom(this.game, SystemType.UpperEngine);
    this.lowerEngine = new BaseDoorGameRoom(this.game, SystemType.LowerEngine);
    this.reactor = new ReactorGameRoom(this.game);
  }
}
