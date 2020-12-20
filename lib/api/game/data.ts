import { Level, SystemType } from "../../types/enums";

export const DOOR_DATA = {
  [Level.TheSkeld]: {
    [SystemType.Storage]: [1, 7, 12],
    [SystemType.Cafeteria]: [0, 3, 8],
    [SystemType.UpperEngine]: [2, 5],
    [SystemType.Electrical]: [9],
    [SystemType.Medbay]: [10],
    [SystemType.Security]: [6],
    [SystemType.LowerEngine]: [4, 11],
  },
  [Level.MiraHq]: {},
  [Level.Polus]: {
    [SystemType.Storage]: [11],
    [SystemType.Electrical]: [0, 1, 2],
    [SystemType.Oxygen]: [3, 4],
    [SystemType.Weapons]: [5],
    [SystemType.Communications]: [6],
    [SystemType.Laboratory]: [9, 10],
    [SystemType.Office]: [7, 8],
  },
  [Level.Airship]: {
    // TODO
  },
};

export const DOOR_NAMES = {
  [Level.TheSkeld]: [
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
  ],
  [Level.MiraHq]: [],
  [Level.Polus]: [
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
  ],
  [Level.Airship]: [
    // TODO
  ],
};
