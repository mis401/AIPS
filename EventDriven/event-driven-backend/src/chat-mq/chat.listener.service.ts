import { Injectable, Logger, Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MessageEvent } from "src/events-mq/message-event";
import { ClientProxy } from "@nestjs/microservices";
import { ChatGateway } from "./chat.gateway";

@Injectable()
export class ChatListenerService {
    constructor(
        @Inject('MESSAGES_SERVICE') private readonly client: ClientProxy,
        private readonly chatGateway: ChatGateway,
    ) {}

    @OnEvent('message.send')
    async handleMessageEvent(event: MessageEvent){
        console.log('New message from', event.senderId, "in community", event.communityId);

        const message = {
            communityId: event.communityId,
            senderId: event.senderId,
            content: event.message,
            name: event.senderName,
        };

        console.log("Message", message.content);

        this.client.emit('message', message);
       // this.chatGateway.sendMessage(message);
    }
}