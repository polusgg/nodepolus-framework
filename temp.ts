// /* eslint-disable */
// enum PlayerColor {
//   Red = 0,
// }

// class CancellableEvent {}

// const server: any = undefined;
// /* eslint-enable */

// // api/
// interface Lobby {
//   sendChat(name: string, color: PlayerColor, message: string | Text): void;
// }

// // lib/
// class InternalLobby implements Lobby {
//   sendChat(_name: string, _color: PlayerColor, _message: string | Text): void {
//     // ...
//   }

//   someOtherMethod(): void {
//     console.log("not on interface");
//   }
// }

// // api/
// class LobbyCreatedEvent extends CancellableEvent {
//   constructor(public readonly lobby: Lobby) {
//     super();
//   }
// }

// // bin/polus.ts
// server.on("lobbyCreated", (event: LobbyCreatedEvent) => {
//   event.lobby.sendChat("Server", PlayerColor.Red, "Hello from the API");

//   event.lobby.someOtherMethod();

//   (event.lobby as InternalLobby).someOtherMethod();
// });
