import { GameDataPacketType, PacketType, RPCPacketType, RootGamePacketType } from "./types";
import { MessageWriter } from "../../util/hazelMessage";

export interface Bindable<T> {
  bound(clientBound: boolean): T;
}

export abstract class BasePacket implements Bindable<BasePacket> {
  public clientBound?: boolean;

  constructor(public type: PacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}

export abstract class BaseRootGamePacket implements Bindable<BaseRootGamePacket> {
  public clientBound?: boolean;

  constructor(public type: RootGamePacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}

export abstract class BaseGameDataPacket implements Bindable<BaseGameDataPacket> {
  public clientBound?: boolean;

  constructor(public type: GameDataPacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}

export abstract class BaseRPCPacket implements Bindable<BaseRPCPacket> {
  public clientBound?: boolean;

  constructor(public type: RPCPacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}
