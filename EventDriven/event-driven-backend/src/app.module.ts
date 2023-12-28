import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { CommunityController } from './community/community.controller';
import { CommunityService } from './community/community.service';
import { DocController } from './doc/doc.controller';
import { DocService } from './doc/doc.service';

@Module({
  controllers: [AppController, CommunityController, DocController],
  providers: [AppService, CommunityService, DocService],
  imports: [AuthModule, PrismaModule],
})
export class AppModule {}
