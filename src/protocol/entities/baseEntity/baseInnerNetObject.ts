import { InnerNetObjectType, RpcPacketType } from "../../../types/enums";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { LobbyInstance } from "../../../api/lobby";
import { BaseRpcPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { BaseInnerNetEntity } from ".";
import { Metadatable } from "../../../types";

export abstract class BaseInnerNetObject implements Metadatable {
  protected readonly metadata: Map<string, unknown> = new Map();

  constructor(
    protected readonly type: InnerNetObjectType,
    protected readonly parent: BaseInnerNetEntity,
    protected readonly netId: number,
  ) {}

  abstract handleRpc(connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, sendTo: Connection[]): void;

  abstract getParent(): BaseInnerNetEntity;

  abstract serializeData(old: BaseInnerNetObject): DataPacket;

  abstract serializeSpawn(): SpawnPacketObject;

  abstract clone(): BaseInnerNetObject;

  getType(): InnerNetObjectType {
    return this.type;
  }

  getNetId(): number {
    return this.netId;
  }

  async sendRpcPacket(packet: BaseRpcPacket, sendTo?: Connection[]): Promise<void> {
    await this.parent.getLobby().sendRpcPacket(this, packet, sendTo);
  }

  getLobby(): LobbyInstance {
    return this.parent.getLobby();
  }

  getOwnerId(): number {
    return this.parent.getOwnerId();
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
