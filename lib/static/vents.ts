import { Level, SystemType } from "../types/enums";
import { LevelVent, Vector2 } from "../types";

const VENTS_THE_SKELD: readonly LevelVent[] = [
  new LevelVent(Level.TheSkeld, 0, "In Admin", SystemType.Admin, new Vector2(2.543373, -9.59182), [1, 2]),
  new LevelVent(Level.TheSkeld, 1, "In the right hallway", SystemType.Hallway, new Vector2(9.38308, -6.0749207), [0, 2]),
  new LevelVent(Level.TheSkeld, 2, "In the Cafeteria", SystemType.Cafeteria, new Vector2(4.2584915, 0.08728027), [0, 1]),
  new LevelVent(Level.TheSkeld, 3, "In Electrical", SystemType.Electrical, new Vector2(-9.777372, -7.6704063), [5, 6]),
  new LevelVent(Level.TheSkeld, 4, "In the Upper Engine", SystemType.UpperEngine, new Vector2(-15.288929, 2.8827324), [11]),
  new LevelVent(Level.TheSkeld, 5, "In Security", SystemType.Security, new Vector2(-12.534981, -6.586403), [4, 6]),
  new LevelVent(Level.TheSkeld, 6, "In Medbay", SystemType.Medbay, new Vector2(-10.608683, -3.8129234), [4, 5]),
  new LevelVent(Level.TheSkeld, 7, "In Weapons", SystemType.Weapons, new Vector2(8.819103, 3.687191), [12]),
  new LevelVent(Level.TheSkeld, 8, "In Lower Reactor", SystemType.Reactor, new Vector2(-20.796825, -6.590065), [9]),
  new LevelVent(Level.TheSkeld, 9, "In the Lower Engine", SystemType.Shields, new Vector2(-15.251087, -13.293049), [8]),
  new LevelVent(Level.TheSkeld, 10, "In Shields", SystemType.Reactor, new Vector2(9.52224, -13.974211), [13]),
  new LevelVent(Level.TheSkeld, 11, "In Upper Reactor", SystemType.Navigation, new Vector2(-21.877165, -2.6886406), [4]),
  new LevelVent(Level.TheSkeld, 12, "In Upper Navigation", SystemType.Navigation, new Vector2(16.007935, -2.8046074), [7]),
  new LevelVent(Level.TheSkeld, 13, "In Lower Navigation", SystemType.Navigation, new Vector2(16.007935, -6.0212097), [10]),
];

const VENTS_MIRA_HQ: readonly LevelVent[] = [
  new LevelVent(Level.MiraHq, 1, "On the Balcony", SystemType.Balcony, new Vector2(23.769283, -1.576561), [2, 8]),
  new LevelVent(Level.MiraHq, 2, "In the Cafeteria", SystemType.Cafeteria, new Vector2(23.899899, 7.5434494), [1, 6]),
  new LevelVent(Level.MiraHq, 3, "In the Reactor", SystemType.Reactor, new Vector2(0.4791336, 11.0603485), [4, 9, 11]),
  new LevelVent(Level.MiraHq, 4, "In the Laboratory", SystemType.Laboratory, new Vector2(11.60479, 14.179291), [3, 5, 9]),
  new LevelVent(Level.MiraHq, 5, "In the Office", SystemType.Office, new Vector2(13.279617, 20.492867), [4, 6, 7]),
  new LevelVent(Level.MiraHq, 6, "In Admin", SystemType.Admin, new Vector2(22.38987, 17.59243), [2, 5, 7]),
  new LevelVent(Level.MiraHq, 7, "In the Greenhouse", SystemType.Greenhouse, new Vector2(17.848782, 25.59304), [5, 6]),
  new LevelVent(Level.MiraHq, 8, "In Medbay", SystemType.Medbay, new Vector2(15.409779, -1.4569321), [1, 10]),
  new LevelVent(Level.MiraHq, 9, "In Decontamination", SystemType.Decontamination, new Vector2(6.8293304, 3.5077438), [3, 4, 10]),
  new LevelVent(Level.MiraHq, 10, "In the Locker Room", SystemType.LockerRoom, new Vector2(4.289009, 0.8929596), [8, 9, 11]),
  new LevelVent(Level.MiraHq, 11, "At the Launchpad", SystemType.Launchpad, new Vector2(-6.1811256, 3.9227905), [3, 10]),
];

