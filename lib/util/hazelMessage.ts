import { MaxValue, MinValue } from "./constants";
import { clamp } from "./functions";
import { Vector2 } from "../types";

/**
 * Gets the result of `value`, clamped in the range of `0..1`, and linearly
 * interpolated in the range of `min..max`.
 *
 * @param min The minimum value
 * @param max The maximum value
 * @param value The raw value
 * @returns The linearly interpolated `value`
 */
function lerp(min: number, max: number, value: number): number {
  return min + ((max - min) * clamp(value, 0.0, 1.0));
}

/**
 * Gets the result of `value`, normalized in the range of `min..max`, and
 * clamped in the range of `0..1`.
 *
 * @param min The minimum value
 * @param max The maximum value
 * @param value The linearly interpolated value
 * @returns The normalized `value`
 */
function unlerp(min: number, max: number, value: number): number {
  return clamp((value - min) / (max - min), 0.0, 1.0);
}

/**
 * A union type describing the possible sources when creating a new
 * MessageReader or MessageWriter.
 */
export type BuildFrom = number | Buffer | string | number[] | HazelMessage;

/**
 * The base class for MessageReader and MessageWriter
 */
export abstract class HazelMessage {
  protected buffer: Buffer;
  protected cursor = 0;

  /**
   * @param source The data source to read into the underlying buffer (default `0`)
   * @param isHex `true` if `source` is a hexadecimal string, `false` if not (default `true`)
   */
  constructor(source: BuildFrom = 0, isHex: boolean = true) {
    if (source instanceof HazelMessage) {
      this.buffer = Buffer.from(source.buffer);
    } else if (typeof source !== "number") {
      if (typeof source === "string" && isHex) {
        this.buffer = Buffer.from(source, "hex");
      } else {
        this.buffer = Buffer.from(source);
      }
    } else {
      this.buffer = Buffer.alloc(source);
    }
  }

  /**
   * Gets the number of bytes in the underlying buffer.
   */
  abstract getLength(): number;

  /**
   * Gets the underlying buffer.
   */
  getBuffer(): Buffer {
    return this.buffer;
  }
}

/**
 * A class used for writing data to a buffer.
 */
export class MessageWriter extends HazelMessage {
  private readonly messageStarts: number[] = [];

  /**
   * Gets a new MessageWriter by combining the underlying buffers of each given
   * MessageWriter.
   *
   * @param writers The MessageWriters to combine
   * @returns A new MessageWriter containing the data from all `writers`
   */
  static concat(...writers: HazelMessage[]): MessageWriter {
    return new MessageWriter(Buffer.concat(writers.map(writer => writer.getBuffer())));
  }

  getLength(): number {
    return this.buffer.length;
  }

  /**
   * Starts a new nested message with the given tag.
   *
   * @param tag The tag for the message
   */
  startMessage(tag: number = 0): this {
    this.writeUInt16(0).writeByte(tag % 256);

    this.messageStarts.push(this.cursor);

    return this;
  }

  /**
   * Closes the current nested message.
   */
  endMessage(): this {
    const start = this.messageStarts.pop();

    if (start) {
      const length = this.cursor - start;

      if (length > MaxValue.UInt16) {
        throw new Error(`Message length is greater than UInt16 max: ${length} <= ${MaxValue.UInt16}`);
      }

      this.buffer[start - 3] = (length) % 256;
      this.buffer[start - 2] = (length >> 8) % 256;
    } else {
      throw new Error("No open nested messages to end");
    }

    return this;
  }

  /**
   * Writes a boolean.
   *
   * @param value The boolean to write
   */
  writeBoolean(value: boolean): this {
    return this.writeByte(value ? 1 : 0);
  }

  /**
   * Writes a signed byte (sbyte).
   *
   * @param value The sbyte to write
   */
  writeSByte(value: number): this {
    this.resizeBuffer(1);

    if (value > MaxValue.Int8 || value < MinValue.Int8) {
      throw new RangeError(`Value outside of Int8 range: ${MinValue.Int8} <= ${value} <= ${MaxValue.Int8}`);
    }

    this.buffer.writeInt8(value, this.cursor++);

    return this;
  }

