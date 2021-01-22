import { isFloatEqual } from "../../lib/util/functions";
import { Vector2 } from "../../lib/types";
import test from "ava";

test("gets the x value", t => {
  const vector = new Vector2(0.1234, 5.6789);

  t.is(vector.getX(), 0.1234);
});

test("gets the y value", t => {
  const vector = new Vector2(0.1234, 5.6789);

  t.is(vector.getY(), 5.6789);
});

test("gets a Vector2 with x and y set to zero", t => {
  const zero = Vector2.zero();

  t.is(zero.getX(), 0);
  t.is(zero.getY(), 0);
});

test("checks equality with another Vector2", t => {
  const one = new Vector2(0.1234, 5.6789);
  const two = new Vector2(0.1225, 5.6798);

  t.true(one.equals(two));
  t.false(one.equals(two, 0.0001));
});

test("checks exact equality with another Vector2", t => {
  const one = new Vector2(0.1234, 5.6789);
  const two = new Vector2(0.1234, 5.6789);

  t.true(one.is(two));
});

test("clones itself", t => {
  const original = new Vector2(6.9, 4.20);
  const clone = original.clone();

  t.true(clone.is(original));
});

test("copies its X value from another Vector2", t => {
  const original = new Vector2(1, 2);
  const copySource = new Vector2(3, 4);
  const copied = original.copyX(copySource);

  t.is(copied.getX(), 3);
  t.is(copied.getY(), 2);
});

test("copies its Y value from another Vector2", t => {
  const original = new Vector2(1, 2);
  const copySource = new Vector2(3, 4);
  const copied = original.copyY(copySource);

  t.is(copied.getX(), 1);
  t.is(copied.getY(), 4);
});

test("adds another Vector2", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.add(two);

  t.is(resultOne.getX(), 4);
  t.is(resultOne.getY(), 6);
});

test("adds to its X value", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.addX(two);
  const resultTwo = one.addX(3);

  t.is(resultOne.getX(), 4);
  t.is(resultOne.getY(), 2);
  t.is(resultTwo.getX(), 4);
  t.is(resultTwo.getY(), 2);
});

test("adds to its Y value", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.addY(two);
  const resultTwo = one.addY(4);

  t.is(resultOne.getX(), 1);
  t.is(resultOne.getY(), 6);
  t.is(resultTwo.getX(), 1);
  t.is(resultTwo.getY(), 6);
});

test("subtracts another Vector2", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.subtract(two);

  t.is(resultOne.getX(), -2);
  t.is(resultOne.getY(), -2);
});

test("subtracts from its X value", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.subtractX(two);
  const resultTwo = one.subtractX(3);

  t.is(resultOne.getX(), -2);
  t.is(resultOne.getY(), 2);
  t.is(resultTwo.getX(), -2);
  t.is(resultTwo.getY(), 2);
});

test("subtracts from its Y value", t => {
  const one = new Vector2(1, 2);
  const two = new Vector2(3, 4);
  const resultOne = one.subtractY(two);
  const resultTwo = one.subtractY(4);

  t.is(resultOne.getX(), 1);
  t.is(resultOne.getY(), -2);
  t.is(resultTwo.getX(), 1);
  t.is(resultTwo.getY(), -2);
});

test("multiplies with another Vector2", t => {
  const one = new Vector2(2, 3);
  const two = new Vector2(4, 5);
  const resultOne = one.multiply(two);

  t.is(resultOne.getX(), 8);
  t.is(resultOne.getY(), 15);
});

test("multiplies its X value", t => {
  const one = new Vector2(2, 3);
  const two = new Vector2(4, 5);
  const resultOne = one.multiplyX(two);
  const resultTwo = one.multiplyX(4);

  t.is(resultOne.getX(), 8);
  t.is(resultOne.getY(), 3);
  t.is(resultTwo.getX(), 8);
  t.is(resultTwo.getY(), 3);
});

