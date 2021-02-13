import { Level, SystemType } from "../types/enums";
import { LevelVent, Vector2 } from "../types";

const VENTS_THE_SKELD: readonly Readonly<LevelVent>[] = [
  { id: 0, name: "In Admin", system: SystemType.Admin, position: new Vector2(2.543373, -9.59182) },
  { id: 1, name: "In the right hallway", system: SystemType.Hallway, position: new Vector2(9.38308, -6.0749207) },
  { id: 2, name: "In the Cafeteria", system: SystemType.Cafeteria, position: new Vector2(4.2584915, 0.08728027) },
  { id: 3, name: "In Electrical", system: SystemType.Electrical, position: new Vector2(-9.777372, -7.6704063) },
  { id: 4, name: "In the Upper Engine", system: SystemType.UpperEngine, position: new Vector2(-15.288929, 2.8827324) },
  { id: 5, name: "In Security", system: SystemType.Security, position: new Vector2(-12.534981, -6.586403) },
  { id: 6, name: "In Medbay", system: SystemType.Medbay, position: new Vector2(-10.608683, -3.8129234) },
  { id: 7, name: "In Weapons", system: SystemType.Weapons, position: new Vector2(8.819103, 3.687191) },
  { id: 8, name: "In Lower Reactor", system: SystemType.Reactor, position: new Vector2(-20.796825, -6.590065) },
  { id: 9, name: "In the Lower Engine", system: SystemType.Shields, position: new Vector2(-15.251087, -13.293049) },
  { id: 10, name: "In Shields", system: SystemType.Reactor, position: new Vector2(9.52224, -13.974211) },
  { id: 11, name: "In Upper Reactor", system: SystemType.Navigation, position: new Vector2(-21.877165, -2.6886406) },
  { id: 12, name: "In Upper Navigation", system: SystemType.Navigation, position: new Vector2(16.007935, -2.8046074) },
  { id: 13, name: "In Lower Navigation", system: SystemType.Navigation, position: new Vector2(16.007935, -6.0212097) },
];

const VENTS_MIRA_HQ: readonly Readonly<LevelVent>[] = [
  { id: 1, name: "On the Balcony", system: SystemType.Balcony, position: new Vector2(23.769283, -1.576561) },
  { id: 2, name: "In the Cafeteria", system: SystemType.Cafeteria, position: new Vector2(23.899899, 7.5434494) },
  { id: 3, name: "In the Reactor", system: SystemType.Reactor, position: new Vector2(0.4791336, 11.0603485) },
  { id: 4, name: "In the Laboratory", system: SystemType.Laboratory, position: new Vector2(11.60479, 14.179291) },
  { id: 5, name: "In the Office", system: SystemType.Office, position: new Vector2(13.279617, 20.492867) },
  { id: 6, name: "In Admin", system: SystemType.Admin, position: new Vector2(22.38987, 17.59243) },
  { id: 7, name: "In the Greenhouse", system: SystemType.Greenhouse, position: new Vector2(17.848782, 25.59304) },
  { id: 8, name: "In Medbay", system: SystemType.Medbay, position: new Vector2(15.409779, -1.4569321) },
  { id: 9, name: "In Decontamination", system: SystemType.Decontamination, position: new Vector2(6.8293304, 3.5077438) },
  { id: 10, name: "In the Locker Room", system: SystemType.LockerRoom, position: new Vector2(4.289009, 0.8929596) },
  { id: 11, name: "At the Launchpad", system: SystemType.Launchpad, position: new Vector2(-6.1811256, 3.9227905) },
];

