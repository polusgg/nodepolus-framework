import { BaseEntityShipStatus } from "../protocol/entities/baseShipStatus/baseEntityShipStatus";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { BaseInnerNetObject } from "../protocol/entities/types";
import { EntityGameData } from "../protocol/entities/gameData";
import { BaseRPCPacket } from "../protocol/packets/rpc";
import { GameState } from "../types/enums";
import { GameOptionsData } from "../types";
import { HostInstance } from "../host";
import { Player } from "../player";

export interface LobbyInstance {
  players: Player[];
  gameData?: EntityGameData;
  shipStatus?: BaseEntityShipStatus;
  meetingHud?: EntityMeetingHud;
  options: GameOptionsData;
  customHostInstance: HostInstance;
  gameState: GameState;

  sendRPCPacket(from: BaseInnerNetObject, packet: BaseRPCPacket, sendTo?: (Player | HostInstance)[]): void;
}
