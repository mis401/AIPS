import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
@Module({
  providers: [ChatGateway],
  exports: [ChatGateway],
  imports: [UserModule],
})
export class ChatModule {}
