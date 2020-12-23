import { PlayerData } from "../../protocol/entities/gameData";
import { EntityPlayer } from "../../protocol/entities/player";
import { CodeObject, LobbyEvents, LobbySettings } from ".";
import { Player as InternalPlayer } from "../../player";
import { Connection } from "../../protocol/connection";
import { Lobby as InternalLobby } from "../../lobby";
import { TextComponent } from "../text";
import { Vector2 } from "../../types";
import { Player } from "../player";
import { Server } from "../server";
import Emittery from "emittery";
import { Game } from "../game";
import {
  EndGamePacket,
  GameDataPacket,
  JoinGameResponsePacket,
  JoinedGamePacket,
  RemovePlayerPacket,
  StartGamePacket,
} from "../../protocol/packets/root";
import {
  FakeClientId,
  GameOverReason,
  GameState,
  Level,
  PlayerColor,
  PlayerHat,
  PlayerPet,
  PlayerSkin,
  PlayerState,
} from "../../types/enums";

declare const server: Server;

export class Lobby extends Emittery.Typed<LobbyEvents> {
  public readonly internalLobby: InternalLobby;
  public readonly codeObject: CodeObject;
  public readonly players: Player[] = [];
  public readonly settings: LobbySettings = new LobbySettings(this);

  public game?: Game;

  get state(): GameState {
    return this.internalLobby.gameState;
  }

  get code(): string {
    return this.internalLobby.code;
  }

  set code(code: string) {
    if ((code.length != 4 && code.length != 6) || !(/^[A-Z]+$/.test(code))) {
      throw new Error(`Invalid lobby code, expected 4 or 6 alphabetical characters: ${code}`);
    }

    server.internalServer.lobbyMap.delete(this.internalLobby.code);
    server.internalServer.lobbyMap.set(code, this.internalLobby);

    this.internalLobby.code = code;
  }

  constructor(
    lobby?: InternalLobby,
  ) {
    super();

    if (lobby) {
      this.internalLobby = lobby;
    } else {
      this.internalLobby = new InternalLobby(
        server.internalServer.defaultLobbyAddress,
        server.internalServer.defaultLobbyPort,
      );
    }

    this.codeObject = new CodeObject(this.code, this);

    this.internalLobby.on("connection", (connection: Connection) => {
      const connectingPlayer = new Player(this, connection.id, connection.address, connection.port);

      this.players.push(connectingPlayer);

      this.emit("player", connectingPlayer);
    });

    this.internalLobby.on("player", (player: InternalPlayer) => {
      const spawnedPlayer = this.players.find(testPlayer => testPlayer.clientId == player.gameObject.owner);

      if (!spawnedPlayer) {
        throw new Error("Player spawned for a connection that does not exist");
      }

      spawnedPlayer.playerId = player.gameObject.playerControl.playerId;
      spawnedPlayer.state = PlayerState.Spawned;

      spawnedPlayer.emit("spawned");
    });
  }

  sendChat(name: string, color: PlayerColor, message: string | TextComponent, _onLeft: boolean): void {
    if (this.players.length != 0) {
      const { name: oldName, color: oldColor } = this.players[0];

      this.players[0]
        .setName(name)
        .setColor(color)
        .sendChat(message.toString())
        .setName(oldName)
        .setColor(oldColor);
    }
  }

  changeLevel(level: Level): void {
    if (!this.internalLobby.shipStatus) {
      // TODO: Remove this call?
      //          You might want to switch from [NO MAP] to [SKELD]
      //          or something?
      throw new Error("Attempted to change current level from no level");
    }

    this.internalLobby.sendRootGamePacket(new EndGamePacket(this.code, GameOverReason.ImpostorsBySabotage, true));

    this.internalLobby.connections.forEach(con => {
      con.write(new JoinedGamePacket(this.code, con.id, this.internalLobby.customHostInstance!.id, this.internalLobby.connections.map(c => c.id).filter(id => id != con.id)));
    });

    this.internalLobby.customHostInstance.readyPlayerList = [];
    this.internalLobby.options.levels = [level];

    this.internalLobby.sendRootGamePacket(new StartGamePacket(this.code));
  }

  clearMessage(): void {
    //TODO: this *is* possible....
    //      somehow...
  }

  sendMessage(message: TextComponent | string): void {
    if (this.internalLobby.gameData == undefined) {
      throw new Error("sendMessage called without a GameData instance");
    }

    const playerId = 127;
    const playerData = new PlayerData(
      playerId,
      `[FFFFFFFF]${message.toString()}[FFFFFF00]`,
      PlayerColor.Red,
      PlayerHat.None,
      PlayerPet.None,
      PlayerSkin.None,
      false,
      false,
      false,
      [],
    );

    const entity = new EntityPlayer(
      this.internalLobby,
      FakeClientId.Message,
      this.internalLobby.customHostInstance.getNextNetId(),
      playerId,
      this.internalLobby.customHostInstance.getNextNetId(),
      this.internalLobby.customHostInstance.getNextNetId(),
      5,
      new Vector2(39, 39),
      new Vector2(0, 0),
    );

    this.internalLobby.sendRootGamePacket(new JoinGameResponsePacket(this.internalLobby.code, FakeClientId.Message, this.internalLobby.customHostInstance.id));
    this.internalLobby.sendRootGamePacket(new GameDataPacket([entity.serializeSpawn()], this.internalLobby.code));

    this.internalLobby.connections.forEach(con => {
      con.flush();
    });

    this.internalLobby.gameData.gameData.updateGameData([playerData], this.internalLobby.connections);
    this.internalLobby.sendRootGamePacket(new RemovePlayerPacket(this.code, FakeClientId.Message, this.internalLobby.customHostInstance!.id));
  }
}
