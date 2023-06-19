import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupGuard } from './group.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/api/create')
  create(@Body() dto: { name: string }, @Req() req: Request) {
    console.log(dto.name);
    return this.groupService.create(dto.name, req['user']['email']);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(GroupGuard)
  @Post('/api/checkForMember/')
  checkForMember(
    @Param() dto: { userEmail: string; groupId: string },
    @Req() req: Request,
  ) {
    // console.log(dto.id);
    // console.log(req);
    return 1;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(GroupGuard)
  @Post('/api/addUser')
  addUser(@Body() dto: { userEmail: string; groupId: number }) {
    return 1;
  }
}
