import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket} from "socket.io";

@WebSocketGateway({
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
})

export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log("WebSocket server initialized");
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log("Client connected: ", client.id);
    }

    handleDisconnect(client: Socket) {
        console.log("Client disconnected: ", client.id);
    }

    sendMessage(message: any){
        this.server.emit('message', message);
        console.log("Message sent: ", JSON.stringify(message));
    }
}