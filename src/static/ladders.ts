import { Level, SystemType } from "../types/enums";

export enum LadderDirection {
  Up,
  Down,
}

export type Ladder = {
  id: number;
  name: string;
  from: SystemType;
  to: SystemType;
  direction: LadderDirection;
  counterpart: number;
};

const LADDERS_AIRSHIP = [
  { id: 0, name: "Upper Gap Room to Lower Gap Room", from: SystemType.GapRoom, to: SystemType.GapRoom, direction: LadderDirection.Down, counterpart: 1 },
  { id: 1, name: "Lower Gap Room to Upper Gap Room", from: SystemType.GapRoom, to: SystemType.GapRoom, direction: LadderDirection.Up, counterpart: 0 },
  { id: 2, name: "Meeting Room to Gap Room", from: SystemType.MeetingRoom, to: SystemType.GapRoom, direction: LadderDirection.Down, counterpart: 3 },
  { id: 3, name: "Gap Room to Meeting Room", from: SystemType.GapRoom, to: SystemType.MeetingRoom, direction: LadderDirection.Up, counterpart: 2 },
  { id: 4, name: "Main Hall to Electrical", from: SystemType.MainHall, to: SystemType.Electrical, direction: LadderDirection.Down, counterpart: 5 },
  { id: 5, name: "Electrical to Main Hall", from: SystemType.Electrical, to: SystemType.MainHall, direction: LadderDirection.Up, counterpart: 4 },
] as const;

const LADDER_NAMES_AIRSHIP = LADDERS_AIRSHIP.map(ladder => ladder.name);

const LADDER_COUNT_AIRSHIP = LADDERS_AIRSHIP.length;

type LaddersFromLevel<T extends Level> =
  T extends Level.Airship ? typeof LADDERS_AIRSHIP
    : [];

type LadderNamesFromLevel<T extends Level> =
  T extends Level.Airship ? typeof LADDER_NAMES_AIRSHIP
    : [];

type LadderCountsFromLevel<T extends Level> =
  T extends Level.Airship ? typeof LADDER_COUNT_AIRSHIP
    : 0;

/**
 * A helper class for retrieving static data for ladders.
 */
export class Ladders {
  /**
   * Gets all static ladder data for the given level.
   *
   * @param level - The level whose ladders should be returned
   */
  static forLevel<T extends Level>(level: T): LaddersFromLevel<T> {
    switch (level) {
      case Level.Airship:
        return LADDERS_AIRSHIP as LaddersFromLevel<T>;
      default:
        return [] as LaddersFromLevel<T>;
    }
  }

  /**
   * Gets the display names for the ladders on the given level.
   *
   * @param level - The level whose ladder display names should be returned
   */
  static namesForLevel<T extends Level>(level: T): LadderNamesFromLevel<T> {
    switch (level) {
      case Level.Airship:
        return LADDER_NAMES_AIRSHIP as LadderNamesFromLevel<T>;
      default:
        return [] as LadderNamesFromLevel<T>;
    }
  }

  /**
   * Gets the number of ladders on the given level.
   *
   * @param level - The level whose number of ladders should be returned
   */
  static countForLevel<T extends Level>(level: T): LadderCountsFromLevel<T> {
    switch (level) {
      case Level.Airship:
        return LADDER_COUNT_AIRSHIP as LadderCountsFromLevel<T>;
      default:
        return 0 as LadderCountsFromLevel<T>;
    }
  }
}
