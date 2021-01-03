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
  static get skeld(): Readonly<SystemDoorList> {
    return SKELD_DOORS;
  }

  static get miraHq(): Readonly<SystemDoorList> {
    return {};
  }

  static get polus(): Readonly<SystemDoorList> {
    return POLUS_DOORS;
  }

  static get airship(): Readonly<SystemDoorList> {
    return AIRSHIP_DOORS;
  }

  static forLevel(level: Level): Readonly<SystemDoorList> {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return this.skeld;
      case Level.MiraHq:
        return this.miraHq;
      case Level.Polus:
        return this.polus;
      case Level.Airship:
        return this.airship;
    }
  }

  static get skeldCount(): Readonly<number> {
    return SKELD_COUNT;
  }

  static get miraHqCount(): Readonly<number> {
    return 0;
  }

  static get polusCount(): Readonly<number> {
    return POLUS_COUNT;
  }

  static get airshipCount(): Readonly<number> {
    return AIRSHIP_COUNT;
  }

  static count(level: Level): Readonly<number> {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return this.skeldCount;
      case Level.MiraHq:
        return this.miraHqCount;
      case Level.Polus:
        return this.polusCount;
      case Level.Airship:
        return this.airshipCount;
    }
  }
}
