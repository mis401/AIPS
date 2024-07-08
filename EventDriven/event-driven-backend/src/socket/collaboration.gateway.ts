import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DocService } from '../doc/doc.service'

@WebSocketGateway({ cors: true })
export class CollaborationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly docService: DocService) {}

  @SubscribeMessage('documentToServer')
  async handleDocumentUpdate(@MessageBody() data: any) {
    //const updatedDoc = await this.docService.updateDocument(data.id, data.content);
    //this.server.emit('documentToClient', updatedDoc);
  }
}
