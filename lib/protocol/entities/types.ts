import { InnerSkeldAprilShipStatus } from "./skeldAprilShipStatus/innerSkeldAprilShipStatus";
import { InnerCustomNetworkTransform } from "./player/innerCustomNetworkTransform";
import { InnerPolusShipStatus } from "./polusShipStatus/innerPolusShipStatus";
import { InnerSkeldShipStatus } from "./skeldShipStatus/innerSkeldShipStatus";
import { InnerLobbyBehaviour } from "./lobbyBehaviour/innerLobbyBehaviour";
import { InnerMiraShipStatus } from "./miraShipStatus/innerMiraShipStatus";
import { InnerAirshipStatus } from "./airshipStatus/innerAirshipStatus";
import { EntitySkeldAprilShipStatus } from "./skeldAprilShipStatus";
import { InnerVoteBanSystem } from "./gameData/innerVoteBanSystem";
import { InnerPlayerControl } from "./player/innerPlayerControl";
import { InnerPlayerPhysics } from "./player/innerPlayerPhysics";
import { InnerMeetingHud } from "./meetingHud/innerMeetingHud";
import { GameOptionsData } from "../../types/gameOptionsData";
import { EntityPolusShipStatus } from "./polusShipStatus";
import { EntitySkeldShipStatus } from "./skeldShipStatus";
import { InnerGameData } from "./gameData/innerGameData";
import { EntityLobbyBehaviour } from "./lobbyBehaviour";
import { EntityMiraShipStatus } from "./miraShipStatus";
import { EntityAirshipStatus } from "./airshipStatus";
import { BaseRPCPacket } from "../packets/basePacket";
import { GameState } from "../../types/gameState";
import { EntityMeetingHud } from "./meetingHud";
import { HostInstance } from "../../host/types";
import { EntityGameData } from "./gameData";
import { EntityPlayer } from "./player";
import { Player } from "../../player";

export enum InnerNetObjectType {
  LobbyBehaviour,
  GameData,
  VoteBanSystem,
  PlayerControl,
  PlayerPhysics,
  CustomNetworkTransform,
  MeetingHud,
  SkeldShipStatus,
  SkeldAprilShipStatus,
  MiraShipStatus,
  PolusShipStatus,
  AirshipStatus,
}

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

export interface LobbyImplementation {
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
