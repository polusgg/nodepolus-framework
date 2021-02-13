import { Level } from "../../types/enums";

const DOOR_NAMES_SKELD: readonly string[] = [
  "Cafeteria",
  "Storage",
  "Upper Engine",
  "Cafeteria",
  "Lower Engine",
  "Upper Engine",
  "Security",
  "Storage",
  "Cafeteria",
  "Electrical",
  "Medbay",
  "Lower Engine",
  "Storage",
];

const DOOR_NAMES_MIRA_HQ: readonly string[] = [];

const DOOR_NAMES_POLUS: readonly string[] = [
  "Outside to Electrical",
  "Inside Electrical",
  "O2-to-Electrical Hallway (Top)",
  "O2-to-Electrical Hallway (Bottom)",
  "Outside to O2",
  "Weapons",
  "Communications",
  "Office (Right)",
  "Office (Left)",
  "Drill",
  "Outside to Medbay",
  "Storage",
];

const DOOR_NAMES_AIRSHIP: readonly string[] = [
  // TODO
];

/**
 * A helper class for retrieving door display names.
 */
export class DoorNames {
  /**
   * Gets the display names for the doors on The Skeld.
   */
  static forSkeld(): readonly string[] {
    return DOOR_NAMES_SKELD;
  }

  /**
   * Gets the display names for the doors on MIRA HQ.
   */
  static forMiraHq(): readonly string[] {
    return DOOR_NAMES_MIRA_HQ;
  }

  /**
   * Gets the display names for the doors on Polus.
   */
  static forPolus(): readonly string[] {
    return DOOR_NAMES_POLUS;
  }

  /**
   * Gets the display names for the doors on Airship.
   */
  static forAirship(): readonly string[] {
    return DOOR_NAMES_AIRSHIP;
  }

  /**
   * Gets the display names for the doors on the given level.
   *
   * @param level - The level whose door display names should be returned
   */
  static forLevel(level: Level): readonly string[] {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return DoorNames.forSkeld();
      case Level.MiraHq:
        return DoorNames.forMiraHq();
      case Level.Polus:
        return DoorNames.forPolus();
      case Level.Airship:
        return DoorNames.forAirship();
    }
  }
}
