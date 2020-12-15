import { Text, ElementType } from "../api/text";
import style from "ansi-styles";
import { Player } from "../api/player";
import { Vector2 } from "../util/vector2";

export class Logger {
  constructor(public readonly name: string) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(...logElements: any[]): void {
    for (let i = 0; i < logElements.length; i++) {
      const element = logElements[i];

      switch (typeof element) {
        case "bigint":
        case "number":
          this.startColor("6aa84f");
          this.print("[");
          this.endColor();
          this.startColor("d9ead3");
          this.print(element.toString());
          this.endColor();
          this.startColor("6aa84f");

          if (typeof element == "bigint") {
            this.print("n");
          }

          this.print("]");
          this.endColor();
          break;
        case "string":
          this.print(element);
          break;
        case "boolean":
          this.startColor("e69138");
          this.print("[");
          this.endColor();
          this.startColor("fff2cc");
          this.print(element ? "True" : "False");
          this.endColor();
          this.startColor("e69138");
          this.print("]");
          this.endColor();
          break;
        case "function":
          throw new Error("Cannot log Functions yet.");
          break;
        case "object":
          switch (true) {
            case element instanceof Text:
              this.printRich(element);
              break;
            case element instanceof Player:
              this.printPlayer(element);
              break;
            case element instanceof Vector2:
              this.printVector2(element);
              break;
            default:
              this.print(element.toString());
          }
          break;
        case "undefined":
          this.startColor("666666");
          this.print("[");
          this.endColor();
          this.startColor("b7b7b7");
          this.print("undefined");
          this.endColor();
          this.startColor("666666");
          this.print("]");
          this.endColor();
          break;
        case "symbol":
          throw new Error("Cannot log Symbols yet.");
          break;
      }
    }
    this.print("\n");
  }

  private printVector2(vector2: Vector2): void {
    this.startColor("6aa84f");
    this.print("[X: ");
    this.endColor();
    this.startColor("d9ead3");

    if (vector2.x >= 0) {
      this.print("+");
    }

    this.print(vector2.x.toFixed(5));
    this.endColor();
    this.startColor("6aa84f");
    this.print(", Y: ");
    this.endColor();
    this.startColor("d9ead3");

    if (vector2.y >= 0) {
      this.print("+");
    }

    this.print(vector2.y.toFixed(5));
    this.endColor();
    this.startColor("6aa84f");
    this.print("]");
    this.endColor();
  }

  private printPlayer(player: Player): void {
    this.startColor("7f7fff");
    this.print("[");
    this.endColor();
    this.startColor("cacaff");
    this.print((player.playerId ?? "X").toString());
    this.endColor();
    this.startColor("7f7fff");
    this.print("-");
    this.endColor();
    this.startColor("cacaff");
    this.print(player.clientId.toString());
    this.endColor();
    this.startColor("7f7fff");
    this.print(" (");
    this.endColor();

    if (player.playerId !== undefined) {
      this.printRich(player.name);
    } else {
      this.startColor("cacaff");
      this.print("Awaiting Name");
      this.endColor();
    }

    this.startColor("7f7fff");
    this.print(")]");
    this.endColor();
  }

  private printRich(text: Text): void {
    text.elements.forEach(element => {
      switch (element.type) {
        case ElementType.Text:
          //TODO: Fetch background color, and use it
          //      for simulated opacity
          this.startColor(...element.color);
          this.print(element.content);
          this.endColor();
          break;
        case ElementType.Link:
          this.startColor("cacaff");
          this.print(`["`);
          this.endColor();
          this.startColor("7f7fff");
          this.print(element.content);
          this.endColor();
          this.startColor("cacaff");
          this.print(`" => `);
          this.startColor("7f7fff");
          this.print(element.link.toString());
          this.endColor();
          this.startColor("cacaff");
          this.print(`]`);
          this.endColor();
          break;
        case ElementType.Reset:
          break;
      }
    });
  }

  private endColor(): void {
    this.print(style.color.close);
  }

  private startColor(hex: string): void
  private startColor(r: number, b: number, g: number): void
  private startColor(r: number | string, b?: number, g?: number): void {
    if (typeof r == "string") {
      this.print(style.color.ansi16m.hex(r));
    } else {
      this.print(style.color.ansi16m.rgb(r, b!, g!));
    }
  }

  private print(text: string): void {
    //TODO: don't print if log level is not current log level,
    //      passed in with --LogLevel= CLI option
    process.stdout.write(text);
  }
}
