import { MessageReader } from "../util/hazelMessage";
import { Connection } from "../protocol/connection";

/**
 * A type defining the format of a transformer function that will be applied to
 * all incoming packets. This is mostly useful for packet authentication.
 *
 * @param connnection - The connection that sent the packet
 * @param reader - The MessageReader containing the original packet
 * @returns A MessageReader containing the transformed packet that gets passed in to the server for deserialization
 */
export type InboundPacketTransformer = (connection: Connection, reader: MessageReader) => MessageReader;