const VENTS_POLUS: readonly LevelVent[] = [
  new LevelVent(Level.Polus, 0, "By Security", SystemType.Security, new Vector2(1.9281311, -9.195087), [1, 2]),
  new LevelVent(Level.Polus, 1, "Outside Electrical", SystemType.Outside, new Vector2(6.8989105, -14.047455), [0, 2]),
  new LevelVent(Level.Polus, 2, "In O2", SystemType.Oxygen, new Vector2(3.5089645, -16.216679), [0, 1]),
  new LevelVent(Level.Polus, 3, "Outside Communications", SystemType.Outside, new Vector2(12.303043, -18.53483), [4, 8]),
  new LevelVent(Level.Polus, 4, "In the Office", SystemType.Office, new Vector2(16.377811, -19.235523), [3, 8]),
  new LevelVent(Level.Polus, 5, "In Admin", SystemType.Admin, new Vector2(20.088806, -25.153582), [7, 11]),
  new LevelVent(Level.Polus, 6, "In the Laboratory", SystemType.Laboratory, new Vector2(32.96254, -9.163349), [7]),
  new LevelVent(Level.Polus, 7, "By the Lava Pool", SystemType.Outside, new Vector2(30.906845, -11.497368), [5, 6]),
  new LevelVent(Level.Polus, 8, "In Storage", SystemType.Storage, new Vector2(21.999237, -11.826963), [3, 4]),
  new LevelVent(Level.Polus, 9, "By the right Seismic Stabilizer", SystemType.Outside, new Vector2(24.019531, -8.026855), [10]),
  new LevelVent(Level.Polus, 10, "By the left Seismic Stabilizer", SystemType.Outside, new Vector2(9.639431, -7.356678), [9]),
  new LevelVent(Level.Polus, 11, "Outside Admin", SystemType.Outside, new Vector2(18.929123, -24.487068), [5]),
];

const VENTS_AIRSHIP: readonly LevelVent[] = [
  new LevelVent(Level.Airship, 0, "", SystemType.VaultRoom, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 1, "", SystemType.Cockpit, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 2, "", SystemType.ViewingDeck, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 3, "", SystemType.Engine, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 4, "", SystemType.Kitchen, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 5, "", SystemType.MainHall, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 6, "", SystemType.MainHall, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 7, "", SystemType.GapRoom, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 8, "", SystemType.GapRoom, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 9, "", SystemType.Showers, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 10, "", SystemType.Records, new Vector2(0, 0), []),
  new LevelVent(Level.Airship, 11, "", SystemType.Storage, new Vector2(0, 0), []),
];

const VENT_COUNT_THE_SKELD: number = VENTS_THE_SKELD.length;

const VENT_COUNT_MIRA_HQ: number = VENTS_MIRA_HQ.length;

const VENT_COUNT_POLUS: number = VENTS_POLUS.length;

const VENT_COUNT_AIRSHIP: number = VENTS_AIRSHIP.length;

/**
 * A helper class for retrieving static data for vents.
 */
export class Vents {
  /**
   * Gets all static vent data for The Skeld.
   */
  static forSkeld(): readonly LevelVent[] {
    return VENTS_THE_SKELD;
  }

  /**
   * Gets all static vent data for MIRA HQ.
   */
  static forMiraHq(): readonly LevelVent[] {
    return VENTS_MIRA_HQ;
  }

