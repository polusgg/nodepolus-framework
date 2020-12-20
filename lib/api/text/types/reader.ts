import { ReaderState } from "./enums";

export type Reader = {
  state: ReaderState;
  chunk: string;
  element: string;
};
