import { RoomCreatedEvent } from "../events/server/roomCreated";
import { Server as InternalServer } from "../../server";
import { ServerConfig } from "./serverConfig";
import Emittery from "emittery";
import { Room } from "../room";

export type ServerEvents = {
  roomCreated: Room;
};

export class Server extends Emittery.Typed<ServerEvents> {
  public internalServer: InternalServer;
  public rooms: Room[] = [];

  constructor(
    config?: ServerConfig,
  ) {
    super();

    this.internalServer = new InternalServer(config);

    this.internalServer.on("roomCreated", (room: RoomCreatedEvent) => {
      const newRoom = new Room(room.room);

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
