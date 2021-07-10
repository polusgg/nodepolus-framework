import { Vector2 } from "..";
import { BodyDirection, EdgeAlignments } from "../enums";

export type DeadBodyFields = {
  color: [number, number, number, number] | number[];
  shadowColor: [number, number, number, number] | number[];
  position: Vector2;
  hasFallen?: boolean;
  bodyFacing?: BodyDirection;
  alignment?: EdgeAlignments;
  z?: number;
  attachedTo?: number;
};
