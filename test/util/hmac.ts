import { Hmac } from "../../src/util/hmac";
import test from "ava";

const message = "I like big butts and I cannot lie";
const modifiedMessage = message.replace("big", "small");
const secret = "You other brothers can't deny";

test("it can sign a message", t => {
  const hash = Hmac.sign(message, secret);

  t.true(/^[0-9a-f]{40}$/i.test(hash));
});

test("it can verify a message", t => {
  const hash = Hmac.sign(message, secret);

  t.true(Hmac.verify(message, hash, secret));
  t.false(Hmac.verify(modifiedMessage, hash, secret));
});
