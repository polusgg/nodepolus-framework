import { KillDistance, Language, Level, TaskBarMode } from "../../lib/types/enums";
import { MessageReader } from "../../lib/util/hazelMessage";
import { isFloatEqual } from "../../lib/util/functions";
import { GameOptionsData } from "../../lib/types";
import test from "ava";

test("deserializes a valid object", t => {
  const buf = MessageReader.fromRawBytes("2e040a00010000010000803f0000803f0000c03f000034420101020100000001010f00000078000000000f01010000");
  const options = GameOptionsData.deserialize(buf);

  t.false(buf.hasBytesLeft());
  t.is(options.getVersion(), 4);
  t.is(options.getMaxPlayers(), 10);
  t.is(options.getLanguages().length, 1);
  t.is(options.getLanguages()[0], Language.English);
  t.is(options.getLevels().length, 1);
  t.is(options.getLevels()[0], Level.MiraHq);
  t.true(isFloatEqual(options.getPlayerSpeedModifier(), 1.0));
  t.true(isFloatEqual(options.getCrewmateLightModifier(), 1.0));
  t.true(isFloatEqual(options.getImpostorLightModifier(), 1.5));
  t.true(isFloatEqual(options.getKillCooldown(), 45.0));
  t.is(options.getCommonTaskCount(), 1);
  t.is(options.getLongTaskCount(), 1);
  t.is(options.getShortTaskCount(), 2);
  t.is(options.getEmergencyMeetingCount(), 1);
  t.is(options.getImpostorCount(), 1);
  t.is(options.getKillDistance(), KillDistance.Medium);
  t.is(options.getDiscussionTime(), 15);
  t.is(options.getVotingTime(), 120);
  t.false(options.getIsDefault());
  t.is(options.getEmergencyCooldown(), 15);
  t.true(options.getConfirmEjects());
  t.true(options.getVisualTasks());
  t.false(options.getAnonymousVoting());
  t.is(options.getTaskBarUpdates(), TaskBarMode.Normal);
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
