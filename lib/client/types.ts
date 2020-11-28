import { DisconnectReason } from "../types/disconnectReason";
import { Room } from "../room";

export interface ClientInstance {
  id: number;

  constructor(room: Room): this;

  sendKick(banned: boolean, reason: DisconnectReason): void;
  sendLateRejection(disconnectReason: DisconnectReason): void;
  sendWaitingForHost(): void;
}
