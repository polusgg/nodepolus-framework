import { Connection } from "../protocol/connection";
import { TextComponent } from "../api/text";
import { InternalPlayer } from "../player";
import { InternalLobby } from "../lobby";
import { Vector2 } from "../types";
import winston from "winston";

const levelNames = ["fatal", "error", "warn", "info", "verbose", "debug", "trace"];

export type LogLevel = typeof levelNames[number];

const levelIndices: Readonly<{
  [key in LogLevel]: number;
}> = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  verbose: 4,
  debug: 5,
  trace: 6,
};

const levelColors: Readonly<{
  [key in LogLevel]: string;
}> = {
  fatal: "black redBG",
  error: "red",
  warn: "yellow",
  info: "cyan",
  verbose: "white",
  debug: "green",
  trace: "magenta",
};

winston.addColors(levelColors);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prettyPrint = winston.format((info: winston.Logform.TransformableInfo, _opts?: any): winston.Logform.TransformableInfo | boolean => {
  const splat = info.splat ?? [];

  for (let i = 0; i < splat.length; i++) {
    const item = splat[i];

    switch (typeof item) {
      case "number":
      case "bigint":
      case "boolean":
      case "symbol":
      case "undefined":
      case "string":
        break;
      case "function":
        splat[i] = "Function";
        break;
      case "object":
        if (item instanceof Connection) {
          const c = item as Connection;

          splat[i] = `${c.id} (${c.getConnectionInfo().toString()})`;
        } else if (item instanceof InternalPlayer) {
          const p = item as InternalPlayer;

          splat[i] = `${p.getName().toString()} (${p.getId()})`;
        } else if (item instanceof InternalLobby) {
          splat[i] = (item as InternalLobby).getCode();
        } else if (item instanceof Vector2) {
          const v = item as Vector2;

          splat[i] = `[x=${v.x}, y=${v.y}]`;
        } else if (item instanceof TextComponent) {
          splat[i] = (item as TextComponent).toString();
        }
        break;
    }
  }

  info.splat = splat;

  return info;
});

export class Logger {
  private readonly winston: winston.Logger;

  constructor(
    logger: string | winston.Logger,
    private readonly displayLevel: LogLevel,
    private readonly filename?: string,
    private readonly maxFileSizeInBytes: number = 104857600,
    private readonly maxFiles: number = 10,
  ) {
    if (typeof logger != "string") {
      this.winston = logger;
    } else {
      const consoleFormatters = [
        winston.format.errors({ stack: true }),
        winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
        winston.format.label({ label: logger, message: false }),
        prettyPrint(),
        winston.format.splat(),
        winston.format.metadata({ fillExcept: ["timestamp", "name", "label", "level", "message", "stack", "splat", "meta"] }),
        winston.format.printf(info => {
          const extra = (Object.keys(info.metadata).length) ? ` ${JSON.stringify(info.metadata)}` : "";
          const stack = info.stack ? `\n${info.stack}` : "";

          return `${info.timestamp} [${info.name ?? info.label}] ${info.level}: ${info.message}${extra}${stack}`;
        }),
      ];

      if (process.env.NP_DISABLE_COLORS == undefined) {
        consoleFormatters.unshift(winston.format.colorize({ level: true, message: false }));
      }

      const transports: winston.transport[] = [
        new winston.transports.Console({
          consoleWarnLevels: ["warn"],
          stderrLevels: ["error", "fatal"],
          debugStdout: false,
          format: winston.format.combine(...consoleFormatters),
        }),
      ];

      if (filename) {
        transports.push(new winston.transports.File({
          filename: filename,
          dirname: "logs",
          zippedArchive: true,
          maxFiles: maxFiles,
          maxsize: maxFileSizeInBytes,
          eol: "\n",
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
            winston.format.label({ label: logger, message: false }),
            prettyPrint(),
            winston.format.splat(),
            winston.format.json(),
          ),
        }));
      }

      this.winston = winston.createLogger({
        level: displayLevel,
        levels: levelIndices,
        silent: false,
        exitOnError: false,
        handleExceptions: true,
        transports,
      });
    }
  }

  static isValidLevel(level: string): level is LogLevel {
    return levelNames.includes(level);
  }

  child(label: string): Logger {
    const logger = new Logger(
      this.winston.child({}),
      this.displayLevel,
      this.filename,
      this.maxFileSizeInBytes,
      this.maxFiles,
    );

    if (!logger.winston.defaultMeta) {
      logger.winston.defaultMeta = {};
    }

    logger.winston.defaultMeta = {
      name: label,
    };

    return logger;
  }

  fatal(message: string, ...splat: unknown[]): void {
    this.log("fatal", message, {}, ...splat);
  }

  error(message: string, ...splat: unknown[]): void {
    this.log("error", message, {}, ...splat);
  }

  warn(message: string, ...splat: unknown[]): void {
    this.log("warn", message, {}, ...splat);
  }

  info(message: string, ...splat: unknown[]): void {
    this.log("info", message, {}, ...splat);
  }

  verbose(message: string, ...splat: unknown[]): void {
    this.log("verbose", message, {}, ...splat);
  }

  debug(message: string, ...splat: unknown[]): void {
    this.log("debug", message, {}, ...splat);
  }

  trace(message: string, ...splat: unknown[]): void {
    this.log("trace", message, { stack: new Error().stack!.split("\n").slice(2, -1).join("\n") }, ...splat);
  }

  catch(error: Error): void {
    this.winston.log("error", { message: error });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(level: string, message: string, meta: Record<string, unknown>, ...splat: any[]): void {
    const stack = meta.stack ?? undefined;

    delete meta.stack;

    this.winston.log({
      level,
      message,
      meta,
      splat,
      stack,
    });
  }
}
