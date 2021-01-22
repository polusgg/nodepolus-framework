import { Bitfield } from "../../lib/types";
import test from "ava";

enum Color {
  Red = 0,
  Blue = 1,
  Green = 2,
  Yellow = 3,
  Purple = 4,
  Orange = 5,
  White = 6,
  Black = 7,
}

test("gets the underlying boolean array", t => {
  const bits = new Bitfield([true, false, false, true, true]);

  t.deepEqual(bits.getBits(), [
    true, false, false, true, true,
  ]);
});

test("gets the number of bits in the Bitfield", t => {
  const bits = new Bitfield([true, false, false, true, true]);

  t.is(bits.getSize(), 5);
});

test("checks equality with another Bitfield", t => {
  const one = new Bitfield([true, false, false, true, true]);
  const two = new Bitfield([true, false, false, true, false]);

  t.false(one.equals(two));

  two.toggle(4);

  t.true(one.equals(two));
});

test("clones itself", t => {
  const original = new Bitfield([true, false, false, true, true]);
  const clone = original.clone();

  t.true(clone.equals(original));

  clone.toggle(0);

  t.false(clone.equals(original));
  t.deepEqual(original.getBits(), [
    true, false, false, true, true,
  ]);
  t.deepEqual(clone.getBits(), [
    false, false, false, true, true,
  ]);
});

test("parses a bitfield with an unknown size", t => {
  const num = 25;
  const bits = Bitfield.fromNumber(num);

  t.deepEqual(bits.getBits(), [
    true, false, false, true, true,
  ]);
});

test("parses a bitfield with a fixed size", t => {
  const num = 25;
  const bits = Bitfield.fromNumber(num, 8);

  t.deepEqual(bits.getBits(), [
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

test("converts a bitfield to a typed number array", t => {
  const bits = new Bitfield([true, false, false, true, true, false, false, true]);

  t.deepEqual(bits.asNumbers<Color>(), [
    Color.Red, Color.Yellow, Color.Purple, Color.Black,
  ]);
});

test("converts a bitfield to a number array with a custom starting index", t => {
  const bits = new Bitfield([true, false, false, true, true]);

  t.deepEqual(bits.asNumbers(6), [
    6, 9, 10,
  ]);
});

test("checks if a bit is set", t => {
  const bits = new Bitfield([true, false, false, true, true]);

  t.true(bits.has(0));
  t.false(bits.has(1));
  t.false(bits.has(2));
  t.true(bits.has(3));
  t.true(bits.has(4));
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

test("checks if all bits are set", t => {
  const bits = new Bitfield(Array(8).fill(false));

  t.false(bits.all([1, 2]));

  bits.set(2);

  t.false(bits.all([1, 2]));

  bits.set(1);
  bits.unset(2);

  t.false(bits.all([1, 2]));

  bits.set(2);

  t.true(bits.all([1, 2]));
});

test("sets a bit", t => {
  const bits = new Bitfield(Array(8).fill(false));

  bits.set(2);

  t.is(bits.toNumber(), 4);
  t.deepEqual(bits.getBits(), [
    false, false, true, false, false, false, false, false,
  ]);
});

test("unsets a bit", t => {
  const bits = new Bitfield(Array(8).fill(true));

  bits.unset(2);

  t.is(bits.toNumber(), 251);
  t.deepEqual(bits.getBits(), [
    true, true, false, true, true, true, true, true,
  ]);
});

test("toggles a bit", t => {
  const bits = new Bitfield(Array(8).fill(true));

  bits.toggle(2);

  t.is(bits.toNumber(), 251);
  t.deepEqual(bits.getBits(), [
    true, true, false, true, true, true, true, true,
  ]);

  bits.toggle(4);
  bits.toggle(2);

  t.is(bits.toNumber(), 239);
  t.deepEqual(bits.getBits(), [
    true, true, true, true, false, true, true, true,
  ]);
});

test("updates a bit", t => {
  const bits = new Bitfield(Array(8).fill(true));

  bits.update(2, false);

  t.is(bits.toNumber(), 251);
  t.deepEqual(bits.getBits(), [
    true, true, false, true, true, true, true, true,
  ]);

  bits.update(4, false);
  bits.update(2, true);

  t.is(bits.toNumber(), 239);
  t.deepEqual(bits.getBits(), [
    true, true, true, true, false, true, true, true,
  ]);
});
