/**
 * A class used to store, encode, and decode Among Us client versions.
 */
export class ClientVersion {
  /**
   * @param year - The version's year part
   * @param month - The version's month part
   * @param day - The version's day part
   * @param revision - The version's revision part (default `0`)
   */
  constructor(
    protected readonly year: number,
    protected readonly month: number,
    protected readonly day: number,
    protected readonly revision: number = 0,
  ) {}

  /**
   * Gets a new ClientVersion by decoding the given encoded integer value.
   *
   * @param version - The encoded integer value
   */
  static decode(version: number): ClientVersion {
    return new ClientVersion(
      Math.floor(version / 25000),
      Math.floor((version %= 25000) / 1800),
      Math.floor((version %= 1800) / 50),
      version % 50,
    );
  }

  /**
   * Gets the version's year part.
   */
  getYear(): number {
    return this.year;
  }

  /**
   * Gets the version's month part.
   */
  getMonth(): number {
    return this.month;
  }

  /**
   * Gets the version's day part.
   */
  getDay(): number {
    return this.day;
  }

  /**
   * Gets the version's revision part.
   */
  getRevision(): number {
    return this.revision;
  }

  /**
   * Gets the encoded integer value of the ClientVersion.
   */
  encode(): number {
    return (this.year * 25000) + (this.month * 1800) + (this.day * 50) + this.revision;
  }

  /**
   * Gets whether or not the ClientVersion is equal to the given ClientVersion
   * by comparing each property.
   *
   * @param other - The ClientVersion to be checked against
   * @param checkRevision - `true` if the revision number should also be checked, `false` to disregard it
   * @returns `true` if the two are equal, `false` if not
   */
  equals(other: ClientVersion, checkRevision: boolean = true): boolean {
    return (
      this.year == other.year &&
      this.month == other.month &&
      this.day == other.day &&
      (checkRevision ? this.revision == other.revision : true)
    );
  }

  /**
   * Gets a clone of the ClientVersion instance.
   */
  clone(): ClientVersion {
    return new ClientVersion(this.year, this.month, this.day, this.revision);
  }
}