  /**
   * Gets all static vent data for Polus.
   */
  static forPolus(): readonly LevelVent[] {
    return VENTS_POLUS;
  }

  /**
   * Gets all static vent data for Airship.
   */
  static forAirship(): readonly LevelVent[] {
    return VENTS_AIRSHIP;
  }

  /**
   * Gets all static vent data for the given level.
   *
   * @param level - The level whose vents should be returned
   */
  static forLevel(level: Level): readonly LevelVent[] {
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
   * Gets static vent data for the given ID on The Skeld.
   *
   * @param ids - The ID of the vent that should be returned
   * @returns The vent with the given ID
   */
  static forSkeldFromId(id: number): LevelVent | undefined;
  /**
   * Gets static vent data for the given IDs on The Skeld.
   *
   * @param ids - The IDs of the vents that should be returned
   * @returns An array of vents whose IDs were included in `ids`
   */
  static forSkeldFromId(ids: number[]): readonly LevelVent[];
  /**
   * Gets static vent data for the given ID or IDs on The Skeld.
   *
   * @param ids - The ID or IDs of the vents that should be returned
   * @returns The vent with the given ID of an array of vents whose IDs were included in `ids`
   */
  static forSkeldFromId(ids: number | number[]): LevelVent | undefined | readonly LevelVent[] {
    return Vents.forLevelFromId(Level.TheSkeld, Array.isArray(ids) ? ids : [ids]);
  }

  /**
   * Gets static vent data for the given ID on MIRA HQ.
   *
   * @param ids - The ID of the vent that should be returned
   * @returns The vent with the given ID
   */
  static forMiraHqFromId(id: number): LevelVent | undefined;
  /**
   * Gets static vent data for the given IDs on MIRA HQ.
   *
   * @param ids - The IDs of the vents that should be returned
   * @returns An array of vents whose IDs were included in `ids`
   */
  static forMiraHqFromId(ids: number[]): readonly LevelVent[];
  /**
   * Gets static vent data for the given ID or IDs on MIRA HQ.
   *
   * @param ids - The ID or IDs of the vents that should be returned
   * @returns The vent with the given ID of an array of vents whose IDs were included in `ids`
   */
  static forMiraHqFromId(ids: number | number[]): LevelVent | undefined | readonly LevelVent[] {
    return Vents.forLevelFromId(Level.MiraHq, Array.isArray(ids) ? ids : [ids]);
  }

  /**
   * Gets static vent data for the given ID on Polus.
   *
   * @param ids - The ID of the vent that should be returned
   * @returns The vent with the given ID
   */
  static forPolusFromId(id: number): LevelVent | undefined;
  /**
   * Gets static vent data for the given IDs on Polus.
   *
   * @param ids - The IDs of the vents that should be returned
   * @returns An array of vents whose IDs were included in `ids`
   */
  static forPolusFromId(ids: number[]): readonly LevelVent[];
  /**
   * Gets static vent data for the given ID or IDs on Polus.
   *
   * @param ids - The ID or IDs of the vents that should be returned
   * @returns The vent with the given ID of an array of vents whose IDs were included in `ids`
   */
  static forPolusFromId(ids: number | number[]): LevelVent | undefined | readonly LevelVent[] {
    return Vents.forLevelFromId(Level.Polus, Array.isArray(ids) ? ids : [ids]);
  }

  /**
   * Gets static vent data for the given ID on Airship.
   *
   * @param ids - The ID of the vent that should be returned
   * @returns The vent with the given ID
   */
  static forAirshipFromId(id: number): LevelVent | undefined;
  /**
   * Gets static vent data for the given IDs on Airship.
   *
   * @param ids - The IDs of the vents that should be returned
   * @returns An array of vents whose IDs were included in `ids`
   */
  static forAirshipFromId(ids: number[]): readonly LevelVent[];
  /**
   * Gets static vent data for the given ID or IDs on Airship.
   *
   * @param ids - The ID or IDs of the vents that should be returned
   * @returns The vent with the given ID of an array of vents whose IDs were included in `ids`
   */
  static forAirshipFromId(ids: number | number[]): LevelVent | undefined | readonly LevelVent[] {
    return Vents.forLevelFromId(Level.Airship, Array.isArray(ids) ? ids : [ids]);
  }

  /**
   * Gets static vent data for the given IDs on the given level.
   *
   * @param level - The level whose vents will be searched
   * @param ids - The IDs of the vents that should be returned
   * @returns An array of vents whose IDs were included in `ids`
   */
  static forLevelFromId(level: Level, id: number): LevelVent | undefined;
  static forLevelFromId(level: Level, ids: number[]): readonly LevelVent[];
  static forLevelFromId(level: Level, ids: number | number[]): LevelVent | undefined | readonly LevelVent[] {
    const validated: number[] = Array.isArray(ids) ? ids : [ids];
    const vents = Vents.forLevel(level).filter(v => validated.includes(v.getId()));

    return Array.isArray(ids) ? vents[0] : vents;
  }

  /**
   * Gets static vent data for the vent at the given position on The Skeld.
   *
   * @param position - The position of the vent that should be returned
   * @returns The vent at `position`, or `undefined` if there is no vent at `position`
   */
  static forSkeldFromPosition(position: Vector2): LevelVent | undefined {
    return Vents.forLevelFromPosition(Level.TheSkeld, position);
  }

  /**
   * Gets static vent data for the vent at the given position on MIRA HQ.
   *
   * @param position - The position of the vent that should be returned
   * @returns The vent at `position`, or `undefined` if there is no vent at `position`
   */
  static forMiraHqFromPosition(position: Vector2): LevelVent | undefined {
    return Vents.forLevelFromPosition(Level.MiraHq, position);
  }

  /**
   * Gets static vent data for the vent at the given position on Polus.
   *
   * @param position - The position of the vent that should be returned
   * @returns The vent at `position`, or `undefined` if there is no vent at `position`
   */
  static forPolusFromPosition(position: Vector2): LevelVent | undefined {
    return Vents.forLevelFromPosition(Level.Polus, position);
  }

  /**
   * Gets static vent data for the vent at the given position on Airship.
   *
   * @param position - The position of the vent that should be returned
   * @returns The vent at `position`, or `undefined` if there is no vent at `position`
   */
  static forAirshipFromPosition(position: Vector2): LevelVent | undefined {
    return Vents.forLevelFromPosition(Level.Airship, position);
  }

  /**
   * Gets static vent data for the vent at the given position on the given level.
   *
   * @param level - The level whose vents will be searched
   * @param position - The position of the vent that should be returned
   * @returns The vent at `position` on `level`, or `undefined` if there is no vent at `position`
   */
  static forLevelFromPosition(level: Level, position: Vector2): LevelVent | undefined {
    return Vents.forLevel(level).find(v => v.getPosition().equals(position));
  }

  /**
   * Gets the number of vents on The Skeld.
   */
  static countForSkeld(): number {
    return VENT_COUNT_THE_SKELD;
  }

  /**
   * Gets the number of vents on MIRA HQ.
   */
  static countForMiraHq(): number {
    return VENT_COUNT_MIRA_HQ;
  }

  /**
   * Gets the number of vents on Polus.
   */
  static countForPolus(): number {
    return VENT_COUNT_POLUS;
  }

  /**
   * Gets the number of vents on Airship
   */
  static countForAirship(): number {
    return VENT_COUNT_AIRSHIP;
  }

  /**
   * Gets the number of vents on the given level.
   *
   * @param level - The level whose number of vents should be returned
   */
  static countForLevel(level: Level): number {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return Vents.countForSkeld();
      case Level.MiraHq:
        return Vents.countForMiraHq();
      case Level.Polus:
        return Vents.countForPolus();
      case Level.Airship:
        return Vents.countForAirship();
    }
  }
}