  /**
   * Writes an unsigned byte.
   *
   * @param value The byte to write
   */
  writeByte(value: number): this {
    this.resizeBuffer(1);

    if (value > MaxValue.UInt8 || value < MinValue.UInt8) {
      throw new RangeError(`Value outside of UInt8 range: ${MinValue.UInt8} <= ${value} <= ${MaxValue.UInt8}`);
    }

    this.buffer[this.cursor++] = value;

    return this;
  }

  /**
   * Writes a 16-bit integer (short).
   *
   * @param value The int16 to write
   * @param isBigEndian `true` if the int16 should be written in Big Endian byte order, `false` if not (default `false`)
   */
  writeInt16(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(2);

    if (value > MaxValue.Int16 || value < MinValue.Int16) {
      throw new RangeError(`Value outside of Int16 range: ${MinValue.Int16} <= ${value} <= ${MaxValue.Int16}`);
    }

    this.buffer[isBigEndian ? "writeInt16BE" : "writeInt16LE"](value, this.cursor);

    this.cursor += 2;

    return this;
  }

  /**
   * Writes an unsigned 16-bit integer (ushort).
   *
   * @param value The uint16 to write
   * @param isBigEndian `true` if the uint16 should be written in Big Endian byte order, `false` if not (default `false`)
   */
  writeUInt16(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(2);

    if (value > MaxValue.UInt16 || value < MinValue.UInt16) {
      throw new RangeError(`Value outside of UInt16 range: ${MinValue.UInt16} <= ${value} <= ${MaxValue.UInt16}`);
    }

    this.buffer[isBigEndian ? "writeUInt16BE" : "writeUInt16LE"](value, this.cursor);

    this.cursor += 2;

    return this;
  }

  /**
   * Writes a 32-bit integer (int).
   *
   * @param value The int32 to write
   * @param isBigEndian `true` if the int32 should be written in Big Endian byte order, `false` if not (default `false`)
   */
  writeInt32(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(4);

    if (value > MaxValue.Int32 || value < MinValue.Int32) {
      throw new RangeError(`Value outside of Int32 range: ${MinValue.Int32} <= ${value} <= ${MaxValue.Int32}`);
    }

    this.buffer[isBigEndian ? "writeInt32BE" : "writeInt32LE"](value, this.cursor);

    this.cursor += 4;

    return this;
  }

  /**
   * Writes an unsigned 32-bit integer (uint).
   *
   * @param value The uint32 to write
   * @param isBigEndian `true` if the uint32 should be written in Big Endian byte order, `false` if not (default `false`)
   */
  writeUInt32(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(4);

    if (value > MaxValue.UInt32 || value < MinValue.UInt32) {
      throw new RangeError(`Value outside of UInt32 range: ${MinValue.UInt32} <= ${value} <= ${MaxValue.UInt32}`);
    }

    this.buffer[isBigEndian ? "writeUInt32BE" : "writeUInt32LE"](value, this.cursor);

    this.cursor += 4;

    return this;
  }

  /**
   * Writes a single-precision floating-point number (single).
   *
   * @param value The float32 to write
   * @param isBigEndian `true` if the float32 should be written in Big Endian byte order, `false` if not (default `false`)
   */
  writeFloat32(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(4);

    this.buffer[isBigEndian ? "writeFloatBE" : "writeFloatLE"](value, this.cursor);

    this.cursor += 4;

    return this;
  }

  /**
   * Writes a Vector2.
   *
   * This will write one uint16 for the normalized `x` value and one uint16 for
   * the normalized `y` value.
   *
   * @param value The Vector2 to write
   */
  writeVector2(value: Vector2): this {
    return this.writeUInt16(unlerp(-40, 40, value.getX()) * 65535.0)
      .writeUInt16(unlerp(-40, 40, value.getY()) * 65535.0);
  }

  /**
   * Writes a string.
   *
   * This will first write a packed uint32 describing the string's byte length.
   *
   * @param value The string to write
   */
  writeString(value: string): this {
    return this.writeBytesAndSize(value);
  }

