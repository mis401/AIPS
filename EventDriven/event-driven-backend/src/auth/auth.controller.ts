import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { LocalAuthGuard } from 'src/guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req, @Res() res){
    return this.authService.signin( req.user, res);
  }

  @Get('signout')
  signout( @Req() req, @Res() res) {
    return this.authService.singout(req, res); 
  }

  @Post('refresh-token')
  refreshTokens(@Body('refreshToken') refreshToken: string, @Res() res){
    return this.authService.refreshTokens(refreshToken, res);
  }

}
