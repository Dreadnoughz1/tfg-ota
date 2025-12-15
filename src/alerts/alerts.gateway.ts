import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AlertsGateway implements OnGatewayInit {
  private readonly logger = new Logger(AlertsGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('🚨 Alerts WebSocket Gateway initialized');
  }

  emitAlert(alert: any) {
    this.server.emit('alert', alert);
  }
}