  /**
   * Writes a packed 32-bit integer (int).
   *
   * @param value The packet int32 to write
   */
  writePackedInt32(value: number): this {
    if (value > MaxValue.Int32 || value < MinValue.Int32) {
      throw new RangeError(`Value outside of Int32 range: ${MinValue.Int32} <= ${value} <= ${MaxValue.Int32}`);
    }

    return this.writePackedUInt32(value >>> 0);
  }

  /**
   * Writes a packed unsigned 32-bit integer (uint).
   *
   * @param value The packet uint32 to write
   */
  writePackedUInt32(value: number): this {
    if (value > MaxValue.UInt32 || value < MinValue.UInt32) {
      throw new RangeError(`Value outside of UInt32 range: ${MinValue.UInt32} <= ${value} <= ${MaxValue.UInt32}`);
    }

    do {
      let b = value & 0xff;

      if (value >= 0x80) {
        b |= 0x80;
      }

      this.resizeBuffer(1);
      this.buffer.writeUInt8(b, this.cursor++);

      value >>>= 7;
    } while (value != 0);

    return this;
  }

  /**
   * Writes the given data as raw bytes.
   *
   * @param bytes The data to write
   */
  writeBytes(bytes: Buffer | number[] | string | HazelMessage): this {
    if (bytes instanceof HazelMessage) {
      bytes = bytes.getBuffer();
    }

    const buf = bytes instanceof Buffer ? bytes : Buffer.from(bytes);

    this.resizeBuffer(buf.length);
    buf.copy(this.buffer, this.cursor);

    this.cursor += buf.length;

    return this;
  }

  /**
   * Writes the given data as raw bytes, prefixed with the byte length of the
   * data as a packed uint32.
   *
   * @param bytes The data to write
   */
  writeBytesAndSize(bytes: Buffer | number[] | string | HazelMessage): this {
    if (bytes instanceof HazelMessage) {
      bytes = bytes.getBuffer();
    }

    const buf = bytes instanceof Buffer ? bytes : Buffer.from(bytes);

    this.writePackedUInt32(buf.length);
    this.writeBytes(buf);

    return this;
  }

  /**
   * Writes the given items inside the given `writer` function.
   *
   * @typeParam T The type of items that will be written
   * @param items The items to write
   * @param writer The function used to serialize each item
   * @param lengthIsPacked `true` if the length prefixing the list should be a packed uint32, `false` if it should be a byte
   */
  writeList<T>(
    items: Iterable<T>,
    writer: (subWriter: MessageWriter, item: T, index: number) => void,
    lengthIsPacked: boolean = true,
  ): this {
    const arr = [...items];

    if (lengthIsPacked) {
      this.writePackedUInt32(arr.length);
    } else {
      this.writeByte(arr.length);
    }

    for (let i = 0; i < arr.length; i++) {
      writer(this, arr[i], i);
    }

    return this;
  }

  /**
   * Writes the given items inside the given `writer` function, where each item
   * is nested in their own MessageWriter.
   *
   * If each nested MessageWriter should have a unique or variable tag, then use
   * `writeList` instead and create a new message inside the writer function.
   *
   * @typeParam T The type of items that will be written
   * @param items The items to write
   * @param writer The function used to serialize each item
   * @param lengthIsPacked `true` if the length prefixing the list should be a packed uint32, `false` if it should be a byte
   * @param defaultTag The tag to be used for each nested MessageWriter (default `0`)
   */
  writeMessageList<T>(
    items: Iterable<T>,
    writer: (childWriter: MessageWriter, item: T) => void,
    lengthIsPacked: boolean = true,
    defaultTag: number = 0,
  ): this {
    return this.writeList(items, (subWriter, item) => {
      const child = subWriter.startMessage(defaultTag % 256);

      writer(child, item);

      child.endMessage();
    }, lengthIsPacked);
  }

  /**
   * Recreates the buffer with an adjusted size.
   *
   * @param addend The number of octects to add to the end of the buffer
   */
  private resizeBuffer(addend: number): void {
    let newLength = this.cursor + addend;

    if (this.buffer.length < this.cursor + addend) {
      newLength = newLength - this.buffer.length + this.cursor;
    }

    const newBuffer = Buffer.alloc(newLength);

    this.buffer.copy(newBuffer);
    this.buffer = newBuffer;
  }
}

