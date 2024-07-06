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
import { LocalStrategy } from './guards/local.strategy';
import { CommunityModule } from './community/community.module';
import { DocModule } from './doc/doc.module';
import { EventsModule } from './events/events.module';
import { UserModule } from './user/user.module';
import { FilesysService } from './filesys/filesys.service';

@Module({
  controllers: [AppController, ],
  providers: [AppService, FilesysService, ],
  imports: [AuthModule, PrismaModule, CommunityModule, DocModule, EventsModule, UserModule],
})
export class AppModule {}
