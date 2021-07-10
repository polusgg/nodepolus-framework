import { Vector2 } from "..";
import { Asset } from "../../protocol/polus/assets";
import { EdgeAlignments } from "../enums";

export type ButtonFields = {
  asset: Asset;
  position: Vector2;
  maxTimer: number;
  currentTime?: number;
  saturated?: boolean;
  color?: [number, number, number, number];
  isCountingDown?: boolean;
  alignment: EdgeAlignments;
};
