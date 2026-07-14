import { ModuleName } from '@/common/base/enums';
import { ActivityLogService } from '@/modules/activity-log/activity-log.service';
import { SystemLog } from '@/modules/activity-log/decorators';
import { LogStatus } from '@/modules/activity-log/enums';
import { AuthAction } from '@/modules/auth/enums/auth-action.enum';
import { TokenType } from '@/modules/auth/enums';
import type { VerificationTokenPayload } from '@/modules/auth/interfaces';
import type { VerificationTokenRecord } from '@/modules/auth/providers/interfaces';
import { UserService } from '@/modules/users/user.service';
import { RedisService } from '@/shared/redis/redis.service';
import { ErrorResponse } from '@/shared/response';
import { Injectable, Scope } from '@nestjs/common';

/**
 * Validates and consumes a one-time verification token.
 *
 * Shared by `VerifyEmailProvider` and `ResetPasswordProvider`. For `VerifyEmail`
 * tokens, rejects up front if the user is already verified, before touching
 * Redis. Otherwise looks up the Redis-stored token record by `(userId, type)`
 * and atomically deletes it via `GETDEL`, so a token can be consumed at most
 * once — a replay (or an expired key that Redis has already dropped) finds
 * nothing and is rejected.
 */
@Injectable({ scope: Scope.REQUEST })
export class VerifyTokenProvider {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly errorResponse: ErrorResponse,
    private readonly activityLog: ActivityLogService,
  ) {}

  /**
   * Validates and consumes a one-time verification token.
   *
   * Steps:
   * 1. **User lookup** — resolves the user by email; throws 404 if not found.
   * 2. **Already-verified guard** — for `VerifyEmail` tokens, rejects before
   *    touching Redis if the email is already verified, so an already-consumed
   *    link doesn't burn a still-valid token.
   * 3. **Token consume** — atomically reads and deletes the Redis record for
   *    `(userId, type)` via `GETDEL`; rejects if the key is missing (never
   *    issued, already consumed, or expired) or the token value doesn't match.
   *
   * @param payload - Token verification input containing `email`, `token`, and `type`.
   * @returns The {@link User} that owns the token.
   * @throws {NotFoundException}   When no user exists for the given email.
   * @throws {ConflictException}   When a `VerifyEmail` token is used for an already-verified user.
   * @throws {BadRequestException} On missing, expired, already-consumed, or mismatched token.
   */
  @SystemLog(ModuleName.Auth)
  async execute(payload: VerificationTokenPayload) {
    const { user } = await this.userService.findOne({ email: payload.email });

    if (payload.type === TokenType.VerifyEmail && user.emailVerified) {
      this.activityLog.logUser({
        action: AuthAction.VerifyEmailFailed,
        status: LogStatus.Failed,
        userId: user.id,
        metadata: { email: payload.email, reason: 'already-verified' },
      });
      await this.errorResponse.conflict({ module: ModuleName.Auth, key: 'user-already-verified' });
    }

    const record = await this.redisService.getdel<VerificationTokenRecord>(
      `verification-token:${payload.type}:${user.id}`,
    );

    if (!record || record.token !== payload.token) {
      await this.errorResponse.badRequest({ module: ModuleName.Auth, key: 'invalid-token' });
    }

    return user;
  }
}
