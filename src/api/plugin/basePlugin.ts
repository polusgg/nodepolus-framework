import { PluginMetadata } from "./pluginMetadata";
import { Logger } from "../../logger";
import { Server } from "../../server";
import { PluginAuthor } from ".";

declare const server: Server;

/**
 * The base class for a NodePolus plugin.
 */
export abstract class BasePlugin<ConfigSchema = Record<string, unknown>> {
  protected readonly server: Server;
  protected readonly logger: Logger;

  /**
   * If your plugin allows customization via config values, you can access the
   * config by adding a constructor paramater and passing it into the `super`
   * constructor.
   *
   * @example
   * ```
   * type MyPluginConfigSchema = {
   *   "someNumber": number,
   * };
   *
   * const defaultConfig: MyPluginConfigSchema = {
   *   "someNumber": 42,
   * }
   *
   * class MyPlugin extends BasePlugin<MyPluginConfigSchema> {
   *   constructor(config: MyPluginConfigSchema) {
   *     super(
   *       {
   *         name: "My Plugin",
   *         version: [1, 0, 0],
   *       },
   *       defaultConfig,
   *       config,
   *     );
   *   }
   * }
   * ```
   *
   * @param pluginMetadata - The metadata for the plugin
   * @param defaultConfig - The default config for the plugin
   * @param config - The config for the plugin
   */
  constructor(
    protected readonly pluginMetadata: PluginMetadata,
    protected readonly defaultConfig?: ConfigSchema,
    protected readonly config?: ConfigSchema,
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
