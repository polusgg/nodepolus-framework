import { MessageReader, MessageWriter } from "../../lib/util/hazelMessage";
import { Vector2 } from "../../lib/types/vector2";
import test from "ava";

function isEqual(actual: number, expected: number, epsilon: number = 0.001): boolean {
  return Math.abs(actual - expected) < epsilon;
}

test("reads a vector2", t => {
  const buf = MessageReader.fromMessage("040001ff7fff7f");
  const vec = Vector2.deserialize(buf);

  t.true(isEqual(vec.x, 0, 0.001));
  t.true(isEqual(vec.y, 0, 0.001));
});

test("writes a vector2", t => {
  const buf = new MessageWriter().startMessage(1);
  const vec = new Vector2(0, 0);

  vec.serialize(buf);

  buf.endMessage();

  t.is(buf.buffer.toString("hex"), "040001ff7fff7f");
});
