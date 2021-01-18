import { Vector2 } from "../../lib/types";
import test from "ava";

test("checks equality with another vector2", t => {
  const one = new Vector2(0.1234, 5.6789);
  const two = new Vector2(0.1225, 5.6798);

  t.true(one.equals(two));
  t.false(one.equals(two, 0.0001));
});

test("it can clone itself", t => {
  const original = new Vector2(69, 420);
  const clone = original.clone();

  t.is(clone.x, original.x);
  t.is(clone.y, original.y);
});

test("it can add another Vector2", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.add(two);
  const resultTwo = one.add(3, 4);

  t.is(resultOne.x, 4);
  t.is(resultOne.y, 6);
  t.is(resultTwo.x, 4);
  t.is(resultTwo.y, 6);
});

test("it can add to the X value", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.addX(two);
  const resultTwo = one.addX(3);

  t.is(resultOne.x, 4);
  t.is(resultOne.y, 2);
  t.is(resultTwo.x, 4);
  t.is(resultTwo.y, 2);
});

test("it can add to the Y value", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.addY(two);
  const resultTwo = one.addY(4);

  t.is(resultOne.x, 1);
  t.is(resultOne.y, 6);
  t.is(resultTwo.x, 1);
  t.is(resultTwo.y, 6);
});

test("it can subtract another Vector2", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.subtract(two);
  const resultTwo = one.subtract(3, 4);

  t.is(resultOne.x, -2);
  t.is(resultOne.y, -2);
  t.is(resultTwo.x, -2);
  t.is(resultTwo.y, -2);
});

test("it can subtract from the X value", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.subtractX(two);
  const resultTwo = one.subtractX(3);

  t.is(resultOne.x, -2);
  t.is(resultOne.y, 2);
  t.is(resultTwo.x, -2);
  t.is(resultTwo.y, 2);
});

test("it can subtract from the Y value", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.subtractY(two);
  const resultTwo = one.subtractY(4);

  t.is(resultOne.x, 1);
  t.is(resultOne.y, -2);
  t.is(resultTwo.x, 1);
  t.is(resultTwo.y, -2);
});

test("it can multiply with another Vector2", t => {
  const one = new Vector2(2, 3);
  const two = new Vector2(4, 5);
  const resultOne = one.multiply(two);
  const resultTwo = one.multiply(4, 5);

  t.is(resultOne.x, 8);
  t.is(resultOne.y, 15);
  t.is(resultTwo.x, 8);
  t.is(resultTwo.y, 15);
});

test("it can multiply the X value", t => {
  const one = new Vector2(2, 3);
  const two = new Vector2(4, 5);
  const resultOne = one.multiplyX(two);
  const resultTwo = one.multiplyX(4);

  t.is(resultOne.x, 8);
  t.is(resultOne.y, 3);
  t.is(resultTwo.x, 8);
  t.is(resultTwo.y, 3);
});

test("it can multiply the Y value", t => {
  const one = new Vector2(2, 3);
  const two = new Vector2(4, 5);
  const resultOne = one.multiplyY(two);
  const resultTwo = one.multiplyY(5);

  t.is(resultOne.x, 2);
  t.is(resultOne.y, 15);
  t.is(resultTwo.x, 2);
  t.is(resultTwo.y, 15);
});

test("it can be divided by another Vector2", t => {
  const one = new Vector2(10, 8);
  const two = new Vector2(5, 2);
  const resultOne = one.divide(two);
  const resultTwo = one.divide(5, 2);

  t.is(resultOne.x, 2);
  t.is(resultOne.y, 4);
  t.is(resultTwo.x, 2);
  t.is(resultTwo.y, 4);
});

test("it can divide the X value", t => {
  const one = new Vector2(10, 8);
  const two = new Vector2(5, 2);
  const resultOne = one.divideX(two);
  const resultTwo = one.divideX(5);

  t.is(resultOne.x, 2);
  t.is(resultOne.y, 8);
  t.is(resultTwo.x, 2);
  t.is(resultTwo.y, 8);
});

test("it can divide the Y value", t => {
  const one = new Vector2(10, 8);
  const two = new Vector2(5, 2);
  const resultOne = one.divideY(two);
  const resultTwo = one.divideY(2);

  t.is(resultOne.x, 10);
  t.is(resultOne.y, 4);
  t.is(resultTwo.x, 10);
  t.is(resultTwo.y, 4);
});
