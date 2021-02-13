export interface Metadatable {
  /**
   * Gets whether or not the object has metadata for the given key.
   *
   * @param key - The metadata key
   */
  hasMeta(key: string): boolean;

  /**
   * Gets all of the metadata associated with the object.
   */
  getMeta(): Map<string, unknown>;

  /**
   * Gets the metadata for the given key.
   *
   * @typeParam T - The type of the returned metadata (default `unknown`)
   * @param key - The key whose associated metadata will be returned
   * @returns The metadata, or `undefined` if no metadata is associated with `key`
   */
  getMeta<T = unknown>(key: string): T;

  /**
   * Gets the metadata for the given key, or all of the metadata associated
   * with the object.
   *
   * @typeParam T - The type of the returned metadata (default `unknown`)
   * @param key - The key whose associated data will be returned, or `undefined` to return all metadata
   * @returns The metadata, or `undefined` if no metadata is associated with `key`
   */
  getMeta<T = unknown>(key?: string): Map<string, unknown> | T;

  /**
   * Sets the metadata for the given key-value pairs.
   *
   * @param pair - The key-value metadata pairs to be set
   */
  setMeta(pair: Record<string, unknown>): void;
  /**
   * Sets the metadata for the given key.
   *
   * @param key - The key whose metadata will be set
   * @param value - The metadata to be set
   */
  setMeta(key: string, value: unknown): void;
  /**
   * Sets the metadata for the given key or key-value pairs.
   *
   * @param key - The key whose metadata will be set, or the key-value metadata pairs to be set
   * @param value - The metadata to be set if `key` is a `string`
   */
  setMeta(key: string | Record<string, unknown>, value?: unknown): void;

  /**
   * Deletes the metadata for the given key.
   *
   * @param key - The key whose metatada will be deleted
   */
  deleteMeta(key: string): void;

  /**
   * Deletes all metadata associated with the object.
   */
  clearMeta(): void;
}
