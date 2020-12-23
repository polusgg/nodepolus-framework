import { PlayerColor } from "../types/enums";

type Color = readonly [red: number, green: number, blue: number, alpha: number];

type PlayerColorValues = {
  [key in PlayerColor]: Readonly<{
    light: Color;
    dark: Color;
  }>;
};

export class Palette {
  public static readonly disabledGrey: Color = [76, 76, 76, 255];
  public static readonly disabledColor: Color = [255, 255, 255, 76];
  public static readonly enabledColor: Color = [255, 255, 255, 255];
  public static readonly black: Color = [0, 0, 0, 255];
  public static readonly clearWhite: Color = [255, 255, 255, 0];
  public static readonly halfWhite: Color = [255, 255, 255, 127];
  public static readonly white: Color = [255, 255, 255, 255];
  public static readonly lightBlue: Color = [127, 127, 255, 255];
  public static readonly blue: Color = [51, 51, 255, 255];
  public static readonly orange: Color = [255, 153, 1, 255];
  public static readonly purple: Color = [153, 25, 153, 255];
  public static readonly brown: Color = [183, 109, 28, 255];
  public static readonly crewmateBlue: Color = [140, 255, 255, 255];
  public static readonly impostorRed: Color = [255, 25, 25, 255];

  public static readonly playerBody: Readonly<PlayerColorValues> = {
    [PlayerColor.Red]: { light: [198, 17, 17, 255], dark: [122, 8, 56, 255] },
    [PlayerColor.Blue]: { light: [19, 46, 210, 255], dark: [9, 21, 142, 255] },
    [PlayerColor.Green]: { light: [17, 128, 45, 255], dark: [10, 77, 46, 255] },
    [PlayerColor.Pink]: { light: [238, 84, 187, 255], dark: [172, 43, 174, 255] },
    [PlayerColor.Orange]: { light: [240, 125, 13, 255], dark: [180, 62, 21, 255] },
    [PlayerColor.Yellow]: { light: [246, 246, 87, 255], dark: [195, 136, 34, 255] },
    [PlayerColor.Black]: { light: [63, 71, 78, 255], dark: [30, 31, 38, 255] },
    [PlayerColor.White]: { light: [215, 225, 241, 255], dark: [132, 149, 192, 255] },
    [PlayerColor.Purple]: { light: [107, 47, 188, 255], dark: [59, 23, 124, 255] },
    [PlayerColor.Brown]: { light: [113, 73, 30, 255], dark: [94, 38, 21, 255] },
    [PlayerColor.Cyan]: { light: [56, 255, 221, 255], dark: [36, 169, 191, 255] },
    [PlayerColor.Lime]: { light: [80, 240, 57, 255], dark: [21, 168, 66, 255] },
    [PlayerColor.ForteGreen]: { light: [29, 152, 83, 255], dark: [18, 63, 27, 255] },
  };

  public static readonly playerVisor: Color = [149, 202, 220, 255];
}
