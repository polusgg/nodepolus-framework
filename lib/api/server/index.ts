import { RoomCreatedEvent } from "../events/server/roomCreated";
import { Server as InternalServer } from "../../server";
import { ServerConfig } from "./serverConfig";
import { Lobby } from "../lobby";
import Emittery from "emittery";

export type ServerEvents = {
  roomCreated: Lobby;
};

export class Server extends Emittery.Typed<ServerEvents> {
  public internalServer: InternalServer;
  public rooms: Lobby[] = [];

  constructor(
    config?: ServerConfig,
  ) {
    super();

    this.internalServer = new InternalServer(config);

    this.internalServer.on("roomCreated", (room: RoomCreatedEvent) => {
      const newRoom = new Lobby(room.room);

      this.rooms.push(newRoom);
      this.emit("roomCreated", newRoom);
    });
  }

  async listen(): Promise<void> {
    return new Promise(resolve => {
      this.internalServer.listen(resolve);
    });
  }
}
