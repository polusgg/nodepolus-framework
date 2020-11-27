/**
 * Core buffer type for reading and writing messages
 */
type BuildFrom = number | Buffer | string | number[] | MessageReader;

export class MessageWriter {
  cursor: number = 0;
  buffer: Buffer;

  private messageStarts: number[] = [];
  
  constructor(buildFrom: BuildFrom = 0, isHex?: boolean) {
    if (typeof buildFrom != "number") {
      if (typeof buildFrom === "string" && isHex) {
        this.buffer = Buffer.from(buildFrom, "hex");
      } else {
        this.buffer = Buffer.from(buildFrom);
      }
    } else {
      this.buffer = Buffer.alloc(buildFrom);
    }
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
  
  writeBoolean(value: boolean) {
    this.writeByte(Number(value));
  }

  writeByte(value: number) {
    this.resizeBuffer(1);

    if (value > 255 || value < 0) {
      return new RangeError(
        "Value " + value + " outside of UInt8 Range [0 - 255]"
      );
    }

    this.buffer[this.cursor++] = value;
  }

  writeUInt16(value: number, isBigEndian: boolean = false) {
    this.resizeBuffer(2);

    if (value > 65535 || value < 0) {
      return new RangeError(
        "Value " + value + " outside of UInt16 Range [0 - 65535]"
      );
    }

    this.buffer[isBigEndian ? 'writeUInt16BE' : 'writeUInt16LE'](value, this.cursor);

    this.cursor += 2;
  }

  writeUInt32(value: number, isBigEndian: boolean = false) {
    this.resizeBuffer(4);

    if (value > 4294967295 || value < 0) {
      return new RangeError(
        "Value " + value + " outside of UInt8 Range [0 - 4294967295]"
      );
    }

    this.buffer[isBigEndian ? 'writeUInt32BE' : 'writeUInt32LE'](value, this.cursor);

    this.cursor += 4;
  }

  writeSByte(value: number) {
    this.resizeBuffer(1);
    if (value > 127 || value < -128) {
      return new RangeError(
        "Value " + value + " outside of UInt8 Range [-128 - 127]"
      );
    }
    this.buffer.writeInt8(value, this.cursor++);
  }

  writeInt16(value: number, isBigEndian: boolean = false) {
    this.resizeBuffer(2);

    if (value > 32767 || value < -32768) {
      return new RangeError(
        "Value " + value + " outside of UInt16 Range [-32768 - 32767]"
      );
    }

    this.buffer[isBigEndian ? 'writeInt16BE' : 'writeInt16LE'](value, this.cursor);

    this.cursor += 2;
  }

  writeInt32(value: number, isBigEndian: boolean = false) {
    this.resizeBuffer(4);

    if (value > 2147483647 || value < -2147483648) {
      return new RangeError(
        "Value " + value + " outside of UInt8 Range [-2147483648 - 2147483647]"
      );
    }

    this.buffer[isBigEndian ? 'writeInt32BE' : 'writeInt32LE'](value, this.cursor);

    this.cursor += 4;
  }

  writeFloat32(value: number, isBigEndian = false) {
    this.resizeBuffer(4);

    this.buffer[isBigEndian ? 'writeFloatBE' : 'writeFloatLE'](value, this.cursor);

    this.cursor += 4;
  }

  writePackedInt32(value: number) {
    this.writePackedUInt32(value >>> 0);
  }

  writePackedUInt32(value: number) {
    do {
      let b = value & 0xff;

      if (value >= 0x80) {
        b |= 0x80;
      }

      this.resizeBuffer(1);
      this.buffer.writeUInt8(b, this.cursor++);

      value >>>= 7;
    } while (value != 0);
  }

  writeString(value: string) {
    let bytes = Buffer.from(value);

    this.writePackedUInt32(bytes.length);
    this.writeBytes(bytes);
  }

  writeBytes(bytes: Buffer | Number[] | String | MessageWriter) {
    if (bytes instanceof MessageWriter) {
      bytes = bytes.buffer;
    }

    this.resizeBuffer(bytes.length);

    const b = Buffer.from(bytes);
    b.copy(this.buffer, this.cursor);

    this.cursor += b.length;
  }

  hasBytesLeft(): boolean {
    return this.bytesRemainingLength() > 0;
  }

  bytesRemainingLength(): number {
    return this.buffer.length - this.cursor;
  }

  static concat(...HazelMessages: MessageWriter[]) {
    return new MessageWriter(Buffer.concat(HazelMessages.map((PB) => PB.buffer)));
  }

  get length(): number {
    return this.buffer.length;
  }

  startMessage(flag:number) {
    this.writeUInt16(0);
    this.writeByte(flag);
    this.messageStarts.push(this.cursor)
  }

  endMessage() {
    let start = this.messageStarts.pop();
    
    if(start) {
      if (this.cursor - start > 65535) {
        throw new Error("Message length longer than 65.535KiB! Will not fit into U16.")
      }
  
      this.buffer[start - 3] = (this.cursor - start) % 256
      this.buffer[start - 2] = ((this.cursor - start) >> 8) % 256
    } else {
      throw new Error("endMessage called when there are no active messages")
    }

  }
  writeBitfield(arr: boolean[]) {
    for (let chunkidx = 0; chunkidx < arr.length; chunkidx += 8) {
      let tmparr = arr.slice(chunkidx, chunkidx+8)
      let n = 0;
  
      for (let i = 0; i < tmparr.length; i++) {
        if (tmparr[tmparr.length-(i+1)]) {
          n |= 1 << i;
        }
      }
  
      this.writeByte(n)
    }
  }
}

export class MessageReader {
  cursor: number = 0;
  buffer: Buffer = Buffer.alloc(0);
  tag: number = 0xff;
  length: number = 0;

