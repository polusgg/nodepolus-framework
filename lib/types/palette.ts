class PlayerColors {
  public static readonly red: [198, 17, 17, 255];
  public static readonly blue: [19, 46, 210, 255];
  public static readonly green: [17, 128, 45, 255];
  public static readonly pink: [238, 84, 187, 255];
  public static readonly orange: [240, 125, 13, 255];
  public static readonly yellow: [246, 246, 87, 255];
  public static readonly black: [63, 71, 78, 255];
  public static readonly white: [215, 225, 241, 255];
  public static readonly purple: [107, 47, 188, 255];
  public static readonly brown: [113, 73, 30, 255];
  public static readonly cyan: [56, 255, 221, 255];
  public static readonly lime: [80, 240, 57, 255];
}

class PlayerShadowColors {
  public static readonly red: [122, 8, 56, 255];
  public static readonly blue: [9, 21, 142, 255];
  public static readonly green: [10, 77, 46, 255];
  public static readonly pink: [172, 43, 174, 255];
  public static readonly orange: [180, 62, 21, 255];
  public static readonly yellow: [195, 136, 34, 255];
  public static readonly black: [30, 31, 38, 255];
  public static readonly white: [132, 149, 192, 255];
  public static readonly purple: [59, 23, 124, 255];
  public static readonly brown: [94, 38, 21, 255];
  public static readonly cyan: [36, 169, 191, 255];
  public static readonly lime: [21, 168, 66, 255];
}

export class Palette {
  public static readonly disabledGrey = [76, 76, 76, 255];
  public static readonly disabledColor = [255, 255, 255, 76];
  public static readonly enabledColor = [255, 255, 255, 255];
  public static readonly black = [0, 0, 0, 255];
  public static readonly clearWhite = [255, 255, 255, 0];
  public static readonly halfWhite = [255, 255, 255, 127];
  public static readonly white = [255, 255, 255, 255];
  public static readonly lightblue = [127, 127, 255, 255];
  public static readonly blue = [51, 51, 255, 255];
  public static readonly orange = [255, 153, 0.005, 255];
  public static readonly purple = [153, 25, 153, 255];
  public static readonly brown = [183, 109, 28, 255];
  public static readonly crewmateblue = [140, 255, 255, 255];
  public static readonly impostorred = [255, 25, 25, 255];

  public static readonly playerColors = PlayerColors;

  public static readonly playerShadowColors = PlayerShadowColors;

  public static readonly visorColor = [149, 202, 220, 255];
}
