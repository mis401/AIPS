import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DocService } from '../doc/doc.service'
import { FileOwner } from 'src/dtos/fileowner.dto';
import { DiffDTO } from 'src/dtos/diff.dto';

@WebSocketGateway({ 
  cors: true,
 })
export class CollaborationGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;
  private owners: Map<number, number> = new Map<number, number>();
  constructor(private readonly docService: DocService) {}
  
  afterInit(server: any) {
    this.server = server;
  }

  async handleConnection(@ConnectedSocket() client) {
    console.log("Client connected");
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log("Client disconnected");

  }

  @SubscribeMessage('register')
  async handleRegister(@ConnectedSocket() client: Socket, @MessageBody() fileOwner: FileOwner) {
    this.owners[fileOwner.file] = fileOwner.user;
    client.join(fileOwner.file + '-' + fileOwner.user)
  }

  @SubscribeMessage('unregister')
  async handleUnregister(@ConnectedSocket() client: Socket, @MessageBody() fileOwner: FileOwner) {
    if (this.owners[fileOwner.file] == fileOwner.user){
      this.owners.delete(fileOwner.file);
      this.server.in(fileOwner.file + '-' + fileOwner.user).disconnectSockets();
    }
  }




  @SubscribeMessage('diff_send')
  async handleDocumentUpdate(@ConnectedSocket() client: Socket, @MessageBody() data: DiffDTO) {
    //const updatedDoc = await this.docService.updateDocument(data.id, data.content);
    //this.server.emit('documentToClient', updatedDoc);
    if (this.owners[data.docId] == data.user)
      client.broadcast.in(data.docId + '-' + data.user).emit("diff", data)
  }
}