const VENTS_POLUS: readonly Readonly<LevelVent>[] = [
  { id: 0, name: "By Security", system: SystemType.Security, position: new Vector2(1.9281311, -9.195087) },
  { id: 1, name: "Outside Electrical", system: SystemType.Outside, position: new Vector2(6.8989105, -14.047455) },
  { id: 2, name: "In O2", system: SystemType.Oxygen, position: new Vector2(3.5089645, -16.216679) },
  { id: 3, name: "Outside Communications", system: SystemType.Outside, position: new Vector2(12.303043, -18.53483) },
  { id: 4, name: "In the Office", system: SystemType.Office, position: new Vector2(16.377811, -19.235523) },
  { id: 5, name: "In Admin", system: SystemType.Admin, position: new Vector2(20.088806, -25.153582) },
  { id: 6, name: "In the Laboratory", system: SystemType.Laboratory, position: new Vector2(32.96254, -9.163349) },
  { id: 7, name: "By the Lava Pool", system: SystemType.Outside, position: new Vector2(30.906845, -11.497368) },
  { id: 8, name: "In Storage", system: SystemType.Storage, position: new Vector2(21.999237, -11.826963) },
  { id: 9, name: "By the right Seismic Stabilizer", system: SystemType.Outside, position: new Vector2(24.019531, -8.026855) },
  { id: 10, name: "By the left Seismic Stabilizer", system: SystemType.Outside, position: new Vector2(9.639431, -7.356678) },
  { id: 11, name: "Outside Admin", system: SystemType.Outside, position: new Vector2(18.929123, -24.487068) },
];

const VENTS_AIRSHIP: readonly Readonly<LevelVent>[] = [
  { id: 0, name: "", system: SystemType.VaultRoom, position: new Vector2(0, 0) },
  { id: 1, name: "", system: SystemType.Cockpit, position: new Vector2(0, 0) },
  { id: 2, name: "", system: SystemType.ViewingDeck, position: new Vector2(0, 0) },
  { id: 3, name: "", system: SystemType.Engine, position: new Vector2(0, 0) },
  { id: 4, name: "", system: SystemType.Kitchen, position: new Vector2(0, 0) },
  { id: 5, name: "", system: SystemType.MainHall, position: new Vector2(0, 0) },
  { id: 6, name: "", system: SystemType.MainHall, position: new Vector2(0, 0) },
  { id: 7, name: "", system: SystemType.GapRoom, position: new Vector2(0, 0) },
  { id: 8, name: "", system: SystemType.GapRoom, position: new Vector2(0, 0) },
  { id: 9, name: "", system: SystemType.Showers, position: new Vector2(0, 0) },
  { id: 10, name: "", system: SystemType.Records, position: new Vector2(0, 0) },
  { id: 11, name: "", system: SystemType.Storage, position: new Vector2(0, 0) },
];

/**
 * A helper class for retrieving static data for vents.
 */
export class Vents {
  /**
   * Gets all static vent data for The Skeld.
   */
  static forSkeld(): readonly Readonly<LevelVent>[] {
    return VENTS_THE_SKELD;
  }

  /**
   * Gets all static vent data for MIRA HQ.
   */
  static forMiraHq(): readonly Readonly<LevelVent>[] {
    return VENTS_MIRA_HQ;
  }

  /**
   * Gets all static vent data for Polus.
   */
  static forPolus(): readonly Readonly<LevelVent>[] {
    return VENTS_POLUS;
  }

  /**
   * Gets all static vent data for Airship.
   */
  static forAirship(): readonly Readonly<LevelVent>[] {
    return VENTS_AIRSHIP;
  }