/**
 * A class used for reading data from a buffer.
 */
export class MessageReader extends HazelMessage {
  private tag = 0xff;
  private length = 0;

  /**
   * Gets a new MessageReader with the length and tag read from `source`.
   *
   * @param source The data source to read into the underlying buffer (default `0`)
   * @param isHex `true` if `source` is a hexadecimal string, `false` if not (default `true`)
   */
  static fromMessage(source: BuildFrom = 0, isHex: boolean = true): MessageReader {
    const reader = new MessageReader(source, isHex);

    reader.length = reader.buffer.readUInt16LE();
    reader.tag = reader.buffer.readUInt8(2);
    reader.cursor += 3;

    return reader;
  }

  /**
   * Gets a new MessageReader with the length set to the length of bytes in
   * `source`, and the tag set to `0xff`.
   *
   * @param source The data source to read into the underlying buffer (default `0`)
   * @param isHex `true` if `source` is a hexadecimal string, `false` if not (default `true`)
   */
  static fromRawBytes(source: BuildFrom = 0, isHex: boolean = true): MessageReader {
    const reader = new MessageReader(source, isHex);

    reader.length = reader.buffer.length;
    reader.tag = 0xff;
    reader.cursor = 0;

    return reader;
  }

  getLength(): number {
    return this.length;
  }

  /**
   * Gets the tag for the MessageReader.
   */
  getTag(): number {
    return this.tag;
  }

  /**
   * Gets the number of bytes that have not yet been read.
   */
  getReadableBytesLength(): number {
    return this.buffer.length - this.cursor;
  }

  /**
   * Gets whether or not there are bytes that have not yet been read.
   *
   * @returns `true` if there are bytes that have not yet been read, `false` if not
   */
  hasBytesLeft(): boolean {
    return this.getReadableBytesLength() > 0;
  }

  /**
   * Reads a nested message.
   *
   * @returns A nested MessageReader, or `undefined` if there is no nested MessageReader at the cursor's current position
   */
  readMessage(): MessageReader | undefined {
    if (this.getReadableBytesLength() - 3 < 0) {
      return;
    }

    const len = this.buffer.readUInt16LE(this.cursor);

    return MessageReader.fromMessage(this.readBytes(len + 3));
  }

  /**
   * Reads a boolean.
   */
  readBoolean(): boolean {
    return !!this.readByte();
  }

  /**
   * Reads a signed byte (sbyte).
   */
  readSByte(): number {
    return this.buffer.readInt8(this.cursor++);
  }

  /**
   * Reads an unsigned byte.
   */
  readByte(): number {
    return this.buffer.readUInt8(this.cursor++);
  }

  /**
   * Reads a 16-bit integer (short).
   *
   * @param isBigEndian `true` if the int16 should be read in Big Endian byte order, `false` if not (default `false`)
   */
  readInt16(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readInt16BE" : "readInt16LE"](this.cursor);

    this.cursor += 2;

    return val;
  }

  /**
   * Reads an unsigned 16-bit integer (ushort).
   *
   * @param isBigEndian `true` if the uint16 should be read in Big Endian byte order, `false` if not (default `false`)
   */
  readUInt16(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readUInt16BE" : "readUInt16LE"](this.cursor);

    this.cursor += 2;

    return val;
  }

