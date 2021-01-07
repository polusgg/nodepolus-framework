import { Level } from "../../types/enums";

const SKELD_DOOR_NAMES: readonly string[] = [
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

const POLUS_DOOR_NAMES: readonly string[] = [
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

const AIRSHIP_DOOR_NAMES: readonly string[] = [
  // TODO
];

export class DoorNames {
  static forSkeld(): readonly string[] {
    return SKELD_DOOR_NAMES;
  }

  static forMiraHq(): readonly string[] {
    return [];
  }

  static forPolus(): readonly string[] {
    return POLUS_DOOR_NAMES;
  }

  static forAirship(): readonly string[] {
    return AIRSHIP_DOOR_NAMES;
  }

  static forLevel(level: Level): readonly string[] {
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
}
