import { AppLogger } from '@/config/logger';
import { AckPayload } from '@/realtime/interfaces';
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { SocketService } from '../services/socket.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/realtime',
})
export class MainGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Namespace;

  constructor(
    private readonly socketService: SocketService,
    private readonly logger: AppLogger,
  ) {}

  afterInit(nsp: Namespace) {
    this.logger.log('Socket Gateway initialized (namespace /realtime)');
    this.socketService.setNamespace(nsp);

    // Emit connect_ack on new connection
    nsp.on('connection', (socket: Socket) => {
      socket.emit('connect_ack', {
        message: 'Welcome! Connection established.',
        at: new Date().toISOString(),
      });

      socket.on('connect_ack', (_payload: AckPayload) => {
        this.logger.log(`Connection acknowledge from client ID: ${socket.id}.`);
      });

      socket.on('disconnect', () => {
        this.logger.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
}
