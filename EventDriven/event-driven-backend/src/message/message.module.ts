import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatModule } from 'src/chat-mq/chat.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ChatModule, UserModule], 
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
