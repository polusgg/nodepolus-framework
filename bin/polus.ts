console.log("Loading NP...");

Error.stackTraceLimit = 25;

import fs from "fs";
import path from "path";
import { Server } from "../lib/api/server";

declare const server: Server;

declare interface IPluginMetadata {
  version: [number, number, number];
}

declare interface IPlugin {
  filename: string;
  pluginMetadata: IPluginMetadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any;
}

declare interface IConfig {
  port: number;
  disabledCredits: boolean | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global;
const serverConfig: IConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "./config.json"), "utf-8"));

globalAny.server = new Server();

const pluginDirectories = fs.readdirSync(path.join(__dirname, "./plugins/"));
const plugins: IPlugin[] = [];

for (let i = 0; i < pluginDirectories.length; i++) {
  const directory = path.join(__dirname, "./plugins/", pluginDirectories[i]);
  const dirSplitByPeriod = directory.split(".");
  const fileType = dirSplitByPeriod[dirSplitByPeriod.length - 1];

  if (fileType.toLowerCase() !== "npplugin") {
    throw new Error(`A non-plugin file is in the plugin directory: ${pluginDirectories[i]}`);
  }

  plugins.push({
    filename: pluginDirectories[i],
    pluginMetadata: JSON.parse(fs.readFileSync(path.join(__dirname, "./plugins/", pluginDirectories[i], "plugin.json"), "utf-8")),
    module: import(path.join(__dirname, "./plugins/", pluginDirectories[i], "/index")),
  });
}

if (!serverConfig.disabledCredits) {
  import("./devCredits");
}

server.listen(serverConfig.port).then(() => {
  console.log(`Server listening on UDP port ${serverConfig.port}`);
});
