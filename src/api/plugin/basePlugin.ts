import { PluginMetadata } from "./pluginMetadata";
import { Logger } from "../../logger";
import { Server } from "../../server";
import { PluginAuthor } from ".";

declare const server: Server;

/**
 * The base class for a NodePolus plugin.
 */
export abstract class BasePlugin {
  protected readonly server: Server;
  protected readonly logger: Logger;

  /**
   * @param server - The NodePolus server instance
   * @param pluginMetadata - The metadata for the plugin
   */
  constructor(
    protected readonly pluginMetadata: PluginMetadata,
  ) {
    this.server = server;
    this.logger = server.getLogger(this.pluginMetadata.name);
  }

  /**
   * Gets the NodePolus server instance.
   */
  getServer(): Server {
    return this.server;
  }

  /**
   * Gets the plugin's logger.
   */
  getLogger(): Logger {
    return this.logger;
  }

  /**
   * Gets the plugin's name.
   */
  getPluginName(): string {
    return this.pluginMetadata.name;
  }

  /**
   * Gets the plugin's version as an array of numbers.
   *
   * @returns The plugin's version as `[major, minor, patch]`
   */
  getPluginVersion(): [major: number, minor: number, patch: number] {
    return this.pluginMetadata.version;
  }

  /**
   * Gets the plugin's version string.
   *
   * @returns The plugin's version as `"major.minor.patch"`
   */
  getPluginVersionString(): string {
    return this.pluginMetadata.version.join(".");
  }

  /**
   * Gets the plugin's description.
   */
  getPluginDescription(): string {
    return this.pluginMetadata.description ?? "";
  }

  /**
   * Gets the plugin's authors.
   */
  getPluginAuthors(): (PluginAuthor | string)[] {
    return this.pluginMetadata.authors ?? [];
  }

  /**
   * Gets the plugin's website.
   */
  getPluginWebsite(): string {
    return this.pluginMetadata.website ?? "";
  }
}
