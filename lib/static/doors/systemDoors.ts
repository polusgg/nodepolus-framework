import { Level, SystemType } from "../../types/enums";

type SystemDoorList = {
  [key in SystemType]?: number[];
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

const POLUS_COUNT: Readonly<number> = Object.values(POLUS_DOORS).flat().length;

const AIRSHIP_COUNT: Readonly<number> = Object.values(AIRSHIP_DOORS).flat().length;

export class SystemDoors {
  static forSkeld(): Readonly<SystemDoorList> {
    return SKELD_DOORS;
  }

  static forMiraHq(): Readonly<SystemDoorList> {
    return {};
  }

  static forPolus(): Readonly<SystemDoorList> {
    return POLUS_DOORS;
  }

  static forAirship(): Readonly<SystemDoorList> {
    return AIRSHIP_DOORS;
  }

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

  static countForSkeld(): Readonly<number> {
    return SKELD_COUNT;
  }

  static countForMiraHq(): Readonly<number> {
    return 0;
  }

  static countForPolus(): Readonly<number> {
    return POLUS_COUNT;
  }

  static countForAirship(): Readonly<number> {
    return AIRSHIP_COUNT;
  }

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
