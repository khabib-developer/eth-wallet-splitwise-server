import { Module, forwardRef } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group, UserGroup } from './group.model';
import { User } from 'src/user/user.model';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [GroupService],
  controllers: [GroupController],
  imports: [
    SequelizeModule.forFeature([Group, User, UserGroup]),
    forwardRef(() => UserModule),
  ],
})
export class GroupModule {}
