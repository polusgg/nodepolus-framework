import { Text, ElementType } from "../api/text";
import style from "ansi-styles";
import { Player } from "../api/player";

export class Logger {
  constructor(public readonly name: string) {}

  log(logElements: any[]): void {
    for (let i = 0; i < logElements.length; i++) {
      const element = logElements[i];

      switch (typeof element) {
        case "bigint":
        case "number":
          break;
        case "string":
          this.print(element);
          break;
        case "boolean":
          break;
        case "function":
          break;
        case "object":
          switch (true) {
            case element instanceof Text:
              this.printRich(element);
              break;
            case element instanceof Player:
              
          }
          break;
        case "undefined":
          break;
        case "symbol":
          break;
      }
    }
  }

  private printRich(text: Text): void {
    text.elements.forEach(element => {
      switch (element.type) {
        case ElementType.Text:
          //TODO: Fetch background color, and use it
          //      for simulated opacity
          this.print(style.color.ansi16m.rgb(...element.color));
          this.print(element.content);
          this.print(style.color.close);
          break;
        case ElementType.Link:
          this.print(style.color.ansi16m.hex("cacaff"));
          this.print(`["`);
          this.print(style.color.close);
          this.print(style.color.ansi16m.hex("7f7fff"));
          this.print(element.content);
          this.print(style.color.close);
          this.print(style.color.ansi16m.hex("cacaff"));
          this.print(`" => `);
          this.print(style.color.close);
          this.print(style.color.ansi16m.hex("7f7fff"));
          this.print(element.link.toString());
          this.print(style.color.close);
          this.print(style.color.ansi16m.hex("cacaff"));
          this.print(`]`);
          this.print(style.color.close);
          break;
        case ElementType.Reset:
          break;
      }
    });
  }

  private print(text: string): void {
    //TODO: don't print if log level is not current log level,
    //      passed in with --LogLevel= CLI option
    process.stdout.write(text);
  }
}
