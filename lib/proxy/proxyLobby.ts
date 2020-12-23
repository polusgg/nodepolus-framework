import { BaseEntityShipStatus } from "../protocol/entities/baseShipStatus/baseEntityShipStatus";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { BaseInnerNetObject } from "../protocol/entities/types";
import { EntityGameData } from "../protocol/entities/gameData";
import { GameDataPacket } from "../protocol/packets/root";
import { RPCPacket } from "../protocol/packets/gameData";
import { BaseRPCPacket } from "../protocol/packets/rpc";
import { GameState } from "../types/enums";
import { GameOptionsData } from "../types";
import { LobbyInstance } from "../lobby";
import { HostInstance } from "../host";
import { Player } from "../player";
import { Proxy } from ".";

export class ProxyLobby implements LobbyInstance {
  public players: Player[] = [];
  public gameData?: EntityGameData;
  public shipStatus?: BaseEntityShipStatus;
  public meetingHud?: EntityMeetingHud;
  public options: GameOptionsData = new GameOptionsData();
  public customHostInstance: HostInstance;
  public gameState: GameState = GameState.NotStarted;

  constructor(
    private readonly proxy: Proxy,
    public isHost: boolean,
    public code: string,
  ) {}

  sendRPCPacket(from: BaseInnerNetObject, packet: BaseRPCPacket, _sendTo?: (Player | HostInstance)[]): void {
    this.proxy.serverConnection.write(new GameDataPacket([
      new RPCPacket(from.netId, packet),
    ], this.code));
  }
}
