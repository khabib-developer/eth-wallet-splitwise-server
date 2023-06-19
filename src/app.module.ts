import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { AuthModule } from './auth/auth.module';
import { Wallet } from './wallet/wallet.model';
import { GroupModule } from './group/group.module';
import { Group, UserGroup } from './group/group.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'cryptowallet',
      models: [User, Wallet, Group, UserGroup],
      autoLoadModels: true,
    }),
    WalletModule,
    UserModule,
    AuthModule,
    GroupModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
