import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group, UserGroup } from 'src/group/group.model';
import { Wallet } from 'src/wallet/wallet.model';

interface IUserCreationAttributes {
  email: string;
  name: string;
  password: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, IUserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasMany(() => Wallet)
  wallets: Wallet[];

  @BelongsToMany(() => Group, () => UserGroup)
  groups: Group[];
}
