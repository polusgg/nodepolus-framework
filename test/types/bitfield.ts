import { Bitfield } from "../../lib/types";
import test from "ava";

test("parses a bitfield with an unknown size", t => {
  const num = 25;
  const bits = Bitfield.fromNumber(num);

  t.deepEqual(bits.bits, [
    true, false, false, true, true,
  ]);
});

test("parses a bitfield with a fixed size", t => {
  const num = 25;
  const bits = Bitfield.fromNumber(num, 8);

  t.deepEqual(bits.bits, [
    true, false, false, true, true, false, false, false,
  ]);
});

test("encodes a bitfield", t => {
  const bits = new Bitfield([true, false, false, true, true]);

  t.is(bits.toNumber(), 25);
});

test("converts a bitfield to a number array", t => {
  const bits = new Bitfield([true, false, false, true, true]);

  t.deepEqual(bits.asNumbers(), [
    0, 3, 4,
  ]);
});

test("converts a bitfield to a number array with a custom starting index", t => {
  const bits = new Bitfield([true, false, false, true, true]);

  t.deepEqual(bits.asNumbers(6), [
    6, 9, 10,
  ]);
});

test("sets a bit", t => {
  const bits = new Bitfield(Array(8).fill(false));

  bits.set(2);

  t.is(bits.toNumber(), 4);
  t.deepEqual(bits.bits, [
    false, false, true, false, false, false, false, false,
  ]);
});

test("unsets a bit", t => {
  const bits = new Bitfield(Array(8).fill(true));

  bits.unset(2);

  t.is(bits.toNumber(), 251);
  t.deepEqual(bits.bits, [
    true, true, false, true, true, true, true, true,
  ]);
});

test("toggles a bit", t => {
  const bits = new Bitfield(Array(8).fill(true));

  bits.toggle(2);

  t.is(bits.toNumber(), 251);
  t.deepEqual(bits.bits, [
    true, true, false, true, true, true, true, true,
  ]);

  bits.toggle(4);
  bits.toggle(2);

  t.is(bits.toNumber(), 239);
  t.deepEqual(bits.bits, [
    true, true, true, true, false, true, true, true,
  ]);
});

test("checks if any bit is set", t => {
  const bits = new Bitfield(Array(8).fill(false));

  t.false(bits.any([1, 2]));

  bits.set(2);

  t.true(bits.any([1, 2]));

  bits.set(1);
  bits.unset(2);

  t.true(bits.any([1, 2]));

  bits.unset(1);

  t.false(bits.any([1, 2]));
});
