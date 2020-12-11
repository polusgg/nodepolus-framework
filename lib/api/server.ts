import Emittery from "emittery";
import { Server as InternalServer, ServerConfig } from "../server";
import { Room as InternalRoom } from "../room";
import { Room } from "./room";

export type ServerEvents = {
  room: Room;
};

export class Server extends Emittery.Typed<ServerEvents> {
  public internalServer: InternalServer;
  public rooms: Room[] = [];

  constructor(config?: ServerConfig) {
    super();

    this.internalServer = new InternalServer(config);

    this.internalServer.on("roomCreated", (internalRoom: InternalRoom) => {
      const newRoom = new Room(internalRoom);

      this.rooms.push();
      this.emit("room", newRoom);
    });
  }

  async listen(port: number): Promise<void> {
    return new Promise(resolve => {
      this.internalServer.listen(port, resolve);
    });
  }
}
