import { LobbyImplementation, EntityLevel, InnerNetObject } from "../protocol/entities/types";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { EntityGameData } from "../protocol/entities/gameData";
import { GameDataPacket } from "../protocol/packets/root";
import { RPCPacket } from "../protocol/packets/gameData";
import { BaseRPCPacket } from "../protocol/packets/rpc";
import { GameState } from "../types/enums";
import { GameOptionsData } from "../types";
import { HostInstance } from "../host";
import { Player } from "../player";
import { Proxy } from ".";

export class ProxyLobby implements LobbyImplementation {
  public players: Player[] = [];
  public gameData?: EntityGameData;
  public shipStatus?: EntityLevel;
  public meetingHud?: EntityMeetingHud;
  public options: GameOptionsData = new GameOptionsData();
  public customHostInstance: HostInstance;
  public gameState: GameState = GameState.NotStarted;

  constructor(
    private readonly proxy: Proxy,
    public isHost: boolean,
    public code: string,
  ) {}

  sendRPCPacket(from: InnerNetObject, packet: BaseRPCPacket, _sendTo?: (Player | HostInstance)[]): void {
    this.proxy.serverConnection.write(new GameDataPacket([
      new RPCPacket(from.id, packet),
    ], this.code));
  }
}
