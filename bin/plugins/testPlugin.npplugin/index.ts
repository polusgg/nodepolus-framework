import { Player } from "../../../lib/api/player";
import { Server } from "../../../lib/api/server";
import { Room } from "../../../lib/api/room";

declare const server: Server;

server.on("room", (room: Room) => {
  room.on("player", (player: Player) => {
    player.on("murdered", (_murderer: Player) => {
      
    });
  });
});
