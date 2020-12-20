import { TaskLength, TaskType } from ".";

export type LevelTask = {
  id: number;
  name: string;
  length: TaskLength;
  isVisual: boolean;
  type: TaskType;
};
