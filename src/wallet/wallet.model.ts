import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';

export interface IWalletCreationAttributes {
  name: string;
  encryptedData: string;
  publicAddress: string;
}

@Table({ tableName: 'wallet' })
export class Wallet extends Model<Wallet, IWalletCreationAttributes> {
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
    allowNull: true,
    defaultValue: 'crypto account',
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  publicAddress: string;

  @Column({ type: DataType.JSONB, unique: true, allowNull: false })
  encryptedData: string;

  @ForeignKey(() => User) // Add foreign key decorator
  @Column
  ownerId: number; // Add ownerId column

  @BelongsTo(() => User)
  owner: User;
}
