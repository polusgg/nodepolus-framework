import { RoomCode } from "../../lib/util/roomCode";
import test from "ava";

test("encodes a v1 code", t => {
  t.is(RoomCode.encode("TEST"), 1414743380);
  t.is(RoomCode.encodeV1("TEST"), 1414743380);
});

test("decodes a v1 code", t => {
  t.is(RoomCode.decode(1414743380), "TEST");
  t.is(RoomCode.decodeV1(1414743380), "TEST");
});

test("encodes a V2 code", t => {
  t.is(RoomCode.encode("REDSUS"), -1975562029);
  t.is(RoomCode.encodeV2("REDSUS"), -1975562029);
  t.is(RoomCode.encode("QQQQQQ"), -2147483648);
  t.is(RoomCode.encodeV2("QQQQQQ"), -2147483648);
});

test("decodes a V2 code", t => {
  t.is(RoomCode.decode(-1975562029), "REDSUS");
  t.is(RoomCode.decodeV2(-1975562029), "REDSUS");
  t.is(RoomCode.decode(-2147483648), "QQQQQQ");
  t.is(RoomCode.decodeV2(-2147483648), "QQQQQQ");
});
