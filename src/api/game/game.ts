import { Metadatable } from "../../types";
import { Level } from "../../types/enums";
import { LobbyInstance } from "../lobby";

export class Game implements Metadatable {
  protected readonly metadata: Map<string, unknown> = new Map();

  constructor(
    protected readonly lobby: LobbyInstance,
  ) {
    switch (lobby.getLevel()) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        break;
      case Level.MiraHq:
        break;
      case Level.Polus:
        break;
      case Level.Airship:
        break;
      case Level.Submerged:
        break;
    }
  }

  getLobby(): LobbyInstance {
    return this.lobby;
  }

  hasMeta(key: string): boolean {
    return this.metadata.has(key);
  }

  getMeta(): Map<string, unknown>;
  getMeta<T = unknown>(key: string): T;
  getMeta<T = unknown>(key?: string): Map<string, unknown> | T {
    return key === undefined ? this.metadata : this.metadata.get(key) as T;
  }

  setMeta(pair: Record<string, unknown>): void;
  setMeta(key: string, value: unknown): void;
  setMeta(key: string | Record<string, unknown>, value?: unknown): void {
    if (typeof key === "string") {
      this.metadata.set(key, value);
    } else {
      for (const [k, v] of Object.entries(key)) {
        this.metadata.set(k, v);
      }
    }
  }

  deleteMeta(key: string): void {
    this.metadata.delete(key);
  }

  clearMeta(): void {
    this.metadata.clear();
  }
}
