import { DisconnectReason } from "../../types";

export interface ClientInstance {
  connect(): Promise<void>;

  disconnect(): void;

  getId(): number;

  sendKick(banned: boolean, reason: DisconnectReason): void;

  sendLateRejection(disconnectReason: DisconnectReason): void;

  sendWaitingForHost(): void;
}

