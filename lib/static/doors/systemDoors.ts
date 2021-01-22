import { Level, SystemType } from "../../types/enums";

type SystemDoorList = {
  [key in SystemType]?: readonly number[];
};

const SKELD_DOORS: Readonly<SystemDoorList> = {
  [SystemType.Electrical]: [9],
  [SystemType.LowerEngine]: [4, 11],
  [SystemType.UpperEngine]: [2, 5],
  [SystemType.Security]: [6],
  [SystemType.Medbay]: [10],
  [SystemType.Storage]: [1, 7, 12],
  [SystemType.Cafeteria]: [0, 3, 8],
};

const MIRA_HQ_DOORS: Readonly<SystemDoorList> = {};

const POLUS_DOORS: Readonly<SystemDoorList> = {
  [SystemType.Electrical]: [0, 1, 2],
  [SystemType.Oxygen]: [3, 4],
  [SystemType.Weapons]: [5],
  [SystemType.Communications]: [6],
  [SystemType.Office]: [7, 8],
  [SystemType.Laboratory]: [9, 10],
  [SystemType.Storage]: [11],
};

const AIRSHIP_DOORS: Readonly<SystemDoorList> = {
  // TODO
};

const SKELD_COUNT: Readonly<number> = Object.values(SKELD_DOORS).flat().length;

const MIRA_HQ_COUNT: Readonly<number> = Object.values(MIRA_HQ_DOORS).flat().length;

const POLUS_COUNT: Readonly<number> = Object.values(POLUS_DOORS).flat().length;

const AIRSHIP_COUNT: Readonly<number> = Object.values(AIRSHIP_DOORS).flat().length;

/**
 * A helper class for retrieving door IDs for each system.
 */
export class SystemDoors {
  /**
   * Gets each system and their doors for The Skeld.
   */
  static forSkeld(): Readonly<SystemDoorList> {
    return SKELD_DOORS;
  }

  /**
   * Gets each system and their doors for Mira HQ.
   */
  static forMiraHq(): Readonly<SystemDoorList> {
    return MIRA_HQ_DOORS;
  }

  /**
   * Gets each system and their doors for Polus.
   */
  static forPolus(): Readonly<SystemDoorList> {
    return POLUS_DOORS;
  }

  /**
   * Gets each system and their doors for Airship.
   */
  static forAirship(): Readonly<SystemDoorList> {
    return AIRSHIP_DOORS;
  }

  /**
   * Gets each system and their doors for the given level.
   *
   * @param level The level whose systems and doors should be returned
   */
  static forLevel(level: Level): Readonly<SystemDoorList> {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return this.forSkeld();
      case Level.MiraHq:
        return this.forMiraHq();
      case Level.Polus:
        return this.forPolus();
      case Level.Airship:
        return this.forAirship();
    }
  }

  /**
   * Gets the number of doors on The Skeld.
   */
  static countForSkeld(): Readonly<number> {
    return SKELD_COUNT;
  }

  /**
   * Gets the number of doors on Mira HQ.
   */
  static countForMiraHq(): Readonly<number> {
    return MIRA_HQ_COUNT;
  }

  /**
   * Gets the number of doors on Polus.
   */
  static countForPolus(): Readonly<number> {
    return POLUS_COUNT;
  }

  /**
   * Gets the number of doors on Airship
   */
  static countForAirship(): Readonly<number> {
    return AIRSHIP_COUNT;
  }

  /**
   * Gets the number of doors on the given level.
   *
   * @param level The level whose number of doors should be returned
   */
  static countForLevel(level: Level): Readonly<number> {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return this.countForSkeld();
      case Level.MiraHq:
        return this.countForMiraHq();
      case Level.Polus:
        return this.countForPolus();
      case Level.Airship:
        return this.countForAirship();
    }
  }
}
