import { TaskLength, TaskType } from "./enums";

export type LevelTask = Readonly<{
  id: Readonly<number>;
  name: Readonly<string>;
  length: Readonly<TaskLength>;
  isVisual: Readonly<boolean>;
  type: Readonly<TaskType>;
}>;
