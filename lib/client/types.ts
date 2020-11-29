import { DisconnectReason } from "../types/disconnectReason";

export interface ClientInstance {
  id: number;

  sendKick(banned: boolean, reason: DisconnectReason): void;
  sendLateRejection(disconnectReason: DisconnectReason): void;
  sendWaitingForHost(): void;
}
