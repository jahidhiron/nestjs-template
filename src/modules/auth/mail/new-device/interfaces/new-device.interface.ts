import type { GeoLocation } from '@/shared/geo';

export interface NewDeviceEmailData {
  email: string;
  name: string;
  ip: string | null;
  userAgent: string | null;
  location: GeoLocation | null;
}

export interface NewDeviceEmailOptions {
  companyName: string;
}
