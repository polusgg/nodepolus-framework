import { Room as InternalRoom } from "../room";
import { Server } from "./server";
import { DefaultHostState } from "../server";
import { HostGameResponsePacket } from "../protocol/packets/rootGamePackets/hostGame";
import { GameState } from "../types/gameState";
import { Connection } from "../protocol/connection";
import { Player, PlayerState } from "./player";
import { Player as InternalPlayer } from "../player";
import Emittery from "emittery";

declare const server: Server;

export class CodeObject {
  private static get hiddenCode(): string {
    return "A[][";
  }

  private static get removedCode(): string {
    return "9999";
  }

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

  constructor(val: string, public room: Room) {
    this.internalValue = CodeObject.convertToInternal(val);
  }

  static convertToInternal(code: string): string {
    if (code.length == 6) {
      if (/^[A-Z]+$/.test(code)) {
        return code;
      }
      throw new Error(`6-Letter codes, like the one you entered (${code}) must be alphabetical, and uppercase.`);
    }

    if (code.length == 4) {
      if (/^[A-Z[\\\]^_`]+$/.test(code)) {
        return code;
      }
      throw new Error(`4-Letter codes, like the one you entered (${code}) must be either A-Z (uppercase), [, \\, ], ^, _, or \``);
    }

    if (code.length == 3) {
      if (/^[A-Z[\\^_`]+$/.test(code) && code.split("[").length == 2) {
        return code.split("[").join("[[");
      }
      throw new Error(`3-Letter codes, like the one you entered (${code}) must be either A-Z (uppercase), [, \\, ^, _, or \` and must contain exactly one [`);
    }

    if (code.length == 2) {
      if (/^[A-Z\\^_`]+$/.test(code) && code.split("[").length == 2) {
        return `${code}[]`;
      }
      throw new Error(`2-Letter codes, like the one you entered (${code}) must be either A-Z (uppercase), \\, ^, _, or \``);
    }

    if (code.length == 1) {
      if (/^[A-Z\\^_`]+$/.test(code) && code.split("[").length == 2) {
        return `${code}[A]`;
      }
      throw new Error(`1-Letter codes, like the one you entered (${code}) must be either A-Z (uppercase), \\, ^, _, or \``);
    }

    throw new Error(`Room code length must be 1, 2, 3, 4 or 6`);
  }

  set(code: string): void {
    this.internalValue = CodeObject.convertToInternal(code);

    if (!this.internalIsHidden && !this.internalIsRemoved) {
      this.room.internalRoom.sendRootGamePacket(new HostGameResponsePacket(this.internalValue));
    }
  }

  hide(): void {
    this.internalIsHidden = true;

    if (!this.internalIsRemoved) {
      this.room.internalRoom.sendRootGamePacket(new HostGameResponsePacket(CodeObject.hiddenCode));
    }
  }

  show(): void {
    this.internalIsHidden = false;

    if (!this.internalIsRemoved) {
      this.room.internalRoom.sendRootGamePacket(new HostGameResponsePacket(this.internalValue));
    }
  }

  remove(): void {
    this.internalIsRemoved = true;

    this.room.internalRoom.sendRootGamePacket(new HostGameResponsePacket(CodeObject.removedCode));
  }

  recreate(): void {
    this.internalIsRemoved = false;

    this.room.internalRoom.sendRootGamePacket(new HostGameResponsePacket(this.internalValue));
  }
}

type RoomEvents = {
  player: Player;
};

export class Room extends Emittery.Typed<RoomEvents> {
  public readonly internalRoom: InternalRoom;
  public readonly codeObject: CodeObject;
  public readonly players: Player[] = [];

  get state(): GameState {
    return this.internalRoom.gameState;
  }

  // get game(): Game | undefined {
  //   return this.internalGame;
  // }

  get code(): string {
    return this.internalRoom.code;
  }

  set code(code: string) {
    if (!(code.length == 4 || code.length == 6) && !(/^[A-Z]+$/.test(code))) {
      throw new Error("Invalid Code. Codes must be 4 or 6 letters long and alphabetic.");
    }

    server.internalServer.roomMap.delete(this.internalRoom.code);
    server.internalServer.roomMap.set(code, this.internalRoom);
    this.internalRoom.code = code;
  }

  // private internalGame?: Game;

  constructor(room?: InternalRoom) {
    super();

    if (room) {
      this.internalRoom = room;
    } else {
      this.internalRoom = new InternalRoom(server.internalServer.config.defaultRoomAddress, server.internalServer.config.defaultRoomPort, server.internalServer.config.defaultHost == DefaultHostState.Server);
    }

    this.codeObject = new CodeObject(this.code, this);

    this.internalRoom.on("connection", (connection: Connection) => {
      const connectingPlayer = new Player(this, connection.id, connection.address, connection.port);

      this.players.push(connectingPlayer);

      this.emit("player", connectingPlayer);
    });

    this.internalRoom.on("player", (player: InternalPlayer) => {
      const spawnedPlayer = this.players.find(testPlayer => testPlayer.id == player.gameObject.owner);

      if (!spawnedPlayer) {
        throw new Error("Recieved a spawn player for a connection that does not exist");
      }

      spawnedPlayer.playerId = player.gameObject.playerControl.playerId;

      spawnedPlayer.state = PlayerState.Spawned;

      spawnedPlayer.emit("spawned", undefined);
    });
  }
}
