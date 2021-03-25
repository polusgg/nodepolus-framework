import { LobbyCode } from "../../src/util/lobbyCode";
import test from "ava";

test("encodes a v1 code", t => {
  t.is(LobbyCode.encode("TEST"), 1414743380);
  t.is(LobbyCode.encodeV1("TEST"), 1414743380);
});

test("decodes a v1 code", t => {
  t.is(LobbyCode.decode(1414743380), "TEST");
  t.is(LobbyCode.decodeV1(1414743380), "TEST");
});

test("encodes a V2 code", t => {
  t.is(LobbyCode.encode("REDSUS"), -1975562029);
  t.is(LobbyCode.encodeV2("REDSUS"), -1975562029);
  t.is(LobbyCode.encode("QQQQQQ"), -2147483648);
  t.is(LobbyCode.encodeV2("QQQQQQ"), -2147483648);
});

test("decodes a V2 code", t => {
  t.is(LobbyCode.decode(-1975562029), "REDSUS");
  t.is(LobbyCode.decodeV2(-1975562029), "REDSUS");
  t.is(LobbyCode.decode(-2147483648), "QQQQQQ");
  t.is(LobbyCode.decodeV2(-2147483648), "QQQQQQ");
});
