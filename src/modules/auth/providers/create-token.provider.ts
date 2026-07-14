import { ModuleName } from '@/common/base/enums';
import { clientIp } from '@/common/utils';
import { SystemLog } from '@/modules/activity-log/decorators';
import { EXPIRED_AFTER_MINUTES } from '@/modules/auth/constants';
import type { TokenPayload } from '@/modules/auth/interfaces';
import type { VerificationTokenRecord } from '@/modules/auth/providers/interfaces';
import { HashService } from '@/shared/hash/hash.service';
import { RedisService } from '@/shared/redis/redis.service';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

/**
 * Issues a new one-time verification token for a user.
 *
 * Stores the token in Redis under a key namespaced by `type` and `userId`,
 * with a TTL of {@link EXPIRED_AFTER_MINUTES}. Writing the key overwrites any
 * previously issued token of the same type for the same user, implicitly
 * invalidating a prior unconsumed token. Redis expires the key on its own,
 * so no cleanup cron is needed.
 */
@Injectable({ scope: Scope.REQUEST })
export class CreateTokenProvider {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly redisService: RedisService,
    private readonly hashService: HashService,
  ) {}

  /**
   * Generates and stores a new one-time token for the given user and type.
   *
   * @param dto - The {@link TokenPayload} carrying the token type and user.
   * @returns The generated 64-character hex token.
   */
  @SystemLog(ModuleName.Auth)
  async execute(dto: TokenPayload): Promise<{ token: string }> {
    const token = this.hashService.generateToken(32);
    const record: VerificationTokenRecord = {
      token,
      email: dto.user.email,
      ip: clientIp(this.request),
    };

    await this.redisService.set(
      `verification-token:${dto.type}:${dto.user.id}`,
      record,
      EXPIRED_AFTER_MINUTES * 60,
    );

    return { token };
  }
}
