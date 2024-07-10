import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

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
    private userStatus: UserStatus = {};

    afterInit(server: Server) {
        console.log("WebSocket server initialized");
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log("Client connected: ", client.id);

        let userId = client.handshake.query.userId;
        console.log("Sta je user ovde1: ", userId);
    
        if (Array.isArray(userId)) {
            userId = userId[0];
            console.log("Sta je user ovde: ", userId);
        }

        if (typeof userId === 'string') {
            this.userStatus[userId] = 'online';
            this.server.emit('userStatus', { userId, status: 'online' });
        } else {
            console.error('User ID is missing or invalid:', userId);
        }
    }

    handleDisconnect(client: Socket) {
        console.log("Client disconnected: ", client.id);

        let userId = client.handshake.query.userId;
        if (Array.isArray(userId)) {
            userId = userId[0];
        }

        if (typeof userId === 'string') {
            this.userStatus[userId] = 'offline';
            this.server.emit('userStatus', { userId, status: 'offline' });
        } else {
            console.error('User ID is missing or invalid:', userId);
        }
    }

    async getUserStatus(userId: string) {
        return this.userStatus[userId] || 'offline';
    }

    async getAllUserStatuses() {
        return this.userStatus;
    }

    @SubscribeMessage('send')
    handleMessage(client: Socket, @MessageBody() message: any): void {
        this.sendMessage(message);
    }

    sendMessage(message: any) {
        this.server.emit('message', message);
        console.log("Message sent: ", JSON.stringify(message));
    }
}
