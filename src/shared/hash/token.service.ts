import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import { GeneratedApiKey } from "./interfaces";

@Injectable()
export class TokenService {
  /**
   * Generate a secure random token string
   * @param length length of token string in bytes (default 32 bytes = 64 hex chars)
   */
  generateToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }

  generateApiKey(): GeneratedApiKey {
    const secret = crypto.randomBytes(32).toString("base64url");
    const hash = crypto.createHash("sha256").update(secret).digest("base64url");
    const fingerprint = secret.slice(-6);

    return { secret, hash, fingerprint };
  }
}
