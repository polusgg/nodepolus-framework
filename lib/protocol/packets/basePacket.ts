import { PacketType, RootGamePacketType, GameDataPacketType, RPCPacketType } from "./types";
import { MessageWriter } from "../../util/hazelMessage";

export interface Bindable<T> {
  bound(clientBound: boolean): T;
}

export abstract class BasePacket implements Bindable<BasePacket> {
  clientBound?: boolean;

  constructor(public type: PacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}

export abstract class BaseRootGamePacket implements Bindable<BaseRootGamePacket> {
  clientBound?: boolean;

  constructor(public type: RootGamePacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}

export abstract class BaseGameDataPacket implements Bindable<BaseGameDataPacket> {
  clientBound?: boolean;

  constructor(public type: GameDataPacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}

export abstract class BaseRPCPacket implements Bindable<BaseRPCPacket> {
  clientBound?: boolean;

  constructor(public type: RPCPacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}
