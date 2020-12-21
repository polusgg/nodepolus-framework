import { MessageReader, MessageWriter } from "../../lib/util/hazelMessage";
import { isFloatEqual } from "../../lib/util/functions";
import { Vector2 } from "../../lib/types";
import test from "ava";

test("reads a vector2", t => {
  const buf = MessageReader.fromMessage("040001ff7fff7f");
  const vec = Vector2.deserialize(buf);

  t.true(isFloatEqual(vec.x, 0, 0.001));
  t.true(isFloatEqual(vec.y, 0, 0.001));
});

test("writes a vector2", t => {
  const buf = new MessageWriter().startMessage(1);
  const vec = new Vector2(0, 0);

  vec.serialize(buf);

  buf.endMessage();

  t.is(buf.buffer.toString("hex"), "040001ff7fff7f");
});
