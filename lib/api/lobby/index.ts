import { InnerCustomNetworkTransform } from "../../protocol/entities/player/innerCustomNetworkTransform";
import { HostGameResponsePacket } from "../../protocol/packets/rootGamePackets/hostGame";
import { JoinGameResponsePacket } from "../../protocol/packets/rootGamePackets/joinGame";
import { RemovePlayerPacket } from "../../protocol/packets/rootGamePackets/removePlayer";
import { InnerPlayerControl } from "../../protocol/entities/player/innerPlayerControl";
import { InnerPlayerPhysics } from "../../protocol/entities/player/innerPlayerPhysics";
import { JoinedGamePacket } from "../../protocol/packets/rootGamePackets/joinedGame";
import { StartGamePacket } from "../../protocol/packets/rootGamePackets/startGame";
import { GameDataPacket } from "../../protocol/packets/rootGamePackets/gameData";
import { EndGamePacket } from "../../protocol/packets/rootGamePackets/endGame";
import { PlayerData } from "../../protocol/entities/gameData/playerData";
import { EntityPlayer } from "../../protocol/entities/player";
import { GameOverReason } from "../../types/gameOverReason";
import { DefaultHostState } from "../server/serverConfig";
import { FakeClientId } from "../../types/fakeClientId";
import { Player as InternalPlayer } from "../../player";
import { Connection } from "../../protocol/connection";
import { PlayerColor } from "../../types/playerColor";
import { Lobby as InternalLobby } from "../../lobby";
import { PlayerSkin } from "../../types/playerSkin";
import { GameState } from "../../types/gameState";
import { PlayerHat } from "../../types/playerHat";
import { PlayerPet } from "../../types/playerPet";
import { LobbySettings } from "./lobbySettings";
import { Player, PlayerState } from "../player";
import { Vector2 } from "../../util/vector2";
import { Level } from "../../types/level";
import { CustomHost } from "../../host";
import { TextComponent } from "../text";
import { Server } from "../server";
import Emittery from "emittery";
import { Game } from "../game";

declare const server: Server;

export class CodeObject {
  private internalValue: string;
  private internalIsHidden = false;
  private internalIsRemoved = false;

  get value(): string {
    return this.internalValue;
  }

  get isHidden(): boolean {
    return this.internalIsHidden;
  }

  get isRemoved(): boolean {
    return this.internalIsRemoved;
  }

  private static get hiddenCode(): string {
    return "A[][";
  }

  private static get removedCode(): string {
    return "9999";
  }

  constructor(
    value: string,
    public lobby: Lobby,
  ) {
    this.internalValue = CodeObject.convertToInternal(value);
  }

