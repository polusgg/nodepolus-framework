import { MessageWriter } from "../util/hazelMessage";

/**
 * An interface used to mark any implementing class as having the ability to be
 * written to a Hazel MessageWriter.
 */
export interface CanSerializeToHazel {
  /**
   * Serializes the object to the given MessageWriter.
   *
   * @param writer - The MessageWriter to which the object will be written
   */
  serialize(writer: MessageWriter): void;
}
