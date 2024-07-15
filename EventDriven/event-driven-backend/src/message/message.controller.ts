import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageEvent } from 'src/events-mq/message-event';
import { MessageService } from './message.service';
import { ChatGateway } from 'src/chat-mq/chat.gateway';
import { UserService } from 'src/user/user.service';

@Controller('message')
export class MessageController {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly messageService: MessageService,
        private readonly chatGateway: ChatGateway,
        private readonly userService: UserService,
    ) {}

    @Post('send')
    async sendMessage(
        @Body('communityId') communityId: number,
        @Body('senderId') senderId: number,
        @Body('message') message: string
    ) {
        const newMessage = await this.messageService.createMessages({
            community: { connect: { id: communityId }},
            sender: { connect: { id: senderId }},
            text: message,
        });

        const user = await this.userService.getUserById(senderId);

        const messageWithSenderName = {
            communityId,
            senderId,
            content: message,
            senderName: `${user.firstName} ${user.lastName}`
        };

        console.log("New message: ", newMessage.text);
        this.eventEmitter.emit(
            'message.send',
            new MessageEvent(communityId, newMessage.senderId, message, `${user.firstName} ${user.lastName}`)
        );

        this.chatGateway.sendMessage(messageWithSenderName);

        return newMessage;
    }

    @Get('messages')
    async getMessages(@Query('communityId') communityId: number) {
        return this.messageService.getMessagesByCommunity(Number(communityId));
    }
}
