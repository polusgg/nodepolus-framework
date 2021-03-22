import { PlayerColor } from "../types/enums";
import { Color } from "../types";

type ColorShades = Readonly<{
  light: Readonly<Color>;
  dark: Readonly<Color>;
}>;

type PlayerColorValues = {
  [key in PlayerColor]: Readonly<ColorShades>;
};

const disabledGrey: Readonly<Color> = [76, 76, 76, 255] as const;
const disabledColor: Readonly<Color> = [255, 255, 255, 76] as const;
const enabledColor: Readonly<Color> = [255, 255, 255, 255] as const;
const black: Readonly<Color> = [0, 0, 0, 255] as const;
const clearWhite: Readonly<Color> = [255, 255, 255, 0] as const;
const halfWhite: Readonly<Color> = [255, 255, 255, 127] as const;
const white: Readonly<Color> = [255, 255, 255, 255] as const;
const lightBlue: Readonly<Color> = [127, 127, 255, 255] as const;
const blue: Readonly<Color> = [51, 51, 255, 255] as const;
const orange: Readonly<Color> = [255, 153, 1, 255] as const;
const purple: Readonly<Color> = [153, 25, 153, 255] as const;
const brown: Readonly<Color> = [183, 109, 28, 255] as const;
const crewmateBlue: Readonly<Color> = [140, 255, 255, 255] as const;
const impostorRed: Readonly<Color> = [255, 25, 25, 255] as const;
const playerVisor: Readonly<Color> = [149, 202, 220, 255] as const;
const playerBody: Readonly<PlayerColorValues> = {
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
} as const;

/**
 * A helper class for retrieving static data about various colors used in-game.
 */
export class Palette {
  static disabledGrey(): Readonly<Color> {
    return disabledGrey;
  }

  static disabledColor(): Readonly<Color> {
    return disabledColor;
  }

  static enabledColor(): Readonly<Color> {
    return enabledColor;
  }

  static black(): Readonly<Color> {
    return black;
  }

  static clearWhite(): Readonly<Color> {
    return clearWhite;
  }

  static halfWhite(): Readonly<Color> {
    return halfWhite;
  }

  static white(): Readonly<Color> {
    return white;
  }

  static lightBlue(): Readonly<Color> {
    return lightBlue;
  }

  static blue(): Readonly<Color> {
    return blue;
  }

  static orange(): Readonly<Color> {
    return orange;
  }

  static purple(): Readonly<Color> {
    return purple;
  }

  static brown(): Readonly<Color> {
    return brown;
  }

  static crewmateBlue(): Readonly<Color> {
    return crewmateBlue;
  }

  static impostorRed(): Readonly<Color> {
    return impostorRed;
  }

  static playerVisor(): Readonly<Color> {
    return playerVisor;
  }

  /**
   * Gets the RGB colors values for all PlayerColors.
   */
  static playerBody(): Readonly<PlayerColorValues>;
  /**
   * Gets the RGB color values for the given PlayerColor.
   *
   * @param color - The player color whose RGB values will be returned
   */
  static playerBody(color: PlayerColor): Readonly<ColorShades>;
  /**
   * Gets the RGB color values for the given PlayerColor, or all PlayerColors if
   * no PlayerColor was given.
   *
   * @param color - The player color whose RGB values will be returned, or `undefined` to return all color RGB values
   */
  static playerBody(color?: PlayerColor): Readonly<PlayerColorValues> | Readonly<ColorShades> {
    return color !== undefined ? playerBody[color] : playerBody;
  }
}
