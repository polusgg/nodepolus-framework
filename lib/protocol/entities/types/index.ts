import { EntitySkeldAprilShipStatus } from "../skeldAprilShipStatus";
import { EntityPolusShipStatus } from "../polusShipStatus";
import { EntitySkeldShipStatus } from "../skeldShipStatus";
import { EntityMiraShipStatus } from "../miraShipStatus";
import { EntityAirshipStatus } from "../airshipStatus";

export { BaseInnerNetEntity } from "./baseInnerNetEntity";

export { BaseInnerNetObject } from "./baseInnerNetObject";

export { LobbyImplementation } from "./lobbyImplementation";

export type EntityLevel = EntitySkeldShipStatus
| EntitySkeldAprilShipStatus
| EntityMiraShipStatus
| EntityPolusShipStatus
| EntityAirshipStatus;
