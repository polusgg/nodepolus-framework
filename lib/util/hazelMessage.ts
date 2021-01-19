import { MaxValue, MinValue } from "./constants";
import { clamp } from "./functions";
import { Vector2 } from "../types";

function lerp(min: number, max: number, value: number): number {
  return min + ((max - min) * clamp(value, 0.0, 1.0));
}

function unlerp(min: number, max: number, value: number): number {
  return clamp((value - min) / (max - min), 0.0, 1.0);
}

/**
 * Core buffer type for reading and writing messages
 */
export type BuildFrom = number | Buffer | string | number[] | HazelMessage;

export abstract class HazelMessage {
  protected buffer: Buffer;

  constructor(buildFrom: BuildFrom = 0, isHex: boolean = true) {
    if (buildFrom instanceof HazelMessage) {
      this.buffer = Buffer.from(buildFrom.buffer);
    } else if (typeof buildFrom != "number") {
      if (typeof buildFrom === "string" && isHex) {
        this.buffer = Buffer.from(buildFrom, "hex");
      } else {
        this.buffer = Buffer.from(buildFrom);
      }
    } else {
      this.buffer = Buffer.alloc(buildFrom);
    }
  }

  getBuffer(): Buffer {
    return this.buffer;
  }
}

export class MessageWriter extends HazelMessage {
  private readonly messageStarts: number[] = [];

  private cursor = 0;

  static concat(...writers: MessageWriter[]): MessageWriter {
    return new MessageWriter(Buffer.concat(writers.map(writer => writer.buffer)));
  }

  getLength(): number {
    return this.buffer.length;
  }

  startMessage(flag: number): this {
    this.writeUInt16(0).writeByte(flag % 256);

    this.messageStarts.push(this.cursor);

    return this;
  }

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

  writeBoolean(value: boolean): this {
    return this.writeByte(value ? 1 : 0);
  }

  writeSByte(value: number): this {
    this.resizeBuffer(1);

    if (value > MaxValue.Int8 || value < MinValue.Int8) {
      throw new RangeError(`Value outside of Int8 range: ${MinValue.Int8} <= ${value} <= ${MaxValue.Int8}`);
    }

    this.buffer.writeInt8(value, this.cursor++);

    return this;
  }

  writeByte(value: number): this {
    this.resizeBuffer(1);

    if (value > MaxValue.UInt8 || value < MinValue.UInt8) {
      throw new RangeError(`Value outside of UInt8 range: ${MinValue.UInt8} <= ${value} <= ${MaxValue.UInt8}`);
    }

    this.buffer[this.cursor++] = value;

    return this;
  }

  writeInt16(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(2);

    if (value > MaxValue.Int16 || value < MinValue.Int16) {
      throw new RangeError(`Value outside of Int16 range: ${MinValue.Int16} <= ${value} <= ${MaxValue.Int16}`);
    }

    this.buffer[isBigEndian ? "writeInt16BE" : "writeInt16LE"](value, this.cursor);

    this.cursor += 2;

    return this;
  }

  writeUInt16(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(2);

    if (value > MaxValue.UInt16 || value < MinValue.UInt16) {
      throw new RangeError(`Value outside of UInt16 range: ${MinValue.UInt16} <= ${value} <= ${MaxValue.UInt16}`);
    }

    this.buffer[isBigEndian ? "writeUInt16BE" : "writeUInt16LE"](value, this.cursor);

    this.cursor += 2;

    return this;
  }

  writeInt32(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(4);

    if (value > MaxValue.Int32 || value < MinValue.Int32) {
      throw new RangeError(`Value outside of Int32 range: ${MinValue.Int32} <= ${value} <= ${MaxValue.Int32}`);
    }

    this.buffer[isBigEndian ? "writeInt32BE" : "writeInt32LE"](value, this.cursor);

    this.cursor += 4;

    return this;
  }

  writeUInt32(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(4);

    if (value > MaxValue.UInt32 || value < MinValue.UInt32) {
      throw new RangeError(`Value outside of UInt32 range: ${MinValue.UInt32} <= ${value} <= ${MaxValue.UInt32}`);
    }

    this.buffer[isBigEndian ? "writeUInt32BE" : "writeUInt32LE"](value, this.cursor);

    this.cursor += 4;

    return this;
  }

  writeFloat32(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(4);

    this.buffer[isBigEndian ? "writeFloatBE" : "writeFloatLE"](value, this.cursor);

    this.cursor += 4;

    return this;
  }

  writeVector2(value: Vector2): this {
    return this.writeUInt16(unlerp(-40, 40, value.x) * 65535.0)
      .writeUInt16(unlerp(-40, 40, value.y) * 65535.0);
  }

  writeString(value: string): this {
    const bytes = Buffer.from(value);

    return this.writePackedUInt32(bytes.length).writeBytes(bytes);
  }

