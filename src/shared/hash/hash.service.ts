/* eslint-disable @typescript-eslint/no-unused-vars */
import { HASH_ENCODING_FORMAT, HASH_KEY_LENGTH, HASH_SALT_BYTE_SIZE } from '@/common/constants';
import { Injectable } from '@nestjs/common';
import { scrypt as _scrypt, createHash, randomBytes } from 'crypto';
import { promisify } from 'util';
import { IHashOptions } from './interfaces';

const scryptAsync = promisify(_scrypt);
const DELIM = ':';

@Injectable()
export class HashService {
  private readonly defaultByteSize: number = HASH_SALT_BYTE_SIZE;
  private readonly defaultFormat: BufferEncoding = HASH_ENCODING_FORMAT;
  private readonly defaultKeyLength: number = HASH_KEY_LENGTH;

  async hash(password: string, options: IHashOptions = {}): Promise<string> {
    const byteSize = options.byteSize ?? this.defaultByteSize;
    const format = options.format ?? this.defaultFormat;
    const keyLength = options.keyLength ?? this.defaultKeyLength;

    const salt = randomBytes(byteSize).toString(format);
    const buf = (await scryptAsync(password, salt, keyLength)) as Buffer;

    // store as {derived}:{salt}
    return `${buf.toString(format)}${DELIM}${salt}`;
  }

  async verify(stored: string, supplied: string, options: IHashOptions = {}): Promise<boolean> {
    try {
      const format = options.format ?? this.defaultFormat;
      const keyLength = options.keyLength ?? this.defaultKeyLength;

      // try new delimiter first, fallback to legacy
      const idx = stored.lastIndexOf(DELIM);
      if (idx <= 0) {
        return false;
      }

      const hashed = stored.substring(0, idx);
      const salt = stored.substring(idx + 1);

      const buf = (await scryptAsync(supplied, salt, keyLength)) as Buffer;

      return buf.toString(format) === hashed;
    } catch (err) {
      return false;
    }
  }

  apiKeyHashSecret(secret: string): string {
    return createHash('sha256').update(secret).digest('base64url');
  }
}
