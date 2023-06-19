import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: UserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: UserDto) {
    const candidate = await this.usersService.getUserByEmail(userDto.email);
    if (candidate)
      throw new HttpException(
        'User with this email exists',
        HttpStatus.BAD_REQUEST,
      );
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.create(
      {
        ...userDto,
        password: hashPassword,
      },
      userDto.password,
    );
    return this.generateToken(user);
  }

  private async generateToken(payload: User) {
    return {
      token: await this.jwtService.signAsync({
        email: payload.email,
        id: payload.id,
        name: payload.name,
      }),
      user: await this.usersService.getSelfData(payload.id),
    };
  }

  private async validateUser(payload: UserDto) {
    const user = await this.usersService.getUserByEmail(payload.email);
    console.log(user);
    if (user) {
      const password = await bcrypt.compare(payload.password, user.password);
      if (user && password) return user;
      throw new UnauthorizedException({
        message: 'incorrect password or email',
      });
    }
    throw new UnauthorizedException({
      message: 'User not found',
    });
  }
}
