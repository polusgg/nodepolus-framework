import { BaseEntityShipStatus } from "../baseShipStatus/baseEntityShipStatus";
import { BaseRPCPacket } from "../../packets/rpc";
import { GameState } from "../../../types/enums";
import { EntityMeetingHud } from "../meetingHud";
import { GameOptionsData } from "../../../types";
import { EntityGameData } from "../gameData";
import { HostInstance } from "../../../host";
import { Player } from "../../../player";
import { BaseInnerNetObject } from ".";

export interface LobbyImplementation {
  players: Player[];
  gameData?: EntityGameData;
  shipStatus?: BaseEntityShipStatus;
  meetingHud?: EntityMeetingHud;
  options: GameOptionsData;
  customHostInstance: HostInstance;
  gameState: GameState;

  sendRPCPacket(from: BaseInnerNetObject, packet: BaseRPCPacket, sendTo?: (Player | HostInstance)[]): void;
}
