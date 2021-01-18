import { MessageReader, MessageWriter } from "../../lib/util/hazelMessage";
import { isFloatEqual } from "../../lib/util/functions";
import { Vector2 } from "../../lib/types";
import test from "ava";

test("reads a vector2", t => {
  const buf = MessageReader.fromRawBytes("ff7fff7fffff0000");
  const one = Vector2.deserialize(buf);
  const two = Vector2.deserialize(buf);

  t.true(isFloatEqual(one.x, 0, 0.001));
  t.true(isFloatEqual(one.y, 0, 0.001));
  t.true(isFloatEqual(two.x, 40, 0.001));
  t.true(isFloatEqual(two.y, -40, 0.001));
});

test("writes a vector2", t => {
  const buf = new MessageWriter();
  const one = new Vector2(0, 0);
  const two = new Vector2(40, -40);

  one.serialize(buf);
  two.serialize(buf);

  t.is(buf.getBuffer().toString("hex"), "ff7fff7fffff0000");
});

test("checks equality with another vector2", t => {
  const one = new Vector2(0.1234, 5.6789);
  const two = new Vector2(0.1225, 5.6798);

  t.true(one.equals(two));
  t.false(one.equals(two, 0.0001));
});
