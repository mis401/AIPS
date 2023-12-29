import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { CommunityController } from './community/community.controller';
import { CommunityService } from './community/community.service';
import { DocController } from './doc/doc.controller';
import { DocService } from './doc/doc.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';

@Module({
  controllers: [AppController, CommunityController, DocController, UserController, EventsController],
  providers: [AppService, CommunityService, DocService, UserService, EventsService],
  imports: [AuthModule, PrismaModule],
})
export class AppModule {}