  static fromMessage(buildFrom: BuildFrom = 0, isHexString: boolean = true): MessageReader {
    let reader = new MessageReader();
    
    reader.initialize(buildFrom, isHexString);

    reader.length = reader.buffer.readUInt16LE();
    reader.tag = reader.buffer.readUInt8(2);
    reader.cursor += 3;

    return reader;
  }

  static fromRawBytes(buildFrom: BuildFrom = 0, isHexString: boolean = true): MessageReader {
    let reader = new MessageReader();

    reader.initialize(buildFrom, isHexString);

    reader.length = reader.buffer.length;
    reader.tag = 0xff;

    return reader;
  }

  private initialize(buildFrom: BuildFrom, isHexString: boolean) {
    if (buildFrom instanceof MessageReader) {
      this.buffer = buildFrom.buffer;
    } else if (typeof buildFrom != "number") {
      if (typeof buildFrom === "string" && isHexString) {
        this.buffer = Buffer.from(buildFrom, "hex");
      } else {
        this.buffer = Buffer.from(buildFrom);
      }
    } else {
      this.buffer = Buffer.alloc(buildFrom);
    }
  }

  readMessage(): MessageReader | undefined {
    if (this.getReadableBytesLength() - 3 <= 0) {
      return;
    }

    let len = this.buffer.readUInt16LE(this.cursor);

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

  readInt16(isBigEndian = false): number {
    let val = this.buffer[isBigEndian ? "readInt16LE" : "readInt16LE"](this.cursor);

    this.cursor += 2;

    return val;
  }

  readUInt16(isBigEndian: boolean = false): number {
    let val = this.buffer[isBigEndian ? "readUInt16LE" : "readUInt16LE"](this.cursor);

    this.cursor += 2;

    return val;
  }

  readInt32(isBigEndian = false): number {
    let val = this.buffer[isBigEndian ? "readInt32LE" : "readInt32LE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  readUInt32(isBigEndian = false): number {
    let val = this.buffer[isBigEndian ? "readUInt32LE" : "readUInt32LE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  readFloat32(isBigEndian = false): number {
    let val = this.buffer[isBigEndian ? "readFloatBE" : "readFloatLE"](this.cursor);

    this.cursor += 4;

    return val;
  }

  readString(): string {
    return this.readBytes(this.readPackedUInt32()).buffer.toString("utf8");
  }

  readPackedInt32(): number {
    let readMore: boolean = true;
    let shift: number = 0;
    let output: number = 0;

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
    let reader = MessageReader.fromRawBytes(this.buffer.slice(this.cursor, this.cursor + length));

    this.cursor += length;

    return reader;
  }

  hasBytesLeft(): boolean {
    return this.getReadableBytesLength() > 0;
  }
  
  getReadableBytesLength(): number {
    return this.buffer.length - this.cursor;
  }

  readBitfield(padding: number = 8) {
    return [...this.readBytes(Math.ceil(padding/8)).buffer].map(v => {
      return v
        .toString(2)
        .padStart(8, "0")
        .split("")
        .map((c) => c === "1")
    }).flat().slice(0, padding)
  }
}
