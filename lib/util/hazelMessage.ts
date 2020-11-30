/**
 * Core buffer type for reading and writing messages
 */
type BuildFrom = number | Buffer | string | number[] | HazelMessage;

export abstract class HazelMessage {
  public buffer!: Buffer;

  constructor(buildFrom: BuildFrom = 0, isHex: boolean = true) {
    if (buildFrom instanceof HazelMessage) {
      this.buffer = buildFrom.buffer;
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
}

export class MessageWriter extends HazelMessage {
  public cursor = 0;

  private readonly messageStarts: number[] = [];

  static concat(...writers: MessageWriter[]): MessageWriter {
    return new MessageWriter(Buffer.concat(writers.map(writer => writer.buffer)));
  }

  startMessage(flag: number): this {
    this.writeUInt16(0).writeByte(flag);

    this.messageStarts.push(this.cursor);

    return this;
  }

  endMessage(): this {
    const start = this.messageStarts.pop();

    if (start) {
      if (this.cursor - start > 65535) {
        throw new Error("Message length longer than 65.535KiB! Will not fit into U16.");
      }

      this.buffer[start - 3] = (this.cursor - start) % 256;
      this.buffer[start - 2] = (this.cursor - start >> 8) % 256;
    } else {
      throw new Error("endMessage called when there are no active messages");
    }

    return this;
  }

  writeBoolean(value: boolean): this {
    return this.writeByte(Number(value));
  }

  writeSByte(value: number): this {
    this.resizeBuffer(1);

    if (value > 127 || value < -128) {
      throw new RangeError(`Value ${value} outside of UInt8 range [-128 - 127]`);
    }

    this.buffer.writeInt8(value, this.cursor++);

    return this;
  }

  writeByte(value: number): this {
    this.resizeBuffer(1);

    if (value > 255 || value < 0) {
      throw new RangeError(`Value ${value} outside of UInt8 range [0 - 255]`);
    }

    this.buffer[this.cursor++] = value;

    return this;
  }

  writeInt16(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(2);

    if (value > 32767 || value < -32768) {
      throw new RangeError(`Value ${value} outside of UInt16 range [-32768 - 32767]`);
    }

    this.buffer[isBigEndian ? "writeInt16BE" : "writeInt16LE"](value, this.cursor);

    this.cursor += 2;

    return this;
  }

  writeUInt16(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(2);

    if (value > 65535 || value < 0) {
      throw new RangeError(`Value ${value} outside of UInt16 range [0 - 65535]`);
    }

    this.buffer[isBigEndian ? "writeUInt16BE" : "writeUInt16LE"](value, this.cursor);

    this.cursor += 2;

    return this;
  }

  writeInt32(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(4);

    if (value > 2147483647 || value < -2147483648) {
      throw new RangeError(`Value ${value} outside of UInt8 range [-2147483648 - 2147483647]`);
    }

    this.buffer[isBigEndian ? "writeInt32BE" : "writeInt32LE"](value, this.cursor);

    this.cursor += 4;

    return this;
  }

  writeUInt32(value: number, isBigEndian: boolean = false): this {
    this.resizeBuffer(4);

    if (value > 4294967295 || value < 0) {
      throw new RangeError(`Value ${value} outside of UInt8 range [0 - 4294967295]`);
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

  writeString(value: string): this {
    const bytes = Buffer.from(value);

    return this.writePackedUInt32(bytes.length).writeBytes(bytes);
  }

  writePackedInt32(value: number): this {
    return this.writePackedUInt32(value >>> 0);
  }

  writePackedUInt32(value: number): this {
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
      bytes = bytes.buffer;
    }

    this.resizeBuffer(bytes.length);

    const buf = Buffer.from(bytes);

    buf.copy(this.buffer, this.cursor);

    this.cursor += buf.length;

    return this;
  }

  writeBitfield(arr: boolean[]): this {
    for (let chunkidx = 0; chunkidx < arr.length; chunkidx += 8) {
      const tmparr = arr.slice(chunkidx, chunkidx + 8);
      let n = 0;

      for (let i = 0; i < tmparr.length; i++) {
        if (tmparr[tmparr.length - (i + 1)]) {
          n |= 1 << i;
        }
      }

      this.writeByte(n);
    }

    return this;
  }

  writeList<T>(
    items: Iterable<T>,
    writer: (subWriter: MessageWriter, item: T, idx: number) => void,
    lengthIsPacked: boolean = true,
  ): this {
    const arr = Array.from(items);

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

  hasBytesLeft(): boolean {
    return this.bytesRemainingLength() > 0;
  }

  bytesRemainingLength(): number {
    return this.buffer.length - this.cursor;
  }

  get length(): number {
    return this.buffer.length;
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
  public cursor = 0;
  public tag = 0xff;
  public length = 0;

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

    reader.length = reader.buffer.length;
    reader.tag = 0xff;

    return reader;
  }

  readMessage(): MessageReader | undefined {
    if (this.getReadableBytesLength() - 3 <= 0) {
      return;
    }

    const len = this.buffer.readUInt16LE(this.cursor);

    return MessageReader.fromMessage(this.readBytes(len + 3));
  }

  readBoolean(): boolean {
    return Boolean(this.readByte());
  }

  readSByte(): number {
    return this.buffer.readInt8(this.cursor++);
  }

  readByte(): number {
    return this.buffer.readUInt8(this.cursor++);
  }

  readInt16(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readInt16LE" : "readInt16LE"](this.cursor);

    this.cursor += 2;

    return val;
  }

  readUInt16(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readUInt16LE" : "readUInt16LE"](this.cursor);

    this.cursor += 2;

    return val;
  }

  readInt32(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readInt32LE" : "readInt32LE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  readUInt32(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readUInt32LE" : "readUInt32LE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  readFloat32(isBigEndian: boolean = false): number {
    const val = this.buffer[isBigEndian ? "readFloatBE" : "readFloatLE"](this.cursor);

    this.cursor += 4;

    return val;
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
        throw new Error("Read length is longer than message length");
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
    const reader = MessageReader.fromRawBytes(this.buffer.slice(this.cursor, this.cursor + length));

    this.cursor += length;

    return reader;
  }

  readBitfield(size: number = 8): boolean[] {
    return [ ...this.readBytes(Math.ceil(size / 8)).buffer ]
      .map(v => v
        .toString(2)
        .padStart(8, "0"),
      )
      .join("")
      .split("")
      .map(c => c === "1")
      .slice(0, size);
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
          `Could not read message from list: read length of ${sub.cursor + 3} is greater than buffer length of ${
            sub.length
          }`,
        );
      }

      return reader(child);
    }, lengthIsPacked);
  }

  readAllChildMessages(reader: (child: MessageReader, idx: number) => void): void {
    this.getAllChildMessages().forEach((child, idx) => reader(child, idx));
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