  /**
   * Reads a 32-bit integer (int).
   *
   * @param isBigEndian `true` if the int32 should be read in Big Endian byte order, `false` if not (default `false`)
   */
  readInt32(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readInt32BE" : "readInt32LE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  /**
   * Reads an unsigned 32-bit integer (uint).
   *
   * @param isBigEndian `true` if the uint32 should be read in Big Endian byte order, `false` if not (default `false`)
   */
  readUInt32(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readUInt32BE" : "readUInt32LE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  /**
   * Reads a single-precision floating-point number (single).
   *
   * @param isBigEndian `true` if the float32 should be read in Big Endian byte order, `false` if not (default `false`)
   */
  readFloat32(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readFloatBE" : "readFloatLE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  /**
   * Reads a Vector2.
   *
   * This will read one uint16 for the lerped `x` value and one uint16 for the
   * lerped `y` value.
   */
  readVector2(): Vector2 {
    return new Vector2(
      lerp(-40, 40, this.readUInt16() / 65535.0),
      lerp(-40, 40, this.readUInt16() / 65535.0),
    );
  }

  /**
   * Reads a string.
   *
   * This will first read a packed uint32 describing the string's byte length.
   */
  readString(): string {
    return this.readBytesAndSize().buffer.toString("utf8");
  }

  /**
   * Reads a packed 32-bit integer (int).
   */
  readPackedInt32(): number {
    let readMore = true;
    let shift = 0;
    let output = 0;

    while (readMore) {
      if (!this.hasBytesLeft()) {
        throw new Error(`No bytes left to read`);
      }

      let next = this.readByte();

      if (next >= 0x80) {
        readMore = true;
        next ^= 0x80;
      } else {
        readMore = false;
      }

      output |= next << shift;
      shift += 7;
    }

    return output;
  }

  /**
   * Reads an packed unsigned 32-bit integer (uint).
   */
  readPackedUInt32(): number {
    return this.readPackedInt32() >>> 0;
  }

  /**
   * Gets a new MessageReader with the given number of read bytes.
   *
   * @param length The number of bytes to read
   */
  readBytes(length: number): MessageReader {
    const available = this.getReadableBytesLength();

    if (length > available) {
      throw new Error(`Not enough bytes to read: ${length} > ${available}`);
    }

    const reader = MessageReader.fromRawBytes(this.buffer.slice(this.cursor, this.cursor + length));

    this.cursor += length;

    return reader;
  }

  /**
   * Gets a new MessageReader with a variable number of bytes.
   *
   * This will first read a packed uint32 describing how many bytes to read.
   */
  readBytesAndSize(): MessageReader {
    const length = this.readPackedUInt32();

    return this.readBytes(length);
  }

  /**
   * Gets a new MessageReader with all bytes that have not yet been read.
   */
  readRemainingBytes(): MessageReader {
    return this.readBytes(this.getReadableBytesLength());
  }

  /**
   * Gets an array of items read from the MessageReader in the given `reader`
   * function.
   *
   * @typeParam T The type of items that will be returned
   * @param reader The function used to deserialize each item
   * @param lengthIsPacked `true` if the length prefixing the list is a packed uint32, `false` if it is a byte
   */
  readList<T>(reader: (subReader: MessageReader) => T, lengthIsPacked: boolean = true): T[] {
    const length = lengthIsPacked ? this.readPackedUInt32() : this.readByte();
    const results: T[] = [];

    for (let i = 0; i < length; i++) {
      results.push(reader(this));
    }

    return results;
  }

  /**
   * Gets an array of items read from the MessageReader in the given `reader`
   * function, where each item is inside a nested MessageReader.
   *
   * @typeParam T The type of items that will be returned
   * @param reader The function used to deserialize each item
   * @param lengthIsPacked `true` if the length prefixing the list is a packed uint32, `false` if it is a byte
   */
  readMessageList<T>(reader: (subReader: MessageReader) => T, lengthIsPacked: boolean = true): T[] {
    return this.readList((sub: MessageReader) => {
      const child = sub.readMessage();

      if (!child) {
        throw new Error(
          `Read length is longer than message length: ${sub.cursor + 3} > ${sub.length}`,
        );
      }

      return reader(child);
    }, lengthIsPacked);
  }

  /**
   * Gets an array of all remaining nested MessageReaders that have not yet been read.
   */
  getAllChildMessages(): MessageReader[] {
    const messages: MessageReader[] = [];
    let current: MessageReader | undefined;

    while ((current = this.readMessage())) {
      messages.push(current);
    }

    return messages;
  }

  /**
   * Gets an array of items read from the MessageReader in the given `reader`
   * function, where each item is inside a nested MessageReader.
   *
   * @typeParam T The type of items that will be returned
   * @param reader The function used to deserialize each item
   */
  readAllChildMessages<T>(reader: (child: MessageReader, index: number) => T): T[] {
    const children = this.getAllChildMessages();
    const items: T[] = new Array(children.length);

    for (let i = 0; i < children.length; i++) {
      items[i] = reader(children[i], i);
    }

    return items;
  }
}
