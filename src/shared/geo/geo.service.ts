import { Injectable } from '@nestjs/common';
import geoip from 'geoip-lite';
import type { GeoLocation } from './interfaces';

/**
 * Resolves approximate geographic location from an IP address.
 *
 * Backed by `geoip-lite`'s bundled offline database, so lookups are
 * synchronous and never leave the process (no third-party API calls,
 * no added request latency). Accuracy is city-level at best and can be
 * off for VPNs, mobile carriers, or corporate NAT ranges.
 */
@Injectable()
export class GeoService {
  /**
   * Looks up the approximate location for an IP address.
   *
   * @param ip - Client IP address; `null`/`"unknown"` and private/loopback
   *             ranges (no entry in the offline database) resolve to `null`.
   * @returns A {@link GeoLocation}, or `null` when the IP can't be resolved.
   */
  lookup(ip: string | null): GeoLocation | null {
    if (!ip || ip === 'unknown') return null;

    const result = geoip.lookup(ip);
    if (!result) return null;

    return {
      country: result.country || null,
      region: result.region || null,
      city: result.city || null,
      timezone: result.timezone || null,
      latitude: result.ll?.[0] ?? null,
      longitude: result.ll?.[1] ?? null,
    };
  }
}
