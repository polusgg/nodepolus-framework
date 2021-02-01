import { Level } from "../types/enums";
import { Vector2 } from "../types";

type LevelSpawnPositions = Readonly<{
  initial: Vector2;
  meetingOne: Vector2;
  meetingTwo: Vector2;
}>;

const SPAWN_RADIUS = 1.55;

const SPAWN_POSITIONS_SKELD: LevelSpawnPositions = {
  initial: new Vector2(-0.72, 0.62),
  meetingOne: new Vector2(-0.72, 0.62),
  meetingTwo: new Vector2(-0.72, 0.62),
};

const SPAWN_POSITIONS_MIRA_HQ: LevelSpawnPositions = {
  initial: new Vector2(-4.4, 2.2),
  meetingOne: new Vector2(24.043, 1.72),
  meetingTwo: new Vector2(0.0, 0.0),
};

const SPAWN_POSITIONS_POLUS: LevelSpawnPositions = {
  initial: new Vector2(16.64, -2.46),
  meetingOne: new Vector2(17.726, -16.286),
  meetingTwo: new Vector2(17.726, -17.515),
};

const SPAWN_POSITIONS_AIRSHIP: LevelSpawnPositions = {
  initial: new Vector2(0, 0),
  meetingOne: new Vector2(0, 0),
  meetingTwo: new Vector2(0, 0),
};

const UNKNOWN: Vector2 = new Vector2(0, 0.3636);

export class SpawnPositions {
  /**
   * Gets the spawn radius.
   */
  static spawnRadius(): number {
    return SPAWN_RADIUS;
  }

  /**
   * Gets the spawn center positions for The Skeld.
   */
  static forSkeld(): Readonly<LevelSpawnPositions> {
    return SPAWN_POSITIONS_SKELD;
  }

  /**
   * Gets the spawn center positions for MIRA HQ.
   */
  static forMiraHq(): Readonly<LevelSpawnPositions> {
    return SPAWN_POSITIONS_MIRA_HQ;
  }

  /**
   * Gets the spawn center positions for Airship.
   */
  static forPolus(): Readonly<LevelSpawnPositions> {
    return SPAWN_POSITIONS_POLUS;
  }

  /**
   * Gets the spawn center positions for Airship.
   */
  static forAirship(): Readonly<LevelSpawnPositions> {
    return SPAWN_POSITIONS_AIRSHIP;
  }

  /**
   * Gets the spawn center positions for the given level.
   *
   * @param level The level whose spawn center positions should be returned
   */
  static forLevel(level: Level): Readonly<LevelSpawnPositions> {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return SpawnPositions.forSkeld();
      case Level.MiraHq:
        return SpawnPositions.forMiraHq();
      case Level.Polus:
        return SpawnPositions.forPolus();
      case Level.Airship:
        return SpawnPositions.forAirship();
    }
  }

  static forPlayerOnSkeld(playerId: number, playerCount: number, isSpawn: boolean): Vector2 {
    return SpawnPositions.forPlayerOnLevel(Level.TheSkeld, playerId, playerCount, isSpawn);
  }

  static forPlayerOnMiraHq(playerId: number, playerCount: number, isSpawn: boolean): Vector2 {
    return SpawnPositions.forPlayerOnLevel(Level.MiraHq, playerId, playerCount, isSpawn);
  }

  static forPlayerOnPolus(playerId: number, playerCount: number, isSpawn: boolean): Vector2 {
    return SpawnPositions.forPlayerOnLevel(Level.Polus, playerId, playerCount, isSpawn);
  }

  static forPlayerOnAirship(playerId: number, playerCount: number, isSpawn: boolean): Vector2 {
    return SpawnPositions.forPlayerOnLevel(Level.Airship, playerId, playerCount, isSpawn);
  }

  static forPlayerOnLevel(level: Level, playerId: number, playerCount: number, isSpawn: boolean): Vector2 {
    if (level == Level.Polus && !isSpawn) {
      if (playerId < 5) {
        return SpawnPositions.forPolus().meetingOne.add(Vector2.right().multiply(playerId));
      }

      return SpawnPositions.forPolus().meetingTwo.add(Vector2.right().multiply(playerId - 5));
    }

    const positions = SpawnPositions.forLevel(level);
    const center = isSpawn ? positions.initial : positions.meetingOne;
    const spawnPosition = Vector2.up()
      .rotate((playerId - 1) * (360 / playerCount))
      .multiply(SpawnPositions.spawnRadius());

    return center.add(spawnPosition).add(UNKNOWN);
  }
}
