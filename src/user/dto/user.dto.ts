import { IsString, IsEmail, Length } from 'class-validator';

export class UserDto {
  readonly id?: number;
  @IsString({ message: 'Must be string' })
  readonly name: string;
  @IsString({ message: 'Must be string' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  readonly email: string;
  @Length(4, 6, { message: '>4, <6' })
  readonly password: string;
}
