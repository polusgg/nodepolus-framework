import { TaskLength, TaskType } from "./enums";

export type LevelTask = {
  id: number;
  name: string;
  length: TaskLength;
  isVisual: boolean;
  type: TaskType;
};
