enum ElementType {
  Text,
  Link,
  Reset,
}

enum ReaderState {
  ReadingText,
  ReadingElement,
}

interface Reader {
  state: ReaderState;
  chunk: string;
  element: string;
}

interface TextElement {
  type: ElementType.Text;
  content: string;
  color: [number, number, number];
  opacity: number;
}

interface LinkElement {
  type: ElementType.Link;
  content: string;
  link: string;
}

interface ResetElement {
  type: ElementType.Reset;
}

function colorToString(color: [number, number, number, number]): string {
  return color.map(c => c.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function stringToColor(string: string): [number, number, number, number] {
  string = string.padStart(8, "0");

  const retarr: [number, number, number, number] = [-1, -1, -1, -1];

  for (let i = 0; i < string.length; i += 2) {
    retarr[i / 2] = parseInt(string[i] + string[i + 1], 16);
  }

  return retarr;
}

export class Text {
  public readonly elements: (TextElement | LinkElement | ResetElement)[] = [];

  private currentColor: [number, number, number] = [255, 255, 255];
  private currentOpacity = 255;

  static from(source: string): Text {
    const t = new Text();

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
          t.addReader(reader);
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

    t.addReader(reader);

    return t;
  }

  add(content: string): Text {
    this.elements.push({
      type: ElementType.Text,
      content,
      color: this.currentColor,
      opacity: this.currentOpacity,
    });

    return this;
  }

  setColor(red: number, green: number, blue: number): Text {
    this.currentColor = [red, green, blue];

    return this;
  }

  setOpacity(opacity: number): Text {
    this.currentOpacity = opacity;

    return this;
  }

  reset(): Text {
    this.currentColor = [255, 255, 255];
    this.currentOpacity = 255;
    this.elements.push({ type: ElementType.Reset });

    return this;
  }

  link(content: string, link: URL | string): Text {
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

        const stringColor = colorToString([...element.color, element.opacity]);

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
      const color = stringToColor(reader.element);

      this.setColor(color[0], color[1], color[2]);
      this.setOpacity(color[3]);

      this.add(reader.chunk);
    }
  }
}

