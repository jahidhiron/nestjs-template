/**
 * Shape of the JSON value stored in Redis for a one-time verification token.
 * Keyed by `verification-token:{type}:{userId}` with a TTL of `EXPIRED_AFTER_MINUTES`.
 */
export interface VerificationTokenRecord {
  token: string;
  email: string;
  ip: string | null;
}
