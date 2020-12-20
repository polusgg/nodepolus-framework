import { InnerPlayerControl, InnerPlayerPhysics, InnerCustomNetworkTransform, EntityPlayer } from "../player";
import { InnerSkeldAprilShipStatus, EntitySkeldAprilShipStatus } from "../skeldAprilShipStatus";
import { InnerPolusShipStatus, EntityPolusShipStatus } from "../polusShipStatus";
import { InnerSkeldShipStatus, EntitySkeldShipStatus } from "../skeldShipStatus";
import { InnerGameData, InnerVoteBanSystem, EntityGameData } from "../gameData";
import { InnerLobbyBehaviour, EntityLobbyBehaviour } from "../lobbyBehaviour";
import { InnerMiraShipStatus, EntityMiraShipStatus } from "../miraShipStatus";
import { InnerAirshipStatus, EntityAirshipStatus } from "../airshipStatus";
import { InnerMeetingHud, EntityMeetingHud } from "../meetingHud";

export { BaseEntity } from "./baseEntity";

export { BaseGameObject } from "./baseGameObject";

export { LobbyImplementation } from "./lobbyImplementation";

export type InnerLevel = InnerSkeldShipStatus
| InnerSkeldAprilShipStatus
| InnerMiraShipStatus
| InnerPolusShipStatus
| InnerAirshipStatus;

export type EntityLevel = EntitySkeldShipStatus
| EntitySkeldAprilShipStatus
| EntityMiraShipStatus
| EntityPolusShipStatus
| EntityAirshipStatus;

export type InnerNetObject = InnerLobbyBehaviour
| InnerGameData
| InnerVoteBanSystem
| InnerPlayerControl
| InnerPlayerPhysics
| InnerCustomNetworkTransform
| InnerMeetingHud
| InnerLevel;

export type Entity = EntityLobbyBehaviour
| EntityGameData
| EntityPlayer
| EntityMeetingHud
| EntityLevel;