  /**
   * Gets all static vent data for the given level.
   *
   * @param level - The level whose vents should be returned
   */
  static forLevel(level: Level): readonly Readonly<LevelVent>[] {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return Vents.forSkeld();
      case Level.MiraHq:
        return Vents.forMiraHq();
      case Level.Polus:
        return Vents.forPolus();
      case Level.Airship:
        return Vents.forAirship();
    }
  }

  /**
   * Gets static vent data for the given IDs on The Skeld.
   *
   * @param ids - The IDs of the vents that should be returned
   * @returns An array of vents whose IDs were included in `ids`
   */
  static forSkeldFromId(ids: number[]): readonly Readonly<LevelVent>[] {
    return Vents.forSkeld().filter(v => ids.includes(v.id));
  }

  /**
   * Gets static vent data for the given IDs on MIRA HQ.
   *
   * @param ids - The IDs of the vents that should be returned
   * @returns An array of vents whose IDs were included in `ids`
   */
  static forMiraHqFromId(ids: number[]): readonly Readonly<LevelVent>[] {
    return Vents.forMiraHq().filter(v => ids.includes(v.id));
  }

  /**
   * Gets static vent data for the given IDs on Polus.
   *
   * @param ids - The IDs of the vents that should be returned
   * @returns An array of vents whose IDs were included in `ids`
   */
  static forPolusFromId(ids: number[]): readonly Readonly<LevelVent>[] {
    return Vents.forPolus().filter(v => ids.includes(v.id));
  }

  /**
   * Gets static vent data for the given IDs on Airship.
   *
   * @param ids - The IDs of the vents that should be returned
   * @returns An array of vents whose IDs were included in `ids`
   */
  static forAirshipFromId(ids: number[]): readonly Readonly<LevelVent>[] {
    return Vents.forAirship().filter(v => ids.includes(v.id));
  }

  /**
   * Gets static vent data for the given IDs on the given level.
   *
   * @param level - The level whose vents will be searched
   * @param ids - The IDs of the vents that should be returned
   * @returns An array of vents whose IDs were included in `ids`
   */
  static forLevelFromId(level: Level, ids: number[]): readonly Readonly<LevelVent>[] {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return Vents.forSkeldFromId(ids);
      case Level.MiraHq:
        return Vents.forMiraHqFromId(ids);
      case Level.Polus:
        return Vents.forPolusFromId(ids);
      case Level.Airship:
        return Vents.forAirshipFromId(ids);
    }
  }

  /**
   * Gets static vent data for the vent at the given position on The Skeld.
   *
   * @param position - The position of the vent that should be returned
   * @returns The vent at `position`, or `undefined` if there is no vent at `position`
   */
  static forSkeldFromPosition(position: Vector2): Readonly<LevelVent> | undefined {
    return Vents.forSkeld().find(v => v.position.equals(position));
  }

  /**
   * Gets static vent data for the vent at the given position on MIRA HQ.
   *
   * @param position - The position of the vent that should be returned
   * @returns The vent at `position`, or `undefined` if there is no vent at `position`
   */
  static forMiraHqFromPosition(position: Vector2): Readonly<LevelVent> | undefined {
    return Vents.forMiraHq().find(v => v.position.equals(position));
  }

  /**
   * Gets static vent data for the vent at the given position on Polus.
   *
   * @param position - The position of the vent that should be returned
   * @returns The vent at `position`, or `undefined` if there is no vent at `position`
   */
  static forPolusFromPosition(position: Vector2): Readonly<LevelVent> | undefined {
    return Vents.forPolus().find(v => v.position.equals(position));
  }

  /**
   * Gets static vent data for the vent at the given position on Airship.
   *
   * @param position - The position of the vent that should be returned
   * @returns The vent at `position`, or `undefined` if there is no vent at `position`
   */
  static forAirshipFromPosition(position: Vector2): Readonly<LevelVent> | undefined {
    return Vents.forAirship().find(v => v.position.equals(position));
  }

  /**
   * Gets static vent data for the vent at the given position on the given level.
   *
   * @param level - The level whose vents will be searched
   * @param position - The position of the vent that should be returned
   * @returns The vent at `position` on `level`, or `undefined` if there is no vent at `position`
   */
  static forLevelFromPosition(level: Level, position: Vector2): Readonly<LevelVent> | undefined {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return Vents.forSkeldFromPosition(position);
      case Level.MiraHq:
        return Vents.forMiraHqFromPosition(position);
      case Level.Polus:
        return Vents.forPolusFromPosition(position);
      case Level.Airship:
        return Vents.forAirshipFromPosition(position);
    }
  }
}
