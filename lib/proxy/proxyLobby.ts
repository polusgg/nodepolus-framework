import { BaseEntityShipStatus } from "../protocol/entities/baseShipStatus/baseEntityShipStatus";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { BaseInnerNetObject } from "../protocol/entities/types";
import { EntityGameData } from "../protocol/entities/gameData";
import { GameDataPacket } from "../protocol/packets/root";
import { RPCPacket } from "../protocol/packets/gameData";
import { BaseRPCPacket } from "../protocol/packets/rpc";
import { LobbyInstance } from "../api/lobby";
import { GameState } from "../types/enums";
import { HostInstance } from "../api/host";
import { InternalPlayer } from "../player";
import { GameOptionsData } from "../types";
import { InternalProxy } from ".";

export class ProxyLobby implements LobbyInstance {
  public players: InternalPlayer[] = [];
  public gameData?: EntityGameData;
  public shipStatus?: BaseEntityShipStatus;
  public meetingHud?: EntityMeetingHud;
  public options: GameOptionsData = new GameOptionsData();
  public customHostInstance: HostInstance;
  public gameState: GameState = GameState.NotStarted;

  constructor(
    private readonly proxy: InternalProxy,
    public isHost: boolean,
    public code: string,
  ) {}

  sendRPCPacket(from: BaseInnerNetObject, packet: BaseRPCPacket, _sendTo?: (InternalPlayer | HostInstance)[]): void {
    this.proxy.serverConnection.write(new GameDataPacket([
      new RPCPacket(from.netId, packet),
    ], this.code));
  }
}
