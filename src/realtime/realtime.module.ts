import { ConfigModule } from '@/config/config.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { MainGateway } from './gateways/main.gateway';
import { ProfileGateway } from './gateways/profile.gateway';
import { SocketService } from './services/socket.service';

@Module({
  imports: [SharedModule, ConfigModule],
  providers: [SocketService, MainGateway, ProfileGateway],
  exports: [SocketService],
})
export class RealtimeModule {}
