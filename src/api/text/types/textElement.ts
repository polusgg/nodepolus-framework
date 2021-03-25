import { ElementType } from "./enums";

export type TextElement = {
  type: ElementType.Text;
  content: string;
  color: [number, number, number];
  opacity: number;
};
