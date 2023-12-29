import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SignInDto, @Req() req, @Res() res){
    return this.authService.signin(dto,req, res);
  }

  @Get('signout')
  signout( @Req() req, @Res() res) {
    return this.authService.singout(req, res); 
  }
}
