import { Connection } from "@nodepolus/framework/src/protocol/connection";
import { ClickPacket } from "../packets/rpc/clickBehaviour";

export type ClickBehaviourEvents = {
  "clicked": {
    connection: Connection;
    packet: ClickPacket;
  };
};
