import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Group } from './group.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.model';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
    private userService: UserService,
  ) {}

  async create(name: string, email: string): Promise<Group> {
    console.log(name, email);
    const group = await this.groupRepository.create({ name });
    const user = await this.userService.getUserByEmail(email);
    if (user && group) {
      await group.$add('users', user.id); // Add the user to the group
      return group;
    }
    return group;
  }

  async checkForMember(userEmail: string, groupId: string) {
    const user = await this.userService.getUserByEmail(userEmail);
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      include: [User],
    });
    if (user && group) {
      if (group.users.find((user) => user.email === userEmail)) {
        return user;
      }
      throw new HttpException(
        'User is not memeber of this group',
        HttpStatus.BAD_REQUEST,
      );
    }
    throw new HttpException('User or group not found', HttpStatus.BAD_REQUEST);
  }

  async addUser(id: number, email: string) {
    const user = await this.userService.getUserByEmail(email);
    const group = await this.groupRepository.findByPk(id);
    if (user && group) {
      await group.$add('users', user.id); // Add the user to the group
      return group;
    }

    throw new HttpException('User or group not found', HttpStatus.BAD_REQUEST);
  }
}
