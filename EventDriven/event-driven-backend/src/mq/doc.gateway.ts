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
import { Client } from 'socket.io/dist/client';
import { SocketDiffDTO } from 'src/dtos/socket-diff.dto';
  
  @WebSocketGateway({cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },})
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
  
    handleConnection(@ConnectedSocket() client: Socket) {
      console.log("Client connected for documents");
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
      console.log("Client disconnected for documents");
    }

    @SubscribeMessage(`register`)
    async handleRegistering(@ConnectedSocket() client: Socket, @MessageBody() id: number){
      client.join(id.toString());
      console.log("Client joined room for doc id "+id);
    }

    @SubscribeMessage(`unregister`)
    async handleUnregister(@ConnectedSocket() client: Socket, @MessageBody() id: number){
      client.leave(id.toString());
      console.log("Client unregistered from doc id "+id);
    }

    @SubscribeMessage(`document_change`)
    async handleDocumentChange(
      @MessageBody() data: SocketDiffDTO,
      @ConnectedSocket() client: Socket,
    ) {
      console.log(data);
      this.rabbitMQService.sendToQueue('document_changes', JSON.stringify(data));
      client.broadcast.in(data.id.toString()).emit(`document_changed ${data.id}`, data);
    }
  }
  