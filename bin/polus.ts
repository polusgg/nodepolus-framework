import { ServerConfig } from "../lib/api/config/serverConfig";
import { Plugin } from "../lib/api/plugin";
import { Logger } from "../lib/logger";
import { Server } from "../lib/server";
import path from "path";
import fs from "fs";

const logger = new Logger("NodePolus", "info");

Error.stackTraceLimit = 25;

logger.info("Starting NodePolus");
logger.info("Loading config.json");

const serverConfig: ServerConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf-8"));

declare const server: Server;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).server = new Server(serverConfig);

logger.info("Loading plugins");

const pathToPlugins = path.join(__dirname, "./plugins/");
const pluginDirectories = fs.readdirSync(pathToPlugins);
const plugins: Plugin[] = [];

for (let i = 0; i < pluginDirectories.length; i++) {
  const pathToPlugin = path.join(pathToPlugins, pluginDirectories[i]);

  if (path.extname(pathToPlugin).toLowerCase() !== ".npplugin") {
    logger.warn(`Skipping folder "${pluginDirectories[i]}" as it does not end with ".npplugin"`);

    continue;
  }

  logger.info(`Loading ${path.basename(pathToPlugin)}`);

  const plugin: Plugin = {
    folder: pluginDirectories[i],
    metadata: JSON.parse(fs.readFileSync(path.join(pathToPlugin, "plugin.json"), "utf-8")),
    entrypoint: import(path.join(pathToPlugin, "index")),
  };

  plugins.push(plugin);
  logger.info(`Loaded plugin: ${plugin.metadata.name} v${plugin.metadata.version.join(".")}`);
}

server.listen().then(() => {
  logger.info(`Server listening on ${server.getAddress()}:${server.getPort()}`);

  server.emit("server.ready");
});

process.on("uncaughtException", err => {
  logger.catch(err);
});

process.on("unhandledRejection", (event: PromiseRejectionEvent) => {
  logger.catch(event.reason instanceof Error ? event.reason : new Error(event.reason));
});
