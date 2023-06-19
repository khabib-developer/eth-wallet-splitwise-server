import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from 'src/user/user.service';

interface AuthRequest extends Request {
  user: UserDto;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/login')
  login(@Body() userDto: UserDto) {
    return this.authService.login(userDto);
  }

  @Post('/registration')
  registration(@Body() userDto: UserDto) {
    return this.authService.registration(userDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/check')
  check(@Req() req: AuthRequest) {
    console.log(req.user);
    return this.userService.getSelfData(req.user.id);
  }
}
