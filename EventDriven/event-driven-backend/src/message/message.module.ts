import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { ChatModule } from 'src/chat-mq/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [],
  providers: [MessageService],
})
export class MessageModule {}
