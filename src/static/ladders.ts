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

const LADDER_NAMES_AIRSHIP = LADDERS_AIRSHIP.map(l => l.name);
const LADDER_COUNT_AIRSHIP = LADDERS_AIRSHIP.length;

export class Ladders {
  /**
   * Gets each system and their respective doors for the given level.
   *
   * @param level - The level whose systems and corresponding doors should be returned
   */
  static forLevel<T extends Level>(level: T): readonly Ladder[] {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
      case Level.MiraHq:
      case Level.Polus:
        return [];
      case Level.Airship:
        return LADDERS_AIRSHIP;
    }

    throw new Error("Invalid Level.");
  }

  /**
   * Gets the display names for the doors on the given level.
   *
   * @param level - The level whose door display names should be returned
   */
  static namesForLevel<T extends Level>(level: T): readonly string[] {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
      case Level.MiraHq:
      case Level.Polus:
        return [];
      case Level.Airship:
        return LADDER_NAMES_AIRSHIP;
    }

    throw new Error("Invalid Level.");
  }

  /**
   * Gets the number of doors on the given level.
   *
   * @param level - The level whose number of doors should be returned
   */
  static countForLevel<T extends Level>(level: T): number {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
      case Level.MiraHq:
      case Level.Polus:
        return 0;
      case Level.Airship:
        return LADDER_COUNT_AIRSHIP;
    }

    throw new Error("Invalid Level.");
  }
}
