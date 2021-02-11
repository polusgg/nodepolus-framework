import { MessageReader } from "../util/hazelMessage";
import { Connection } from "../protocol/connection";

export type InboundPacketTransformer = (connection: Connection, writer: MessageReader) => MessageReader;
