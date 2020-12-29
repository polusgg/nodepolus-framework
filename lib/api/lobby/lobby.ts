import { CodeObject, LobbySettings } from ".";
import { InternalLobby } from "../../lobby";
import { Server } from "../../server";
import { Player } from "../player";
import { Game } from "../game";
import {
  GameState,
} from "../../types/enums";

declare const server: Server;

export class Lobby {
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

    server.lobbyMap.delete(this.internalLobby.code);
    server.lobbyMap.set(code, this.internalLobby);

    this.internalLobby.code = code;
  }

  constructor(
    lobby?: InternalLobby,
  ) {
    if (lobby) {
      this.internalLobby = lobby;
    } else {
      this.internalLobby = new InternalLobby(
        server.defaultLobbyAddress,
        server.defaultLobbyPort,
      );
    }

    this.codeObject = new CodeObject(this.code, this);

    // this.internalLobby.on("connection", (connection: Connection) => {
    //   const connectingPlayer = new Player(this, connection.id, connection.address, connection.port);

    //   this.players.push(connectingPlayer);

    //   this.emit("player", connectingPlayer);
    // });

    // this.internalLobby.on("player", (player: InternalPlayer) => {
    //   const spawnedPlayer = this.players.find(testPlayer => testPlayer.clientId == player.gameObject.owner);

    //   if (!spawnedPlayer) {
    //     throw new Error("Player spawned for a connection that does not exist");
    //   }

    //   spawnedPlayer.playerId = player.gameObject.playerControl.playerId;
    //   spawnedPlayer.state = PlayerState.Spawned;

    //   spawnedPlayer.emit("spawned");
    // });
  }
}