  static convertToInternal(code: string): string {
    switch (code.length) {
      case 1:
        if (/^[A-Z\\^_`]+$/.test(code) && code.split("[").length == 2) {
          return `${code}[A]`;
        }

        throw new Error(`Invalid 1-character lobby code, codes may only contain A-Z, \\, ^, _, and \`: ${code}`);
      case 2:
        if (/^[A-Z\\^_`]+$/.test(code) && code.split("[").length == 2) {
          return `${code}[]`;
        }

        throw new Error(`Invalid 2-character lobby code, codes may only contain A-Z, \\, ^, _, and \`: ${code}`);
      case 3:
        if (/^[A-Z[\\^_`]+$/.test(code) && code.split("[").length == 2) {
          return code.split("[").join("[[");
        }

        throw new Error(`Invalid 3-character lobby code, codes may only contain A-Z, [, \\, ^, _, and \`, and must contain exactly one [: ${code}`);
      case 4:
        if (/^[A-Z[\\\]^_`]+$/.test(code)) {
          return code;
        }

        throw new Error(`Invalid 4-character lobby code, codes may only contain A-Z, [, \\, ], ^, _, and \`: ${code}`);
      case 6:
        if (/^[A-Z]+$/.test(code)) {
          return code;
        }

        throw new Error(`Invalid 6-character lobby code, codes may only contain A-Z: ${code}`);
      default:
        throw new Error(`Invalid lobby code, expected 1-4 or 6 characters: ${code}`);
    }
  }

  set(code: string): void {
    this.internalValue = CodeObject.convertToInternal(code);

    if (!this.internalIsHidden && !this.internalIsRemoved) {
      this.lobby.internalLobby.sendRootGamePacket(new HostGameResponsePacket(this.internalValue));
    }
  }

  hide(): void {
    this.internalIsHidden = true;

    if (!this.internalIsRemoved) {
      this.lobby.internalLobby.sendRootGamePacket(new HostGameResponsePacket(CodeObject.hiddenCode));
    }
  }

  show(): void {
    this.internalIsHidden = false;

    if (!this.internalIsRemoved) {
      this.lobby.internalLobby.sendRootGamePacket(new HostGameResponsePacket(this.internalValue));
    }
  }

  remove(): void {
    this.internalIsRemoved = true;

    this.lobby.internalLobby.sendRootGamePacket(new HostGameResponsePacket(CodeObject.removedCode));
  }

  restore(): void {
    this.internalIsRemoved = false;

    this.lobby.internalLobby.sendRootGamePacket(new HostGameResponsePacket(this.internalValue));
  }
}

export type LobbyEvents = {
  player: Player;
};

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
        server.internalServer.defaultHost == DefaultHostState.Server,
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

    if (this.internalLobby.host instanceof CustomHost) {
      this.internalLobby.sendRootGamePacket(new EndGamePacket(this.code, GameOverReason.ImpostorsBySabotage, true));

      this.internalLobby.connections.forEach(con => {
        con.write(new JoinedGamePacket(this.code, con.id, this.internalLobby.host!.id, this.internalLobby.connections.map(c => c.id).filter(id => id != con.id)));
      });

      this.internalLobby.host.readyPlayerList = [];
      this.internalLobby.options.options.levels = [level];

      this.internalLobby.sendRootGamePacket(new StartGamePacket(this.code));
    }
  }

  clearMessage(): void {
    if (this.internalLobby.host instanceof CustomHost) {
      this.internalLobby.sendRootGamePacket(new EndGamePacket(this.code, 0, false));

      setTimeout(() => {
        this.internalLobby.connections.forEach(connection => {
          const player = this.internalLobby.findPlayerByConnection(connection);

          if (player) {
            connection.write(new JoinedGamePacket(
              this.code,
              connection.id,
              this.internalLobby.host!.id,
              this.internalLobby.connections.map(e => e.id).filter(id => id != connection.id)),
            );
            connection.write(new GameDataPacket(this.internalLobby.players.map(p => p.gameObject.spawn()), this.code));

            if (this.internalLobby.lobbyBehavior) {
              connection.write(new GameDataPacket([this.internalLobby.lobbyBehavior.spawn()], this.code));
            }

            if (this.internalLobby.gameData) {
              connection.write(new GameDataPacket([this.internalLobby.gameData.spawn()], this.code));
            }

            if (this.internalLobby.shipStatus) {
              connection.write(new GameDataPacket([this.internalLobby.shipStatus.spawn()], this.code));
            }
          }
        });
      }, 100);
    }
  }

  sendMessage(message: TextComponent | string): void {
    if (this.internalLobby.gameData == undefined) {
      throw new Error("sendMessage called without a GameData instance");
    }

    if (this.internalLobby.host instanceof CustomHost) {
      const playerId = 127;
      const entity = new EntityPlayer(this.internalLobby);
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

      entity.owner = FakeClientId.Message;
      entity.innerNetObjects = [
        new InnerPlayerControl(this.internalLobby.host.nextNetId, entity, false, playerId),
        new InnerPlayerPhysics(this.internalLobby.host.nextNetId, entity),
        new InnerCustomNetworkTransform(this.internalLobby.host.nextNetId, entity, 5, new Vector2(39, 39), new Vector2(0, 0)),
      ];

      this.internalLobby.sendRootGamePacket(new JoinGameResponsePacket(this.internalLobby.code, FakeClientId.Message, this.internalLobby.host.id));
      this.internalLobby.sendRootGamePacket(new GameDataPacket([entity.spawn()], this.internalLobby.code));

      setTimeout(() => {
        if (this.internalLobby.gameData == undefined) {
          throw new Error("Attempted to send a lobby message without a GameData instance");
        }

        this.internalLobby.gameData.gameData.updateGameData([playerData], this.internalLobby.connections);
        this.internalLobby.sendRootGamePacket(new RemovePlayerPacket(this.code, FakeClientId.Message, this.internalLobby.host!.id));
      }, 51);
    }
  }
}
