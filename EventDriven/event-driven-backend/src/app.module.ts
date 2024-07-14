import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { CommunityModule } from './community/community.module';
import { DocModule } from './doc/doc.module';
import { EventsModule } from './events/events.module';
import { UserModule } from './user/user.module';
import { FilesysService } from './filesys/filesys.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsListenerService } from './notification/notification.listener.service';
import { CommunityService } from './community/community.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationsGateway } from './notification/notification.gateway';
import { DocService } from './doc/doc.service';
// import { CollaborationGateway } from './socket/collaboration.gateway';
import { ChatListenerService } from './chat-mq/chat.listener.service';
import { ChatGateway } from './chat-mq/chat.gateway';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat-mq/chat.module';
import { DocumentGateway } from './mq/doc.gateway';
import { RabbitMQService } from './mq/rabbitmq.service';

@Module({

  controllers: [AppController],

  providers: [
    AppService, 
    FilesysService, 
    CommunityService, 
    NotificationsListenerService,
    NotificationsGateway,
    DocService,
    // CollaborationGateway,
    DocumentGateway,
    RabbitMQService,
    ChatListenerService,
    ChatGateway,
    MessageService,
  ],

  imports: [
    AuthModule, 
    PrismaModule, 
    CommunityModule,
    DocModule, 
    EventsModule, 
    UserModule,
    MessageModule,
    ChatModule,
    EventEmitterModule.forRoot(),
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'notifications_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name:"MESSAGES_SERVICE",
        transport:Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], //kris: 26.90.10.202
          queue: 'messages_queue',
          queueOptions: {
            durable: true,
          }
        }
      },
      {
        name:"COLLAB_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://26.128.205.116:5672'],
          queue: 'collab_queue',
          queueOptions:{
            durable: true
          }
        }
      },
    ]),
  ],
})
export class AppModule {}
