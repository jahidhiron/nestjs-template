import { ModuleName } from '@/common/base/enums';
import type { SendEmailParams } from '@/shared/mail/interfaces';
import type { NewDeviceEmailData, NewDeviceEmailOptions } from './interfaces';

/**
 * Builds the {@link SendEmailParams} for the new-device sign-in alert email.
 *
 * The `signedInAt` timestamp is captured at build time so it reflects the
 * moment the alert is triggered, not when the email is eventually delivered.
 *
 * @param data    - Recipient details and device metadata.
 * @param options - Config primitives required to compose the subject.
 * @returns       Fully assembled {@link SendEmailParams} ready for `MailService.sendEmail`.
 */
export function buildNewDeviceEmail(data: NewDeviceEmailData, options: NewDeviceEmailOptions): SendEmailParams {
  return {
    module: ModuleName.Auth,
    template: 'new-device',
    to: data.email,
    subject: `New sign-in to your ${options.companyName} account`,
    context: {
      name: data.name,
      signedInAt: new Date().toUTCString(),
      ip: data.ip,
      userAgent: data.userAgent,
      location: formatLocation(data.location),
    },
  };
}

/**
 * Formats a resolved location as a `"City, Region, Country"` string for
 * display in the alert email, omitting parts that couldn't be resolved.
 *
 * @param location - Location resolved via `GeoService.lookup`, or `null` when unresolved.
 * @returns The formatted string, or `null` when there's nothing to show.
 */
function formatLocation(location: NewDeviceEmailData['location']): string | null {
  if (!location) return null;
  const parts = [location.city, location.region, location.country].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}
