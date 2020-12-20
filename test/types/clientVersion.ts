import { ClientVersion } from "../../lib/types/clientVersion";
import test from "ava";

test("encodes a client version", t => {
  t.is(new ClientVersion(2020, 9, 7, 0).encode(), 50516550);
  t.is(new ClientVersion(2020, 10, 8, 0).encode(), 50518400);
  t.is(new ClientVersion(2020, 11, 17, 0).encode(), 50520650);
});

test("decodes a client version", t => {
  t.deepEqual(ClientVersion.decode(50516550), new ClientVersion(2020, 9, 7, 0));
  t.deepEqual(ClientVersion.decode(50518400), new ClientVersion(2020, 10, 8, 0));
  t.deepEqual(ClientVersion.decode(50520650), new ClientVersion(2020, 11, 17, 0));
});
