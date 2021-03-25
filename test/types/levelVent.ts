import { Level, SystemType } from "../../src/types/enums";
import { LevelVent, Vector2 } from "../../src/types";
import test from "ava";

test("checks if vents are on the same level", t => {
  const one = new LevelVent(Level.TheSkeld, 1, "I am connected to vent 2", SystemType.Admin, Vector2.zero(), [2]);
  const twoSkeld = new LevelVent(Level.TheSkeld, 2, "I am connected to vent 1", SystemType.Admin, Vector2.zero(), [1]);
  const twoPolus = new LevelVent(Level.Polus, 2, "I am connected to vent 1", SystemType.Admin, Vector2.zero(), [1]);

  t.true(one.isOnSameLevelAs(twoSkeld));
  t.true(twoSkeld.isOnSameLevelAs(one));
  t.false(one.isOnSameLevelAs(twoPolus));
  t.false(twoPolus.isOnSameLevelAs(one));
});

test("checks if a vent allows movement to another vent", t => {
  const one = new LevelVent(Level.TheSkeld, 1, "I am connected to vent 2", SystemType.Admin, Vector2.zero(), [2]);
  const two = new LevelVent(Level.TheSkeld, 2, "I am connected to vent 1", SystemType.Admin, Vector2.zero(), [3]);
  const twoPolus = new LevelVent(Level.Polus, 2, "I am connected to vent 1", SystemType.Admin, Vector2.zero(), [3]);
  const three = new LevelVent(Level.TheSkeld, 3, "I am connected to vent 4", SystemType.Admin, Vector2.zero(), [4]);
  const four = new LevelVent(Level.TheSkeld, 4, "I am connected to vent 3", SystemType.Admin, Vector2.zero(), [1, 3]);

  t.true(one.canMoveTo(two));
  t.false(two.canMoveTo(one));
  t.false(one.canMoveTo(twoPolus));
  t.false(twoPolus.canMoveTo(one));
  t.true(two.canMoveTo(three));
  t.false(three.canMoveTo(two));
  t.false(twoPolus.canMoveTo(three));
  t.false(three.canMoveTo(twoPolus));
  t.true(three.canMoveTo(four));
  t.true(four.canMoveTo(three));
  t.true(four.canMoveTo(one));
  t.false(one.canMoveTo(twoPolus));
  t.false(twoPolus.canMoveTo(one));
});

test("checks if a vent allows movement from another vent", t => {
  const one = new LevelVent(Level.TheSkeld, 1, "I am connected to vent 2", SystemType.Admin, Vector2.zero(), [2]);
  const two = new LevelVent(Level.TheSkeld, 2, "I am connected to vent 1", SystemType.Admin, Vector2.zero(), [3]);
  const twoPolus = new LevelVent(Level.Polus, 2, "I am connected to vent 1", SystemType.Admin, Vector2.zero(), [3]);
  const three = new LevelVent(Level.TheSkeld, 3, "I am connected to vent 4", SystemType.Admin, Vector2.zero(), [4]);
  const four = new LevelVent(Level.TheSkeld, 4, "I am connected to vent 3", SystemType.Admin, Vector2.zero(), [1, 3]);

  t.true(two.canMoveFrom(one));
  t.false(one.canMoveFrom(two));
  t.false(twoPolus.canMoveFrom(one));
  t.false(one.canMoveFrom(twoPolus));
  t.true(three.canMoveFrom(two));
  t.false(two.canMoveFrom(three));
  t.false(three.canMoveFrom(twoPolus));
  t.false(twoPolus.canMoveFrom(three));
  t.true(four.canMoveFrom(three));
  t.true(three.canMoveFrom(four));
  t.true(one.canMoveFrom(four));
  t.false(twoPolus.canMoveFrom(one));
  t.false(one.canMoveFrom(twoPolus));
});

test("checks if two vents allow movement in either direction", t => {
  const one = new LevelVent(Level.TheSkeld, 1, "I am connected to vent 2", SystemType.Admin, Vector2.zero(), [2]);
  const two = new LevelVent(Level.TheSkeld, 2, "I am connected to vent 1", SystemType.Admin, Vector2.zero(), [3]);
  const twoPolus = new LevelVent(Level.Polus, 2, "I am connected to vent 1", SystemType.Admin, Vector2.zero(), [3]);
  const three = new LevelVent(Level.TheSkeld, 3, "I am connected to vent 4", SystemType.Admin, Vector2.zero(), [4]);
  const four = new LevelVent(Level.TheSkeld, 4, "I am connected to vent 3", SystemType.Admin, Vector2.zero(), [1, 3]);

  t.true(one.isConnectedTo(two));
  t.true(two.isConnectedTo(one));
  t.false(one.isConnectedTo(twoPolus));
  t.false(twoPolus.isConnectedTo(one));
  t.true(two.isConnectedTo(three));
  t.true(three.isConnectedTo(two));
  t.false(twoPolus.isConnectedTo(three));
  t.false(three.isConnectedTo(twoPolus));
  t.true(three.isConnectedTo(four));
  t.true(four.isConnectedTo(three));
  t.true(four.isConnectedTo(one));
  t.true(one.isConnectedTo(four));
  t.false(one.isConnectedTo(twoPolus));
  t.false(twoPolus.isConnectedTo(one));
});
