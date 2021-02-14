import { Level, SystemType } from "../../types/enums";

type SystemDoorList = {
  [key in SystemType]?: readonly number[];
};

const DOORS_THE_SKELD: Readonly<SystemDoorList> = {
  [SystemType.Electrical]: [9],
  [SystemType.LowerEngine]: [4, 11],
  [SystemType.UpperEngine]: [2, 5],
  [SystemType.Security]: [6],
  [SystemType.Medbay]: [10],
  [SystemType.Storage]: [1, 7, 12],
  [SystemType.Cafeteria]: [0, 3, 8],
};

const DOORS_MIRA_HQ: Readonly<SystemDoorList> = {};

const DOORS_POLUS: Readonly<SystemDoorList> = {
  [SystemType.Electrical]: [0, 1, 2],
  [SystemType.Oxygen]: [3, 4],
  [SystemType.Weapons]: [5],
  [SystemType.Communications]: [6],
  [SystemType.Office]: [7, 8],
  [SystemType.Laboratory]: [9, 10],
  [SystemType.Storage]: [11],
};

const DOORS_AIRSHIP: Readonly<SystemDoorList> = {
  // TODO
};

const DOOR_COUNT_THE_SKELD: number = Object.values(DOORS_THE_SKELD).flat().length;

const DOOR_COUNT_MIRA_HQ: number = Object.values(DOORS_MIRA_HQ).flat().length;

const DOOR_COUNT_POLUS: number = Object.values(DOORS_POLUS).flat().length;

const DOOR_COUNT_AIRSHIP: number = Object.values(DOORS_AIRSHIP).flat().length;

/**
 * A helper class for retrieving door IDs for each system.
 */
export class SystemDoors {
  /**
   * Gets each system and their doors for The Skeld.
   */
  static forSkeld(): Readonly<SystemDoorList> {
    return DOORS_THE_SKELD;
  }

  /**
   * Gets each system and their doors for MIRA HQ.
   */
  static forMiraHq(): Readonly<SystemDoorList> {
    return DOORS_MIRA_HQ;
  }

  /**
   * Gets each system and their doors for Polus.
   */
  static forPolus(): Readonly<SystemDoorList> {
    return DOORS_POLUS;
  }

  /**
   * Gets each system and their doors for Airship.
   */
  static forAirship(): Readonly<SystemDoorList> {
    return DOORS_AIRSHIP;
  }

  /**
   * Gets each system and their doors for the given level.
   *
   * @param level - The level whose systems and doors should be returned
   */
  static forLevel(level: Level): Readonly<SystemDoorList> {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return SystemDoors.forSkeld();
      case Level.MiraHq:
        return SystemDoors.forMiraHq();
      case Level.Polus:
        return SystemDoors.forPolus();
      case Level.Airship:
        return SystemDoors.forAirship();
    }
  }

  /**
   * Gets the number of doors on The Skeld.
   */
  static countForSkeld(): number {
    return DOOR_COUNT_THE_SKELD;
  }

  /**
   * Gets the number of doors on MIRA HQ.
   */
  static countForMiraHq(): number {
    return DOOR_COUNT_MIRA_HQ;
  }

  /**
   * Gets the number of doors on Polus.
   */
  static countForPolus(): number {
    return DOOR_COUNT_POLUS;
  }

  /**
   * Gets the number of doors on Airship
   */
  static countForAirship(): number {
    return DOOR_COUNT_AIRSHIP;
  }

  /**
   * Gets the number of doors on the given level.
   *
   * @param level - The level whose number of doors should be returned
   */
  static countForLevel(level: Level): number {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return SystemDoors.countForSkeld();
      case Level.MiraHq:
        return SystemDoors.countForMiraHq();
      case Level.Polus:
        return SystemDoors.countForPolus();
      case Level.Airship:
        return SystemDoors.countForAirship();
    }
  }
}
