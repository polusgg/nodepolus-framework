import { bitsInNumber, notUndefined } from "../util/functions";

export class Bitfield {
  constructor(
    public bits: boolean[],
  ) {}

  static fromNumber(value: number, size?: number): Bitfield {
    if (!size) {
      size = bitsInNumber(value);
    }

    return new Bitfield(
      [...Array(size)].map((_, i) => !!((value >> i) & 1)),
    );
  }

  toNumber(): number {
    return (this.bits.map(bit => bit ? 1 : 0) as number[])
      .reduce((result: number, state: number, bit: number) => result | (state ? (1 << bit) : 0));
  }

  asNumbers(startingIndex: number = 0): number[] {
    return this.bits
      .map((state, index) => state ? index + startingIndex : undefined)
      .filter(notUndefined);
  }

  has(bit: number): boolean {
    return this.bits[bit];
  }

  any(bits: number[]): boolean {
    return bits.some(bit => this.bits[bit]);
  }

  set(bit: number): this {
    this.bits[bit] = true;

    return this;
  }

  unset(bit: number): this {
    this.bits[bit] = false;

    return this;
  }

  toggle(bit: number): this {
    this.bits[bit] = !this.bits[bit];

    return this;
  }
}
