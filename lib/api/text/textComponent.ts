import { LinkElement, Reader, ResetElement, TextElement } from "./types";
import { ReaderState, ElementType } from "./types/enums";

function colorToString(color: [number, number, number, number]): string {
  return color.map(channel => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function stringToColor(str: string): [number, number, number, number] {
  str = str.padStart(8, "0");

  const color: [number, number, number, number] = [-1, -1, -1, -1];

  for (let i = 0; i < str.length; i += 2) {
    color[i / 2] = parseInt(str[i] + str[i + 1], 16);
  }

  return color;
}

export class TextComponent {
  public readonly elements: (TextElement | LinkElement | ResetElement)[] = [];

  private currentColor: [number, number, number] = [255, 255, 255];
  private currentOpacity = 255;

  static from(source: string): TextComponent {
    const text = new TextComponent();

    const reader: Reader = {
      state: ReaderState.ReadingText,
      chunk: "",
      element: "",
    };

    for (let i = 0; i < source.length; i++) {
      const char = source[i];

      if (reader.state == ReaderState.ReadingText) {
        if (char == "[") {
          reader.element = reader.element.slice(1);

          text.addReader(reader);

          reader.state = ReaderState.ReadingElement;
          reader.element = "";
          reader.chunk = "";
        } else {
          reader.chunk += char;
        }
      }

      if (reader.state == ReaderState.ReadingElement) {
        if (char == "]") {
          reader.state = ReaderState.ReadingText;
        } else {
          reader.element += char;
        }

        continue;
      }
    }

    reader.element = reader.element.slice(1);

    text.addReader(reader);

    return text;
  }

  add(content: string): TextComponent {
    this.elements.push({
      type: ElementType.Text,
      content: content.split("[").join("[["),
      color: this.currentColor,
      opacity: this.currentOpacity,
    });

    return this;
  }

  setColor(red: number, green: number, blue: number): TextComponent {
    this.currentColor = [red, green, blue];

    return this;
  }

  setOpacity(opacity: number): TextComponent {
    this.currentOpacity = opacity;

    return this;
  }

  reset(): TextComponent {
    this.currentColor = [255, 255, 255];
    this.currentOpacity = 255;

    this.elements.push({ type: ElementType.Reset });

    return this;
  }

  link(content: string, link: URL | string): TextComponent {
    if (link instanceof URL) {
      this.elements.push({ type: ElementType.Link, content, link: link.toString() });
    } else {
      if (link[0] !== "h") {
        throw new Error(`Links must start with a lowercase "h" (e.g. "http" or "https")`);
      }

      this.elements.push({ type: ElementType.Link, content, link });
    }

    return this;
  }

  toString(): string {
    let accumulator = "";
    let lastStringColor = "FFFFFFFF";

    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i];

      if (element.type == ElementType.Link) {
        lastStringColor = "FFFFFFFF";
        accumulator += `[${element.link}]${element.content}`;
      }

      if (element.type == ElementType.Text) {
        if (this.elements[i - 1] && this.elements[i - 1].type == ElementType.Link) {
          lastStringColor = "FFFFFFFF";
          accumulator += "[]";
        }

        const stringColor = colorToString([...element.color, element.opacity] as [number, number, number, number]);

        if (stringColor != lastStringColor) {
          accumulator += `[${stringColor}]${element.content}`;
        } else {
          accumulator += element.content;
        }

        lastStringColor = stringColor;
      }

      if (element.type == ElementType.Reset && lastStringColor != "FFFFFFFF") {
        lastStringColor = "FFFFFFFF";
        accumulator += "[]";
      }
    }

    return accumulator;
  }

  private addReader(reader: Reader): void {
    if (reader.element.length == 0) {
      if (this.elements.length != 0) {
        this.reset();
      }

      this.add(reader.chunk);
    } else if (reader.element[0] === "h") {
      this.link(reader.chunk, reader.element);
    } else if ((/^[0-9A-F]{1,8}$/gm).test(reader.element)) {
      const [r, g, b, a] = stringToColor(reader.element);

      this.setColor(r, g, b)
        .setOpacity(a)
        .add(reader.chunk);
    }
  }
}

