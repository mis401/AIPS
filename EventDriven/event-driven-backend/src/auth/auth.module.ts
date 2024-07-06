import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule} from '@nestjs/jwt'
import { JwtSecret } from 'src/utils/constants';
import { LocalStrategy } from 'src/guards/local.strategy';
import { JwtStrategy } from 'src/guards/jwt.strategy';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: JwtSecret,
    signOptions: {
      expiresIn: '1d'
    }
  })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
