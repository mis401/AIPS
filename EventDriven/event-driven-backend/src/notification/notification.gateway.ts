import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST'], 
    allowedHeaders: ['content-type'],
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('NotificationsGateway');

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.logger.log('Message received: ' + payload);
  }

  sendNotification(notification: any) {
    this.server.emit('notification', notification);
    this.logger.log('Notification sent: ' + JSON.stringify(notification));
  }
}
