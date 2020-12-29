import { BaseEntityShipStatus } from "../../protocol/entities/baseShipStatus/baseEntityShipStatus";
import { EntityMeetingHud } from "../../protocol/entities/meetingHud";
import { BaseInnerNetObject } from "../../protocol/entities/types";
import { EntityGameData } from "../../protocol/entities/gameData";
import { BaseRPCPacket } from "../../protocol/packets/rpc";
import { Connection } from "../../protocol/connection";
import { GameState } from "../../types/enums";
import { HostInstance } from "../../api/host";
import { InternalPlayer } from "../../player";
import { GameOptionsData } from "../../types";

export interface LobbyInstance {
  connections: Connection[];
  players: InternalPlayer[];
  gameData?: EntityGameData;
  shipStatus?: BaseEntityShipStatus;
  meetingHud?: EntityMeetingHud;
  options: GameOptionsData;
  customHostInstance: HostInstance;
  gameState: GameState;

  sendRPCPacket(from: BaseInnerNetObject, packet: BaseRPCPacket, sendTo?: (InternalPlayer | HostInstance)[]): void;

  findConnectionByPlayer(player: InternalPlayer): Connection | undefined;
}
