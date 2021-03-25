import { ElementType } from "./enums";

export type LinkElement = {
  type: ElementType.Link;
  content: string;
  link: string;
};
