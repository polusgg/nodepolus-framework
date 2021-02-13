import { MessageWriter } from "../util/hazelMessage";
import { Connection } from "../protocol/connection";

/**
 * A type defining the format of a transformer function that will be applied to
 * all outgoing packets. This is mostly useful for packet authentication.
 *
 * @param connnection - The connection that is receiving the packet
 * @param reader - The MessageWriter containing the original packet
 * @returns A MessageWriter containing the transformed packet that gets sent to the connection
 */
export type OutboundPacketTransformer = (connection: Connection, writer: MessageWriter) => MessageWriter;
