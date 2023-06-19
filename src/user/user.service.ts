import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserDto } from './dto/user.dto';
import { Wallet } from 'src/wallet/wallet.model';
import { WalletService } from 'src/wallet/wallet.service';
import { Op } from 'sequelize';
import { Group } from 'src/group/group.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private walletService: WalletService,
  ) {}

  async create(dto: UserDto, password: string) {
    const user = await this.userRepository.create(dto);
    const account = this.walletService.create();
    const wallet = await this.walletService.encrypt(
      account.privateKey,
      account.address,
      password,
    );
    user.$set('wallets', [wallet.id]);
    return user;
  }

  async addWallet(id: number, wallet: Wallet) {
    const user = await this.userRepository.findByPk(id);
    user.$add('wallets', [wallet.id]);
    return user;
  }

  async getKeysAccount(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    const data = await this.walletService.decrypt(user.wallets[0], password);
    return { publicKey: data.address, privateKey: data.privateKey };
  }

  async getSelfData(id: number) {
    const user = await this.userRepository.findByPk(id, {
      include: [Wallet, Group],
    });

    const balance = await this.walletService.getBalance(
      user.wallets[0].publicAddress,
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      balance,
      groups: user.groups,
    };
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: email },
      include: [Wallet],
    });
  }

  async sendMoney(to: string, amount: string, password: string, email: string) {
    let address: string = to;
    const candidate = await this.getUserByEmail(to);
    if (candidate) address = candidate.wallets[0].publicAddress;
    const from = await this.getUserByEmail(email);
    const data = await this.walletService.decrypt(from.wallets[0], password);
    if (data) {
      const transaction = await this.walletService.setTransaction(
        data.privateKey,
        data.address,
        address,
        amount,
      );
      if (transaction) {
        return {
          transaction,
          balance: await this.walletService.getBalance(
            from.wallets[0].publicAddress,
          ),
        };
      }
    }
  }

  async searchByEmail(email: string, selfEmail: string) {
    const users = await User.findAll({
      where: {
        email: {
          [Op.like]: `%${email}%`,
        },
      },
      attributes: ['id', 'email'],
    });

    return users.filter((u) => u.email !== selfEmail).map((u) => u.email);
  }
}
