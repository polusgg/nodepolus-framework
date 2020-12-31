import { AddressFamily } from "../../lib/types/enums";
import { ConnectionInfo } from "../../lib/types";
import test from "ava";

const addressV4 = "69.69.69.69";
const addressV6 = "0:0:0:0:0:ffff:4545:4545";

test("parses a connection info string for an IPv4 address", t => {
  const infoString = `${addressV4}:22023`;
  const connectionInfo = ConnectionInfo.fromString(infoString);

  t.is(connectionInfo.getAddress(), addressV4);
  t.is(connectionInfo.getPort(), 22023);
  t.is(connectionInfo.getFamily(), AddressFamily.IPv4);
});

test("parses a connection info string for an IPv6 address", t => {
  const infoString = `${addressV6}:22023`;
  const connectionInfo = ConnectionInfo.fromString(infoString);

  t.is(connectionInfo.getAddress(), addressV6);
  t.is(connectionInfo.getPort(), 22023);
  t.is(connectionInfo.getFamily(), AddressFamily.IPv6);
});

test("throws an error when trying to parse a string with an invalid syntax", t => {
  const infoString = `${addressV4} 22023`;
  const error = t.throws(() => ConnectionInfo.fromString(infoString));

  t.true(error.message.startsWith("Invalid syntax"));
});

test("throws an error when trying to parse a string with an invalid address", t => {
  const infoStringV4 = `256.69.69.69:22023`;
  const infoStringV6 = `0:0:0:0:ffff:4545:4545:22023`;
  const errorV4 = t.throws(() => ConnectionInfo.fromString(infoStringV4));
  const errorV6 = t.throws(() => ConnectionInfo.fromString(infoStringV6));

  t.true(errorV4.message.startsWith("Address is neither IPv4 nor IPv6"));
  t.true(errorV6.message.startsWith("Address is neither IPv4 nor IPv6"));
});

test("throws an error when trying to parse a string with an invalid port", t => {
  const one = t.throws(() => ConnectionInfo.fromString(`${addressV4}:0`));
  const two = t.throws(() => ConnectionInfo.fromString(`${addressV4}:0`));

  t.true(one.message.startsWith("Port is outside UDP port range"));
  t.true(two.message.startsWith("Port is outside UDP port range"));
});