test("multiplies its Y value", t => {
  const one = new Vector2(2, 3);
  const two = new Vector2(4, 5);
  const resultOne = one.multiplyY(two);
  const resultTwo = one.multiplyY(5);

  t.is(resultOne.getX(), 2);
  t.is(resultOne.getY(), 15);
  t.is(resultTwo.getX(), 2);
  t.is(resultTwo.getY(), 15);
});

test("divides by another Vector2", t => {
  const one = new Vector2(10, 8);
  const two = new Vector2(5, 2);
  const resultOne = one.divide(two);

  t.is(resultOne.getX(), 2);
  t.is(resultOne.getY(), 4);
});

test("divides its X value", t => {
  const one = new Vector2(10, 8);
  const two = new Vector2(5, 2);
  const resultOne = one.divideX(two);
  const resultTwo = one.divideX(5);

  t.is(resultOne.getX(), 2);
  t.is(resultOne.getY(), 8);
  t.is(resultTwo.getX(), 2);
  t.is(resultTwo.getY(), 8);
});

test("divides its Y value", t => {
  const one = new Vector2(10, 8);
  const two = new Vector2(5, 2);
  const resultOne = one.divideY(two);
  const resultTwo = one.divideY(2);

  t.is(resultOne.getX(), 10);
  t.is(resultOne.getY(), 4);
  t.is(resultTwo.getX(), 10);
  t.is(resultTwo.getY(), 4);
});

test("inverts itself", t => {
  const original = new Vector2(-6.9, 4.20);
  const inverted = original.invert();

  t.is(inverted.getX(), 6.9);
  t.is(inverted.getY(), -4.20);
});

test("inverts its X value", t => {
  const original = new Vector2(-6.9, 4.20);
  const inverted = original.invertX();

  t.is(inverted.getX(), 6.9);
  t.is(inverted.getY(), 4.20);
});

test("inverts its Y value", t => {
  const original = new Vector2(-6.9, 4.20);
  const inverted = original.invertY();

  t.is(inverted.getX(), -6.9);
  t.is(inverted.getY(), -4.20);
});

test("calculates the dot product with another Vector2", t => {
  const one = new Vector2(10, 20);
  const two = new Vector2(30, 40);
  const product = one.dot(two);

  t.is(product, 1100);
});

test("calculates the cross product with another Vector2", t => {
  const one = new Vector2(10, 20);
  const two = new Vector2(30, 40);
  const product = one.cross(two);

  t.is(product, -200);
});

test("calculates its magnitude", t => {
  const value = new Vector2(6.9, 4.20);
  const magnitude = value.magnitude();

  t.true(isFloatEqual(magnitude, 8.078, 0.001));
});

test("calculates its squared magnitude", t => {
  const value = new Vector2(6.9, 4.20);
  const magnitude = value.squaredMagnitude();

  t.is(magnitude, 65.25);
});

test("calculates its distance from another Vector2", t => {
  const one = new Vector2(20, 40);
  const two = new Vector2(500, 600);
  const distance = one.distance(two);

  t.true(isFloatEqual(distance, 737.563557, 0.001));
});

test("calculates its squared distance from another Vector2", t => {
  const one = new Vector2(20, 40);
  const two = new Vector2(500, 600);
  const distance = one.squaredDistance(two);

  t.is(distance, 544000);
});

test("calculates the distance of its X value from that of another Vector2", t => {
  const one = new Vector2(20, 40);
  const two = new Vector2(500, 600);
  const distance = one.distanceX(two);

  t.is(distance, -480);
});

test("calculates the absolute distance of its X value from that of another Vector2", t => {
  const one = new Vector2(20, 40);
  const two = new Vector2(500, 600);
  const distance = one.absoluteDistanceX(two);

  t.is(distance, 480);
});

test("calculates the distance of its Y value from that of another Vector2", t => {
  const one = new Vector2(20, 40);
  const two = new Vector2(500, 600);
  const distance = one.distanceY(two);

  t.is(distance, -560);
});

test("calculates the absolute distance of its Y value from that of another Vector2", t => {
  const one = new Vector2(20, 40);
  const two = new Vector2(500, 600);
  const distance = one.absoluteDistanceY(two);

  t.is(distance, 560);
});
