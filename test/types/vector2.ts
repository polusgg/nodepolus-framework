import { MessageReader, MessageWriter } from "../../lib/util/hazelMessage";
import { isFloatEqual } from "../../lib/util/functions";
import { Vector2 } from "../../lib/types";
import test from "ava";

test("reads a vector2", t => {
  const buf = MessageReader.fromRawBytes("ff7fff7fffff0000");
  const vecOne = Vector2.deserialize(buf);
  const vecTwo = Vector2.deserialize(buf);

  t.true(isFloatEqual(vecOne.x, 0, 0.001));
  t.true(isFloatEqual(vecOne.y, 0, 0.001));
  t.true(isFloatEqual(vecTwo.x, 40, 0.001));
  t.true(isFloatEqual(vecTwo.y, -40, 0.001));
});

test("writes a vector2", t => {
  const buf = new MessageWriter();
  const vecOne = new Vector2(0, 0);
  const vecTwo = new Vector2(40, -40);

  vecOne.serialize(buf);
  vecTwo.serialize(buf);

  t.is(buf.getBuffer().toString("hex"), "ff7fff7fffff0000");
});
