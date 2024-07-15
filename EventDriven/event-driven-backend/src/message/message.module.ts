import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
<<<<<<< HEAD
=======
// import { MessageController } from './message.controller';
>>>>>>> af85a81355ac864443403f5d4e6ffc827b5f906c
import { ChatModule } from 'src/chat-mq/chat.module';

@Module({
  imports: [ChatModule],
<<<<<<< HEAD
  controllers: [],
=======
  // controllers: [MessageController],
>>>>>>> af85a81355ac864443403f5d4e6ffc827b5f906c
  providers: [MessageService],
})
export class MessageModule {}
