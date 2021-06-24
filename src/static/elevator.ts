import { Vector2 } from "../types";
import { SystemType } from "../types/enums";

export const ELEVATOR_BOUNDS = <const> {
  [SystemType.SubmergedElevatorEastLeft]: {
    lower: {
      a: new Vector2(6.3, -41.3),
      b: new Vector2(9.3, -43.84),
    },
    upper: {
      a: new Vector2(6.25, 6.68),
      b: new Vector2(9.3, 4.1),
    },
  },
  [SystemType.SubmergedElevatorEastRight]: {
    lower: {
      a: new Vector2(9.5, -37.31),
      b: new Vector2(11.7, -41.2),
    },
    upper: {
      a: new Vector2(9.51, 10.79),
      b: new Vector2(11.27, 7.01),
    },
  },
  [SystemType.SubmergedElevatorService]: {
    lower: {
      a: new Vector2(11.3, -18.96),
      b: new Vector2(13, -22.7),
    },
    upper: {
      a: new Vector2(11.18, 29.1),
      b: new Vector2(13, 25.4),
    },
  },
  [SystemType.SubmergedElevatorWestLeft]: {
    lower: {
      a: new Vector2(-8.1, -24.85),
      b: new Vector2(-5.15, -27.7),
    },
    upper: {
      a: new Vector2(-8.1, 23.19),
      b: new Vector2(-5.2, 20.6),
    },
  },
  [SystemType.SubmergedElevatorWestRight]: {
    lower: {
      a: new Vector2(-5.1, -24.85),
      b: new Vector2(-2.17, -27.7),
    },
    upper: {
      a: new Vector2(-5.08, 23.19),
      b: new Vector2(-2.22, 20.6),
    },
  },
};
