export enum RoomCodeVersion {
  One = 4,
  Two = 6,
}

export const CHAR_MAP: number[] = [
  25, 21, 19, 10, 8, 11, 12, 13, 22, 15, 16, 6, 24, 23, 18, 7, 0, 3, 9, 4, 14, 20, 1, 2, 5, 17,
];

export const CHAR_SET = "QWXRTYLPESDFGHUJKZOCVBINMA";

export class RoomCode {
  static generate(version: RoomCodeVersion = RoomCodeVersion.Two): string {
    return Array(version)
      .fill(0)
      .map(() => CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)])
      .join("");
  }

  static encode(code: string): number {
    code = code.toUpperCase();

    if (code.length == 4) {
      return RoomCode.encodeV1(code);
    }

    if (code.length == 6) {
      return RoomCode.encodeV2(code);
    }

    throw new TypeError(`Invalid room code length, expected 4 or 6 characters: ${code}`);
  }

  static encodeV1(code: string): number {
    const buf = Buffer.alloc(4);

    buf.write(code);

    return buf.readInt32LE();
  }

  static encodeV2(code: string): number {
    const a = CHAR_MAP[code.charCodeAt(0) - 65];
    const b = CHAR_MAP[code.charCodeAt(1) - 65];
    const c = CHAR_MAP[code.charCodeAt(2) - 65];
    const d = CHAR_MAP[code.charCodeAt(3) - 65];
    const e = CHAR_MAP[code.charCodeAt(4) - 65];
    const f = CHAR_MAP[code.charCodeAt(5) - 65];

    const one = (a + (26 * b)) & 0x3ff;
    const two = c + (26 * (d + (26 * (e + (26 * f)))));

    return one | ((two << 10) & 0x3ffffc00) | 0x80000000;
  }

  static decode(id: number): string {
    return id < 0 ? RoomCode.decodeV2(id) : RoomCode.decodeV1(id);
  }

  static decodeV1(id: number): string {
    const buf = Buffer.alloc(4);

    buf.writeInt32LE(id);

    return buf.toString();
  }

  static decodeV2(id: number): string {
    const a = id & 0x3ff;
    let b = (id >> 10) & 0xfffff;

    return [
      CHAR_SET[Math.floor(a % 26)],
      CHAR_SET[Math.floor(a / 26)],
      CHAR_SET[Math.floor(b % 26)],
      CHAR_SET[Math.floor((b /= 26) % 26)],
      CHAR_SET[Math.floor((b /= 26) % 26)],
      CHAR_SET[Math.floor((b / 26) % 26)],
    ].join("");
  }
}
