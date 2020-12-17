import { InnerCustomNetworkTransform } from "./player/innerCustomNetworkTransform";
import { InnerAprilShipStatus } from "./aprilShipStatus/innerAprilShipStatus";
import { InnerLobbyBehaviour } from "./lobbyBehaviour/innerLobbyBehaviour";
import { InnerAirship } from "./airshipShipStatus/innerArshipShipStatus";
import { InnerHeadquarters } from "./headquarters/innerHeadquarters";
import { InnerVoteBanSystem } from "./gameData/innerVoteBanSystem";
import { InnerPlayerControl } from "./player/innerPlayerControl";
import { InnerPlayerPhysics } from "./player/innerPlayerPhysics";
import { InnerMeetingHud } from "./meetingHud/innerMeetingHud";
import { InnerShipStatus } from "./shipStatus/innerShipStatus";
import { GameOptionsData } from "../../types/gameOptionsData";
import { InnerPlanetMap } from "./planetMap/innerPlanetMap";
import { EntityAprilShipStatus } from "./aprilShipStatus";
import { InnerGameData } from "./gameData/innerGameData";
import { BaseRPCPacket } from "../packets/basePacket";
import { EntityAirship } from "./airshipShipStatus";
import { EntityHeadquarters } from "./headquarters";
import { GameState } from "../../types/gameState";
import { EntityMeetingHud } from "./meetingHud";
import { EntityShipStatus } from "./shipStatus";
import { HostInstance } from "../../host/types";
import { EntityPlanetMap } from "./planetMap";
import { EntityGameData } from "./gameData";
import { Player } from "../../player";

export enum InnerNetObjectType {
  LobbyBehaviour,
  GameData,
  VoteBanSystem,
  PlayerControl,
  PlayerPhysics,
  CustomNetworkTransform,
  ShipStatus,
  PlanetMap,
  Headquarters,
  AprilShipStatus,
  MeetingHud,
  Airship,
}

export type InnerNetObject = InnerMeetingHud
| InnerGameData
| InnerCustomNetworkTransform
| InnerPlanetMap
| InnerHeadquarters
| InnerAprilShipStatus
| InnerPlayerControl
| InnerPlayerPhysics
| InnerShipStatus
| InnerVoteBanSystem
| InnerLobbyBehaviour
| InnerAirship;

export type InnerLevel = InnerShipStatus
| InnerPlanetMap
| InnerHeadquarters
| InnerAprilShipStatus
| InnerAirship;

export type EntityLevel = EntityShipStatus
| EntityAprilShipStatus
| EntityHeadquarters
| EntityPlanetMap
| EntityAirship;

export interface RoomImplementation {
  players: Player[];
  gameData?: EntityGameData;
  shipStatus?: EntityLevel;
  meetingHud?: EntityMeetingHud;
  options: GameOptionsData;
  host: HostInstance | undefined;
  isHost: boolean;
  gameState: GameState;

  sendRPCPacket(from: InnerNetObject, packet: BaseRPCPacket, sendTo?: (Player | HostInstance)[]): void;
}
