import { Module } from '@nestjs/common';
import { GeoService } from './geo.service';

/**
 * Provides {@link GeoService} for resolving approximate location from an IP address.
 *
 * Import this module (or rely on {@link SharedModule}) wherever IP-based
 * geolocation is required.
 */
@Module({
  providers: [GeoService],
  exports: [GeoService],
})
export class GeoModule {}