  writePackedInt32(value: number): this {
    if (value > MaxValue.Int32 || value < MinValue.Int32) {
      throw new RangeError(`Value outside of Int32 range: ${MinValue.Int32} <= ${value} <= ${MaxValue.Int32}`);
    }

    return this.writePackedUInt32(value >>> 0);
  }

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

  writeBytes(bytes: Buffer | number[] | string | HazelMessage): this {
    if (bytes instanceof HazelMessage) {
      bytes = bytes.getBuffer();
    }

    this.resizeBuffer(bytes.length);

    const buf = Buffer.from(bytes);

    buf.copy(this.buffer, this.cursor);

    this.cursor += buf.length;

    return this;
  }

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
   * @summary Each message will have a default tag of `0`, customizable via the
   * `defaultTag` property. For a custom tag you may use `writeList` and
   * create messages inside the callback.
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

  private resizeBuffer(addsize: number): void {
    let newlen = this.cursor + addsize;

    if (this.buffer.length < this.cursor + addsize) {
      newlen = newlen - this.buffer.length + this.cursor;
    }

    const newb = Buffer.alloc(newlen);

    this.buffer.copy(newb);
    this.buffer = newb;
  }
}

export class MessageReader extends HazelMessage {
  private cursor = 0;
  private tag = 0xff;
  private length = 0;

  constructor(source: BuildFrom = 0, isHex: boolean = true) {
    super(source, isHex);
  }

  static fromMessage(source: BuildFrom = 0, isHex: boolean = true): MessageReader {
    const reader = new MessageReader(source, isHex);

    reader.length = reader.buffer.readUInt16LE();
    reader.tag = reader.buffer.readUInt8(2);
    reader.cursor += 3;

    return reader;
  }

  static fromRawBytes(source: BuildFrom = 0, isHex: boolean = true): MessageReader {
    const reader = new MessageReader(source, isHex);

    reader.cursor = 0;
    reader.length = reader.buffer.length;
    reader.tag = 0xff;

    return reader;
  }

  getLength(): number {
    return this.length;
  }

  getTag(): number {
    return this.tag;
  }

  readMessage(): MessageReader | undefined {
    if (this.getReadableBytesLength() - 3 <= 0) {
      return;
    }

    const len = this.buffer.readUInt16LE(this.cursor);

    return MessageReader.fromMessage(this.readBytes(len + 3));
  }

  readBoolean(): boolean {
    return !!this.readByte();
  }

  readSByte(): number {
    return this.buffer.readInt8(this.cursor++);
  }

  readByte(): number {
    return this.buffer.readUInt8(this.cursor++);
  }

  readInt16(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readInt16BE" : "readInt16LE"](this.cursor);

    this.cursor += 2;

    return val;
  }

  readUInt16(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readUInt16BE" : "readUInt16LE"](this.cursor);

    this.cursor += 2;

    return val;
  }

  readInt32(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readInt32BE" : "readInt32LE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  readUInt32(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readUInt32BE" : "readUInt32LE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  readFloat32(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readFloatBE" : "readFloatLE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  readVector2(): Vector2 {
    return new Vector2(
      lerp(-40, 40, this.readUInt16() / 65535.0),
      lerp(-40, 40, this.readUInt16() / 65535.0),
    );
  }

  readString(): string {
    return this.readBytes(this.readPackedUInt32()).buffer.toString("utf8");
  }

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

  readPackedUInt32(): number {
    return this.readPackedInt32() >>> 0;
  }

  readBytes(length: number): MessageReader {
    const available = this.getReadableBytesLength();

    if (length > available) {
      throw new Error(`Not enough bytes to read: ${length} > ${available}`);
    }

    const reader = MessageReader.fromRawBytes(this.buffer.slice(this.cursor, this.cursor + length));

    this.cursor += length;

    return reader;
  }

  readBytesAndSize(): MessageReader {
    const length = this.readPackedUInt32();

    return this.readBytes(length);
  }

  readList<T>(reader: (subReader: MessageReader) => T, lengthIsPacked: boolean = true): T[] {
    const length = lengthIsPacked ? this.readPackedUInt32() : this.readByte();
    const results: T[] = [];

    for (let i = 0; i < length; i++) {
      results.push(reader(this));
    }

    return results;
  }

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

  readAllChildMessages<T>(reader: (child: MessageReader, index: number) => T): T[] {
    const children = this.getAllChildMessages();
    const items: T[] = new Array(children.length);

    for (let i = 0; i < children.length; i++) {
      items[i] = reader(children[i], i);
    }

    return items;
  }

  readRemainingBytes(): MessageReader {
    return this.readBytes(this.getReadableBytesLength());
  }

  getAllChildMessages(): MessageReader[] {
    const messages: MessageReader[] = [];
    let current: MessageReader | undefined;

    while ((current = this.readMessage())) {
      messages.push(current);
    }

    return messages;
  }

  hasBytesLeft(): boolean {
    return this.getReadableBytesLength() > 0;
  }

  getReadableBytesLength(): number {
    return this.buffer.length - this.cursor;
  }
}
