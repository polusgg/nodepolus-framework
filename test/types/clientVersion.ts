import { ClientVersion } from "../../lib/types";
import test from "ava";

test("encodes a ClientVersion", t => {
  t.is(new ClientVersion(2020, 9, 7, 0).encode(), 50516550);
  t.is(new ClientVersion(2020, 10, 8, 0).encode(), 50518400);
  t.is(new ClientVersion(2020, 11, 17, 0).encode(), 50520650);
});

test("decodes a ClientVersion", t => {
  t.deepEqual(ClientVersion.decode(50516550), new ClientVersion(2020, 9, 7, 0));
  t.deepEqual(ClientVersion.decode(50518400), new ClientVersion(2020, 10, 8, 0));
  t.deepEqual(ClientVersion.decode(50520650), new ClientVersion(2020, 11, 17, 0));
});

test("checks equality with another ClientVersion", t => {
  const one = new ClientVersion(2020, 9, 7, 69);
  const two = new ClientVersion(2020, 9, 7, 69);
  const three = new ClientVersion(2020, 9, 7, 420);
  const four = new ClientVersion(2020, 9, 8, 69);

  t.true(one.equals(two));
  t.false(one.equals(three));
  t.false(one.equals(four));
});

test("checks compatibility with another ClientVersion", t => {
  const one = new ClientVersion(2020, 9, 7, 69);
  const two = new ClientVersion(2020, 9, 7, 420);
  const three = new ClientVersion(2020, 9, 8, 69);

  t.true(one.equals(two, false));
  t.false(one.equals(three, false));
});
