// document.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayInit,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { RabbitMQService } from './rabbitmq.service';
  import { OnModuleInit } from '@nestjs/common';
  
  @WebSocketGateway()
  export class DocumentGateway implements OnGatewayInit, OnModuleInit {
    @WebSocketServer()
    server: Server;
  
    constructor(private rabbitMQService: RabbitMQService) {}
  
    async onModuleInit() {
      await this.rabbitMQService.onModuleInit();
    }
  
    async afterInit() {
      this.rabbitMQService.consume('document_changes', (msg) => {
        const message = JSON.parse(msg.content.toString());
        this.server.emit('document_change', message);
      });
    }
  
    @SubscribeMessage('document_change')
    async handleDocumentChange(
      @MessageBody() data: any,
      @ConnectedSocket() client: Socket,
    ) {
      this.rabbitMQService.sendToQueue('document_changes', JSON.stringify(data));
      client.broadcast.emit('document_change', data);
    }
  }
  