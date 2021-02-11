import { MessageWriter } from "../util/hazelMessage";
import { Connection } from "../protocol/connection";

export type OutboundPacketTransformer = (connection: Connection, writer: MessageWriter) => MessageWriter;
