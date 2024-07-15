import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
<<<<<<< HEAD
import { MessageController } from './message.controller';
=======
// import { MessageController } from './message.controller';
>>>>>>> cf58162d736fb332e8911708408072ffe4153091
import { ChatModule } from 'src/chat-mq/chat.module';

@Module({
  imports: [ChatModule],
<<<<<<< HEAD
 controllers: [MessageController],
=======
  // controllers: [MessageController],
>>>>>>> cf58162d736fb332e8911708408072ffe4153091
  providers: [MessageService],
})
export class MessageModule {}
