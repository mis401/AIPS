import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DocService } from '../doc/doc.service'
import { FileOwner } from 'src/dtos/fileowner.dto';

@WebSocketGateway({ cors: true })
export class CollaborationGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;
  private rooms: Map<string, number> = new Map<string, number>();
  constructor(private readonly docService: DocService) {}
  
  afterInit(server: any) {
    this.server = server;
  }

  async handleConnection(@ConnectedSocket() client, fileOwner: FileOwner) {
    const fileInfo = await this.docService.getDocumentInformation(fileOwner.file);
    client.join(fileInfo.path);
    this.rooms[fileInfo.path] = fileOwner.user;
  }

  async handleDisconnect(@ConnectedSocket() client, fileOwner) {
    const fileInfo = await this.docService.getDocumentInformation(fileOwner.file);
    client.leave(fileInfo.path);
    if (this.rooms[fileInfo.path] === fileOwner.user){
      this.rooms.delete[fileInfo.path];
    }
  }


  @SubscribeMessage('documentToServer')
  async handleDocumentUpdate(@MessageBody() data: any) {
    //const updatedDoc = await this.docService.updateDocument(data.id, data.content);
    //this.server.emit('documentToClient', updatedDoc);
  }
}
