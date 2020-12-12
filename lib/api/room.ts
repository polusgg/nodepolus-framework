import { HostGameResponsePacket } from "../protocol/packets/rootGamePackets/hostGame";
import { Player as InternalPlayer } from "../player";
import { Connection } from "../protocol/connection";
import { GameState } from "../types/gameState";
import { Player, PlayerState } from "./player";
import { Room as InternalRoom } from "../room";
import { DefaultHostState } from "../server";
import { Server } from "./server";
import Emittery from "emittery";

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
    public room: Room,
  ) {
    this.internalValue = CodeObject.convertToInternal(value);
  }

  static convertToInternal(code: string): string {
    switch (code.length) {
      case 1:
        if (/^[A-Z\\^_`]+$/.test(code) && code.split("[").length == 2) {
          return `${code}[A]`;
        }

        throw new Error(`Invalid 1-character room code, codes may only contain A-Z, \\, ^, _, and \`: ${code}`);
      case 2:
        if (/^[A-Z\\^_`]+$/.test(code) && code.split("[").length == 2) {
          return `${code}[]`;
        }

        throw new Error(`Invalid 2-character room code, codes may only contain A-Z, \\, ^, _, and \`: ${code}`);
      case 3:
        if (/^[A-Z[\\^_`]+$/.test(code) && code.split("[").length == 2) {
          return code.split("[").join("[[");
        }

        throw new Error(`Invalid 3-character room code, codes may only contain A-Z, [, \\, ^, _, and \`, and must contain exactly one [: ${code}`);
      case 4:
        if (/^[A-Z[\\\]^_`]+$/.test(code)) {
          return code;
        }

        throw new Error(`Invalid 4-character room code, codes may only contain A-Z, [, \\, ], ^, _, and \`: ${code}`);
      case 6:
        if (/^[A-Z]+$/.test(code)) {
          return code;
        }

        throw new Error(`Invalid 6-character room code, codes may only contain A-Z: ${code}`);
      default:
        throw new Error(`Invalid room code, expected 1-4 or 6 characters: ${code}`);
    }
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

  restore(): void {
    this.internalIsRemoved = false;

    this.room.internalRoom.sendRootGamePacket(new HostGameResponsePacket(this.internalValue));
  }
}

export type RoomEvents = {
  player: Player;
};

export class Room extends Emittery.Typed<RoomEvents> {
  public readonly internalRoom: InternalRoom;
  public readonly codeObject: CodeObject;
  public readonly players: Player[] = [];

  get state(): GameState {
    return this.internalRoom.gameState;
  }

  get code(): string {
    return this.internalRoom.code;
  }

  set code(code: string) {
    if ((code.length != 4 && code.length != 6) || !(/^[A-Z]+$/.test(code))) {
      throw new Error(`Invalid room code, expected 4 or 6 alphabetical characters: ${code}`);
    }

    server.internalServer.roomMap.delete(this.internalRoom.code);
    server.internalServer.roomMap.set(code, this.internalRoom);

    this.internalRoom.code = code;
  }

  constructor(
    room?: InternalRoom,
  ) {
    super();

    if (room) {
      this.internalRoom = room;
    } else {
      this.internalRoom = new InternalRoom(
        server.internalServer.config.defaultRoomAddress,
        server.internalServer.config.defaultRoomPort,
        server.internalServer.config.defaultHost == DefaultHostState.Server,
      );
    }

    this.codeObject = new CodeObject(this.code, this);

    this.internalRoom.on("connection", (connection: Connection) => {
      const connectingPlayer = new Player(this, connection.id, connection.address, connection.port);

      this.players.push(connectingPlayer);

      this.emit("player", connectingPlayer);
    });

    this.internalRoom.on("player", (player: InternalPlayer) => {
      const spawnedPlayer = this.players.find(testPlayer => testPlayer.clientId == player.gameObject.owner);

      if (!spawnedPlayer) {
        throw new Error("Player spawned for a connection that does not exist");
      }

      spawnedPlayer.playerId = player.gameObject.playerControl.playerId;
      spawnedPlayer.state = PlayerState.Spawned;

      spawnedPlayer.emit("spawned");
    });
  }
}
