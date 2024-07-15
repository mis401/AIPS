import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "src/user/user.service";

export interface UserStatus {
    [key: string]: 'online' | 'offline';
}

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly userService: UserService) {}

    afterInit(server: Server) {
        console.log('WebSocket server initialized');
    }

    async handleConnection(client: Socket) {
        const userId = client.handshake.query.userId;
        if (userId) {
            await this.userService.updateUserStatus(Number(userId), 'online');
            this.server.emit('userStatus', { userId, status: 'online' });
        }
    }

    async handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId;
        if (userId) {
            await this.userService.updateUserStatus(Number(userId), 'offline');
            this.server.emit('userStatus', { userId, status: 'offline' });
        }
    }

    @SubscribeMessage('send_message')
    handleMessage(client: Socket, payload: any): void {
        this.server.emit('message', payload);
        console.log("Message sent: ", JSON.stringify(payload));
    }

    sendMessage(message: any) {
        this.server.emit('message', message);
        console.log("Message sent: ", JSON.stringify(message));
    }
}