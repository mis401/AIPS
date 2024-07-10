import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "src/user/user.service";

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
        this.userService.setServer(server);
    }

    async handleConnection(client: Socket) {
        const userId = client.handshake.query.userId;
        const communityId = client.handshake.query.communityId;
        if (userId && communityId) {
            const user = await this.userService.updateUserStatus(Number(userId), 'online', Number(communityId));
            this.server.to(`community_${communityId}`).emit('userStatus', {
                userId,
                status: 'online',
                currentDocument: user.currentDocument,
            });
        }
    }

    async handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId;
        const communityId = client.handshake.query.communityId;
        if (userId && communityId) {
            const user = await this.userService.updateUserStatus(Number(userId), 'offline', Number(communityId));
            this.server.to(`community_${communityId}`).emit('userStatus', {
                userId,
                status: 'offline',
                currentDocument: user.currentDocument,
            });
        }
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
