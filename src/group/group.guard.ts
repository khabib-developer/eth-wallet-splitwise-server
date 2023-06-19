import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GroupService } from './group.service';
import { User } from 'src/user/user.model';
import { UserDto } from 'src/user/dto/user.dto';

interface RequestWithUser extends Request {
  body: any;
}

@Injectable()
export class GroupGuard implements CanActivate {
  constructor(private groupService: GroupService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: RequestWithUser = context.switchToHttp().getRequest();
    try {
      const response = await this.groupService.checkForMember(
        req.body.userEmail,
        req.body.groupId,
      );

      return !!response;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException({
        message: 'User is not member of the group',
      });
    }
  }
}
