import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { Wallet } from './wallet.model';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [SequelizeModule.forFeature([User, Wallet])],
  exports: [WalletService],
})
export class WalletModule {}
