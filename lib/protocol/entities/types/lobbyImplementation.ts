import { BaseRPCPacket } from "../../packets/rpc";
import { GameState } from "../../../types/enums";
import { EntityMeetingHud } from "../meetingHud";
import { GameOptionsData } from "../../../types";
import { EntityLevel, InnerNetObject } from ".";
import { EntityGameData } from "../gameData";
import { HostInstance } from "../../../host";
import { Player } from "../../../player";

export interface LobbyImplementation {
  players: Player[];
  gameData?: EntityGameData;
  shipStatus?: EntityLevel;
  meetingHud?: EntityMeetingHud;
  options: GameOptionsData;
  customHostInstance: HostInstance;
  gameState: GameState;

  sendRPCPacket(from: InnerNetObject, packet: BaseRPCPacket, sendTo?: (Player | HostInstance)[]): void;
}
