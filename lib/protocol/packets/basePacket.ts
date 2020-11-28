import { PacketType, RootGamePacketType, GameDataPacketType } from "./types";
import { MessageWriter } from "../../util/hazelMessage";

export abstract class BasePacket {
  type: PacketType;
  clientBound?: boolean;

  constructor(type: PacketType) {
    this.type = type;
  }

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}

export abstract class BaseRootGamePacket {
  type: RootGamePacketType;
  clientBound?: boolean;

  constructor(type: RootGamePacketType) {
    this.type = type;
  }

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}

export abstract class BaseGameDataPacket {
  type: GameDataPacketType;
  clientBound?: boolean;

  constructor(type: GameDataPacketType) {
    this.type = type;
  }

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}
