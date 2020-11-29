import { InnerCustomNetworkTransform } from "./player/innerCustomNetworkTransform";
import { InnerHeadquarters } from "./headquarters/innerHeadquarters";
import { InnerVoteBanSystem } from "./gameData/innerVoteBanSystem";
import { InnerPlayerControl } from "./player/innerPlayerControl";
import { InnerPlayerPhysics } from "./player/innerPlayerPhysics";
import { InnerMeetingHud } from "./meetingHud/innerMeetingHud";
import { InnerShipStatus } from "./shipStatus/innerShipStatus";
import { InnerPlanetMap } from "./planetMap/innerPlanetMap";
import { InnerGameData } from "./gameData/innerGameData";
import { Connection } from "../connection";
import { EntityGameData } from "./gameData";
import { EntityShipStatus } from "./shipStatus";
import { EntityAprilShipStatus } from "./aprilShipStatus";
import { EntityHeadquarters } from "./headquarters";
import { EntityPlanetMap } from "./planetMap";
import { EntityMeetingHud } from "./meetingHud";
import { BaseRPCPacket } from "../packets/basePacket";
import { GameOptionsData } from "../../types/gameOptionsData";
import { HostInstance } from "../../host/types";
import { InnerLobbyBehaviour } from "./lobbyBehaviour/innerLobbyBehaviour";
import { InnerAprilShipStatus } from "./aprilShipStatus/innerAprilShipStatus";

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
}

export type InnerNetObject = InnerMeetingHud
                           | InnerGameData
                           | InnerCustomNetworkTransform
                           | InnerPlanetMap
                           | InnerHeadquarters
                           | InnerPlayerControl
                           | InnerPlayerPhysics
                           | InnerShipStatus
                           | InnerVoteBanSystem
                           | InnerLobbyBehaviour

export type InnerLevel = InnerShipStatus
                       | InnerPlanetMap
                       | InnerHeadquarters
                       | InnerAprilShipStatus

export interface RoomImplementation {
  connections: Connection[];
  gameData?: EntityGameData;
  shipStatus?: EntityShipStatus | EntityAprilShipStatus | EntityHeadquarters | EntityPlanetMap;
  meetingHud?: EntityMeetingHud;
  options: GameOptionsData;
  host: HostInstance;
  isHost: boolean;

  sendRPCPacket(from: InnerNetObject, packet: BaseRPCPacket, sendTo?: Connection[]): void;
}
