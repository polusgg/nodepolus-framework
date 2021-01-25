import { Connection } from "../protocol/connection";
import { TextComponent } from "../api/text";
import { InternalPlayer } from "../player";
import { InternalLobby } from "../lobby";
import { Vector2 } from "../types";
import winston from "winston";

const levelNames = ["fatal", "error", "warn", "info", "verbose", "debug", "trace"];

/**
 * All available log levels.
 */
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

const prettyPrint = winston.format((info: winston.Logform.TransformableInfo, _opts?: unknown): winston.Logform.TransformableInfo | boolean => {
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

          splat[i] = `[x=${v.getX()}, y=${v.getY()}]`;
        } else if (item instanceof TextComponent) {
          splat[i] = (item as TextComponent).toString();
        }
        break;
    }
  }

  info.splat = splat;

  return info;
});

/**
 * A class for logging to the console and an optional file.
 *
 * Logs will be saved in the `logs` folder within the server's root folder.
 */
export class Logger {
  private readonly winston: winston.Logger;

  /**
   * @param logger The name of the logger if it is a `string`, otherwise the parent logger when creating a child instance
   * @param displayLevel The maximum log level to be logged
   * @param filename The name of the log file
   * @param maxFileSizeInBytes The maximum size of the log file in bytes before it is rotated
   * @param maxFiles The maximum number of log files to keep before old logs are pruned
   */
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

      if (process.env.NP_DISABLE_COLORS === undefined) {
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

  /**
   * Gets whether or not the given log level is suppoprted.
   *
   * @param level The level to check
   * @returns `true` if `level` is supported, `false` if not
   */
  static isValidLevel(level?: string): level is LogLevel {
    return level === undefined ? false : levelNames.includes(level);
  }

  /**
   * Creates child logger of a different name with the same configuration.
   *
   * @param label The name of the child logger
   */
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

  /**
   * Logs a fatal error message.
   *
   * @example
   * ```
   * someVar = true;
   * log.fatal("Unexpected value: %s", someVar); // => "Unexpected value: true"
   * ```
   *
   * @param message The message to be logged
   * @param splat The variables for string interpolation within `message`
   */
  fatal(message: string, ...splat: unknown[]): void {
    this.log("fatal", message, {}, ...splat);
  }

  /**
   * Logs an error message.
   *
   * @example
   * ```
   * someVar = true;
   * log.error("Unexpected value: %s", someVar); // => "Unexpected value: true"
   * ```
   *
   * @param message The message to be logged
   * @param splat The variables for string interpolation within `message`
   */
  error(message: string, ...splat: unknown[]): void {
    this.log("error", message, {}, ...splat);
  }

  /**
   * Logs a warning message.
   *
   * @example
   * ```
   * someVar = true;
   * log.warn("Unexpected value: %s", someVar); // => "Unexpected value: true"
   * ```
   *
   * @param message The message to be logged
   * @param splat The variables for string interpolation within `message`
   */
  warn(message: string, ...splat: unknown[]): void {
    this.log("warn", message, {}, ...splat);
  }

  /**
   * Logs an info message.
   *
   * @example
   * ```
   * someVar = true;
   * log.info("Some value: %s", someVar); // => "Some value: true"
   * ```
   *
   * @param message The message to be logged
   * @param splat The variables for string interpolation within `message`
   */
  info(message: string, ...splat: unknown[]): void {
    this.log("info", message, {}, ...splat);
  }

  /**
   * Logs a verbose message.
   *
   * @example
   * ```
   * someVar = true;
   * log.verbose("Some value: %s", someVar); // => "Some value: true"
   * ```
   *
   * @param message The message to be logged
   * @param splat The variables for string interpolation within `message`
   */
  verbose(message: string, ...splat: unknown[]): void {
    this.log("verbose", message, {}, ...splat);
  }

  /**
   * Logs a debug message.
   *
   * @example
   * ```
   * someVar = true;
   * log.debug("Some value: %s", someVar); // => "Some value: true"
   * ```
   *
   * @param message The message to be logged
   * @param splat The variables for string interpolation within `message`
   */
  debug(message: string, ...splat: unknown[]): void {
    this.log("debug", message, {}, ...splat);
  }

  /**
   * Logs a message with a call trace for assistance in debugging.
   *
   * @example
   * ```
   * someVar = true;
   * log.trace("Trace: %s", someVar); // => "Trace: true" + stack trace
   * ```
   *
   * @param message The message to be logged
   * @param splat The variables for string interpolation within `message`
   */
  trace(message: string, ...splat: unknown[]): void {
    this.log("trace", message, { stack: new Error().stack!.split("\n").slice(2, -1).join("\n") }, ...splat);
  }

  /**
   * Logs an uncaught exception as an error with the stack trace.
   *
   * @param error The error to be logged
   */
  catch(error: Error): void {
    this.winston.log("error", { message: error });
  }

  /**
   * Logs a message.
   *
   * @param level The log level for the message
   * @param message The message to be logged
   * @param meta The metadata for the message
   * @param splat The variables for string interpolation within `message`
   */
  log(level: string, message: string, meta: Record<string, unknown>, ...splat: unknown[]): void {
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
