import { PluginAuthor } from ".";

export type PluginMetadata = {
  name: string;
  version: [number, number, number];
  description?: string;
  authors?: (PluginAuthor | string)[];
  website?: string;
};
