import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';

export interface IGroupCreationAttributes {
  name: string;
}

@Table({ tableName: 'user-group' })
export class UserGroup extends Model<UserGroup> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Group)
  @Column
  groupId: number;
}

@Table({ tableName: 'group' })
export class Group extends Model<Group, IGroupCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  name: string;

  @BelongsToMany(() => User, () => UserGroup)
  users: User[];
}
