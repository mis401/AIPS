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
import { DocService } from './doc/doc.service';
import { CollaborationGateway } from './socket/collaboration.gateway';

@Module({
  controllers: [AppController],

  providers: [
    AppService, 
    FilesysService, 
    CommunityService, 
    NotificationsListenerService,
    DocService,
    CollaborationGateway
  ],

  imports: [
    AuthModule, 
    PrismaModule, 
    CommunityModule,
    DocModule, 
    EventsModule, 
    UserModule,
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
    ]),
  ],
})
export class AppModule {}
