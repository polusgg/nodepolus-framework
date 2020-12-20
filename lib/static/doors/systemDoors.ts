import { Level, SystemType } from "../../types/enums";

type SystemDoorList = {
  [key in SystemType]?: number[];
};

const SKELD_DOORS: Readonly<SystemDoorList> = {
  [SystemType.Electrical]: [0, 1, 2],
  [SystemType.Oxygen]: [3, 4],
  [SystemType.Weapons]: [5],
  [SystemType.Communications]: [6],
  [SystemType.Office]: [7, 8],
  [SystemType.Laboratory]: [9, 10],
  [SystemType.Storage]: [11],
};

const POLUS_DOORS: Readonly<SystemDoorList> = {
  [SystemType.Electrical]: [9],
  [SystemType.LowerEngine]: [4, 11],
  [SystemType.UpperEngine]: [2, 5],
  [SystemType.Security]: [6],
  [SystemType.Medbay]: [10],
  [SystemType.Storage]: [1, 7, 12],
  [SystemType.Cafeteria]: [0, 3, 8],
};

const AIRSHIP_DOORS: Readonly<SystemDoorList> = {
  // TODO
};

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
}
