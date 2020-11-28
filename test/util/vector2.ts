import test from "ava";
import { MessageReader, MessageWriter } from "../../lib/util/hazelMessage";
import { Vector2 } from "../../lib/util/vector2";

function isEqual(actual: number, expected: number, epsilon: number = 0.001): boolean {
  return Math.abs(actual - expected) < epsilon;
}

test("it reads a vector2", t => {
  let buf = MessageReader.fromMessage("040001ff7fff7f");
  let vec = Vector2.deserialize(buf);

  console.log(`x=${vec.x}, y = ${vec.y}`);

  t.true(isEqual(vec.x, 0, 0.001));
  t.true(isEqual(vec.y, 0, 0.001));
});

test("it writes a vector2", t => {
  let buf = new MessageWriter().startMessage(1);
  let vec = new Vector2(0, 0);

  vec.serialize(buf);

  buf.endMessage();

  t.is(buf.buffer.toString("hex"), "040001ff7fff7f");
});
