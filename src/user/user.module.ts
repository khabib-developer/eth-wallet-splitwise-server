import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Wallet } from 'src/wallet/wallet.model';
import { WalletService } from 'src/wallet/wallet.service';

@Module({
  controllers: [UserController],
  providers: [UserService, WalletService],
  imports: [SequelizeModule.forFeature([User, Wallet])],
  exports: [UserService],
})
export class UserModule {}
