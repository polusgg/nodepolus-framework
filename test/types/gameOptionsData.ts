import { KillDistance, Language, Level, TaskBarMode } from "../../lib/types/enums";
import { MessageReader } from "../../lib/util/hazelMessage";
import { isFloatEqual } from "../../lib/util/functions";
import { GameOptionsData } from "../../lib/types";
import test from "ava";

test("deserializes a valid object", t => {
  const buf = MessageReader.fromRawBytes("2e040a00010000010000803f0000803f0000c03f000034420101020100000001010f00000078000000000f01010000");
  const options = GameOptionsData.deserialize(buf);

  t.false(buf.hasBytesLeft());
  t.is(options.version, 4);
  t.is(options.maxPlayers, 10);
  t.is(options.languages.length, 1);
  t.is(options.languages[0], Language.English);
  t.is(options.levels.length, 1);
  t.is(options.levels[0], Level.MiraHq);
  t.true(isFloatEqual(options.playerSpeedModifier, 1.0));
  t.true(isFloatEqual(options.crewmateLightModifier, 1.0));
  t.true(isFloatEqual(options.impostorLightModifier, 1.5));
  t.true(isFloatEqual(options.killCooldown, 45.0));
  t.is(options.commonTaskCount, 1);
  t.is(options.longTaskCount, 1);
  t.is(options.shortTaskCount, 2);
  t.is(options.emergencyMeetingCount, 1);
  t.is(options.impostorCount, 1);
  t.is(options.killDistance, KillDistance.Medium);
  t.is(options.discussionTime, 15);
  t.is(options.votingTime, 120);
  t.false(options.isDefault);
  t.is(options.emergencyCooldown, 15);
  t.true(options.confirmEjects);
  t.true(options.visualTasks);
  t.false(options.anonymousVoting);
  t.is(options.taskBarUpdates, TaskBarMode.Normal);
});

test("throws an error for an unexpected version", t => {
  const buf = MessageReader.fromRawBytes("2e000a00010000010000803f0000803f0000c03f000034420101020100000001010f00000078000000000f01010000");
  const error = t.throws(() => GameOptionsData.deserialize(buf));

  t.true(error.message.startsWith("Invalid GameOptionsData version"));
});

test("throws an error for an incorrect length", t => {
  const buf = MessageReader.fromRawBytes("2f040a00010000010000803f0000803f0000c03f000034420101020100000001010f00000078000000000f0101000000");
  const error = t.throws(() => GameOptionsData.deserialize(buf));

  t.true(error.message.startsWith("Invalid GameOptionsData length for version"));
});
