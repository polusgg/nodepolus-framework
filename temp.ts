/* eslint-disable */
enum PlayerColor {
  Red = 0,
}

class CancellableEvent {}

const server: any = undefined;
/* eslint-enable */

// api/
interface Room {
  sendChat(name: string, color: PlayerColor, message: string | Text): void;
}

// lib/
class InternalRoom implements Room {
  sendChat(_name: string, _color: PlayerColor, _message: string | Text): void {
    // ...
  }

  someOtherMethod(): void {
    console.log("not on interface");
  }
}

// api/
class RoomCreatedEvent extends CancellableEvent {
  constructor(public readonly room: Room) {
    super();
  }
}

// bin/polus.ts
server.on("roomCreated", (event: RoomCreatedEvent) => {
  event.room.sendChat("Server", PlayerColor.Red, "Hello from the API");

  event.room.someOtherMethod();

  (event.room as InternalRoom).someOtherMethod();
});
