import { AppLogger } from '@/config/logger';
import type { GetProfilePayload } from '@/realtime/gateways/interfaces';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { AppSocket } from '../types';

@WebSocketGateway({ namespace: '/realtime' })
export class ProfileGateway {
  constructor(
    private readonly logger: AppLogger,
  ) /*private readonly socketService: SocketService*/ {}

  @SubscribeMessage('get_profile')
  handleProfileUpdate(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() payload: GetProfilePayload,
  ) {
    this.logger.log(
      `Received profile update from client ID: ${client.id}. Profile ID: ${payload.id}, Profile Status: ${payload.status}.`,
    );

    // Reply to sender
    /**
     * an example of sending event to specific client
     *
     * this.socketService.emitToClient(client.id, 'profile_update', payload);
     */
    //

    /**
     * an example of broadcast to all clients
     *
     * this.socketService.emitToAll('profile_update', payload);
     */
  }
}
