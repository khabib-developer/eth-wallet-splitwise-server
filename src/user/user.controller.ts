import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/api/getAccountKeys')
  async getSelfData(@Req() request: Request) {
    return await this.userService.getSelfData(request['user']['id']);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/getAccountKeys')
  async getAccountKeys(@Body() dto: { email: string; password: string }) {
    return await this.userService.getKeysAccount(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/searchByEmail')
  async searchByEmail(@Body() dto: { email: string }, @Req() request: Request) {
    return await this.userService.searchByEmail(
      dto.email,
      request['user']['email'],
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/sendMoney')
  async sendMoney(
    @Body() dto: { to: string; amount: string; password: string },
    @Req() request: Request,
  ) {
    return await this.userService.sendMoney(
      dto.to,
      dto.amount,
      dto.password,
      request['user']['email'],
    );
  }
}
