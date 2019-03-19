interface VerifiedToken {
  delta: number;
}

/**
 * Generates a 32-character (160-bit) base32 private key
 */
export function generateKey(): string;

/**
 * Generates a 6-digit (20-bit) decimal time-based token
 * @param key Private key
 */
export function generateToken(key: string): string;

 /**
 * Validates a time-based token within a +/- 30 second (90 seconds) window.
 * Returns `null` on failure or an object such as `{ delta: 0 }` on success
 * @param key Private key
 * @param token TOTP token
 * @returns `VerifiedToken` object on success, `null` on failure
 */
export function verifyToken(key: string, token: string): VerifiedToken | null;

/**
 * generates an `OTPAUTH://` scheme URI for QR Code generation
 * @param secret User's private key
 * @param accountName User's username/email
 * @param issuer (Optional) Provider name where the 2FA/MFA auth is implemented. Default: empty
 * @param algorithm (Optional) Algorithm being used. Default: `SHA1`
 * @param digits (Optional) Amount of digits that the TOTP tokens will have. Default: `6`
 * @param period (Optional) Time duration (in seconds) of a TOTP token. Default: `30`
 */
export function generateTotpUri(secret: string, accountName: string, issuer?: string, algo?: string, digits?: number, period?: number): string;
