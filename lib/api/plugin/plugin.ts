import { PluginMetadata } from ".";

/**
 * A type used to describe a loaded NodePolus plugin.
 */
export type Plugin = {
  /**
   * The path to the plugin.
   */
  folder: string;
  /**
   * The plugin's metadata.
   */
  metadata: PluginMetadata;
};
