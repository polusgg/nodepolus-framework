import { NodePolusConfig } from "../lib/api/serverConfig";
import { NodePolusPlugin } from "../lib/api/plugin";
import { Server } from "../lib/api/server";
import path from "path";
import fs from "fs";

Error.stackTraceLimit = 25;

declare const server: Server;

console.log("Starting NodePolus");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).server = new Server();

console.log("Loading config.json");

const serverConfig: NodePolusConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf-8"));

console.log("Loading plugins");

const pathToPlugins = path.join(__dirname, "./plugins/");
const pluginDirectories = fs.readdirSync(pathToPlugins);
const plugins: NodePolusPlugin[] = [];

for (let i = 0; i < pluginDirectories.length; i++) {
  const pathToPlugin = path.join(pathToPlugins, pluginDirectories[i]);

  if (path.extname(pathToPlugin).toLowerCase() !== ".npplugin") {
    console.warn(`Skipping folder "${pluginDirectories[i]}" as it does not end with ".npplugin"`);

    continue;
  }

  console.log(`Loading ${path.basename(pathToPlugin)}`);

  const plugin: NodePolusPlugin = {
    folder: pluginDirectories[i],
    metadata: JSON.parse(fs.readFileSync(path.join(pathToPlugin, "plugin.json"), "utf-8")),
    entrypoint: import(path.join(pathToPlugin, "index")),
  };

  plugins.push(plugin);
  console.log(`Loaded plugin: ${plugin.metadata.name} v${plugin.metadata.version.join(".")}`);
}

server.listen(serverConfig.port).then(() => {
  console.log(`Server listening on port ${serverConfig.port}`);
});

process.on("uncaughtException", err => {
  console.log(err);
});
