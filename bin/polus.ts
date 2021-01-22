import { AnnouncementServer } from "../lib/announcementServer";
import { ServerConfig } from "../lib/api/config/serverConfig";
import { Plugin } from "../lib/api/plugin";
import { Logger } from "../lib/logger";
import { Server } from "../lib/server";
import fs from "fs/promises";
import path from "path";

declare const server: Server;
declare const announcementServer: AnnouncementServer | undefined;

(async (): Promise<void> => {
  const logger = new Logger("NodePolus", "info");

  Error.stackTraceLimit = 25;

  logger.info("Starting NodePolus");
  logger.info("Loading config.json");

  try {
    const serverConfig: ServerConfig = JSON.parse(await fs.readFile(path.join(__dirname, "config.json"), "utf-8"));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).server = new Server(serverConfig);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).announcementServer = (serverConfig.enableAnnouncementServer ?? false)
      ? new AnnouncementServer(server.getAddress(), server.getLogger("Announcements"))
      : undefined;

    logger.info("Loading plugins");

    const pathToPlugins = path.join(__dirname, "./plugins/");
    const pluginDirectories = await fs.readdir(pathToPlugins);
    const plugins: Plugin[] = [];

    for (let i = 0; i < pluginDirectories.length; i++) {
      const pathToPlugin = path.join(pathToPlugins, pluginDirectories[i]);

      if (path.extname(pathToPlugin).toLowerCase() !== ".npplugin") {
        logger.warn(`Skipping folder "${pluginDirectories[i]}" as it does not end with ".npplugin"`);

        continue;
      }

      logger.debug(`Loading ${path.basename(pathToPlugin)}`);

      const plugin: Plugin = {
        folder: pluginDirectories[i],
        metadata: JSON.parse(await fs.readFile(path.join(pathToPlugin, "plugin.json"), "utf-8")),
      };

      await import(path.join(pathToPlugin, "index"));

      plugins.push(plugin);
      logger.info(`Loaded plugin: ${plugin.metadata.name} v${plugin.metadata.version.join(".")}`);
    }

    server.listen().then(() => {
      logger.info(`Server listening on ${server.getAddress()}:${server.getPort()}`);
    });

    if (announcementServer) {
      announcementServer.listen().then(() => {
        logger.info(`Announcement server listening on ${announcementServer.getAddress()}:${announcementServer.getPort()}`);
      });
    }

    process.on("uncaughtException", err => {
      logger.catch(err);
    });

    // process.on("unhandledRejection", (event: PromiseRejectionEvent) => {
    //   logger.catch(event.reason instanceof Error ? event.reason : new Error(event.reason));
    // });
  } catch (error) {
    logger.catch(error);

    process.exit(1);
  }
})();
