import crypto from "crypto";

/**
 * A helper class used to sign and verify messages using an HMAC SHA1 hash.
 */
export class Hmac {
  /**
   * Gets the hash for the given message using the given secret.
   *
   * @param message - The message to be hashed
   * @param secret - The secret used when hashing
   * @returns The hash of `message`
   */
  static sign(message: string, secret: string): string {
    return crypto.createHmac("sha1", secret).update(message).digest("hex");
  }

  /**
   * Gets whether or not the given hash is valid using the given secret and
   * source message.
   *
   * @param message - The source message being verified
   * @param hash - The hash of the message
   * @param secret - The secret used to verify the message
   */
  static verify(message: string, hash: string, secret: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(Hmac.sign(message, secret), "hex"),
    );
  }
}
