// document.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { RabbitMQService } from './rabbitmq.service';
  import { OnModuleInit } from '@nestjs/common';
import { Client } from 'socket.io/dist/client';
import { SocketDiffDTO } from 'src/dtos/socket-diff.dto';
import { DrawingPhaseDTO } from 'src/dtos/drawing-phase.dto';
import { LineCfgDTO } from 'src/dtos/linecfg.dto';
  
  @WebSocketGateway({cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },})
  export class DocumentGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    @WebSocketServer()
    server: Server;
    roomOwners: Map<string, string>;
    constructor(private rabbitMQService: RabbitMQService) {
      this.roomOwners = new Map<string, string>();
    }
  
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

    async handleDisconnect(@ConnectedSocket() client: Socket) {
      console.log("Client disconnected for documents");
      const sockets = await this.server.fetchSockets();
      sockets.forEach(s => console.log(s.rooms));
    }

    @SubscribeMessage(`register`)
    async handleRegistering(@ConnectedSocket() client: Socket, @MessageBody() id: number){
      client.join(id.toString());
      
      console.log("Client joined room for doc id "+id);
      const numberOfPeople = (await this.server.in(id.toString()).fetchSockets()).length;
      console.log(numberOfPeople);
      if (numberOfPeople == 1) {
        this.roomOwners.set(client.id, id.toString());
      }
      this.server.to(client.id).emit("ownership", this.roomOwners.has(client.id));
    }

    @SubscribeMessage(`unregister`)
    async handleUnregister(@ConnectedSocket() client: Socket, @MessageBody() id: number){
      if (this.roomOwners.has(client.id)){
        const allRoomSockets = await this.server.in(id.toString()).fetchSockets();
        const guests = allRoomSockets.filter(s => s.id != client.id);
        this.roomOwners.delete(client.id);
        if (guests.length > 0) {
          this.roomOwners.set(guests.at(0).id, id.toString());
          this.server.to(guests.at(0).id).emit("ownership", true);
        }
      }
      client.leave(id.toString());
      console.log("Client unregistered from doc id "+id);
      console.log((await this.server.in(id.toString()).fetchSockets()).length);
    }

    @SubscribeMessage(`drawing_start`)
    handleDrawingStart(@ConnectedSocket() client: Socket, @MessageBody() data: DrawingPhaseDTO) {
      console.log(data);
      if (this.roomOwners.has(client.id))
        client.broadcast.to(data.id.toString()).emit(`drawing_started`, data)
    }

    @SubscribeMessage(`linecfg`)
    handleLineCfg(@ConnectedSocket() client: Socket, @MessageBody() data: LineCfgDTO){
      console.log(data);
      if (this.roomOwners.has(client.id))
        client.broadcast.to(data.id.toString()).emit(`linecfg-update`, data);
    }

    @SubscribeMessage(`document_change`)
    handleDocumentChange(
      @MessageBody() data: SocketDiffDTO,
      @ConnectedSocket() client: Socket,
    ) {
      console.log(data);
      if (this.roomOwners.has(client.id)){
        this.rabbitMQService.sendToQueue('document_changes', JSON.stringify(data));
        client.broadcast.to(data.id.toString()).emit(`document_changed ${data.id}`, data);
      }
      console.log(client.rooms);
    }
  }
  