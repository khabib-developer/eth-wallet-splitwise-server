import { Injectable } from '@nestjs/common';
import { Wallet } from './wallet.model';
import { InjectModel } from '@nestjs/sequelize';
import Web3 from 'web3';

export type EncryptedKeystoreV3Json = {
  version: number;
  id: string;
  address: string;
  crypto: {
    ciphertext: string;
    cipherparams: {
      iv: string;
    };
    cipher: string;
    kdf: string;
    kdfparams: {
      dklen: number;
      salt: string;
      n: number;
      r: number;
      p: number;
    };
    mac: string;
  };
};

@Injectable()
export class WalletService {
  private web3: Web3;
  constructor(@InjectModel(Wallet) private walletRepository: typeof Wallet) {
    this.web3 = new Web3('https://rpc2.sepolia.org');
  }

  create() {
    return this.web3.eth.accounts.create();
  }

  async encrypt(privateKey: string, publicAddress: string, password: string) {
    const encryptedData = this.web3.eth.accounts.encrypt(privateKey, password);
    return await this.walletRepository.create({
      encryptedData: JSON.stringify(encryptedData),
      publicAddress,
    });
  }

  async decrypt(wallet: Wallet, password: string) {
    return this.web3.eth.accounts.decrypt(
      JSON.parse(wallet.encryptedData) as EncryptedKeystoreV3Json,
      password,
    );
  }

  async getBalance(address: string) {
    return Web3.utils.fromWei(await this.web3.eth.getBalance(address), 'ether');
  }

  async setTransaction(
    privateKey: string,
    fromAddress: string,
    toAddress: string,
    amount: string,
  ) {
    const nonce = await this.web3.eth.getTransactionCount(fromAddress);
    const gasPrice = await this.web3.eth.getGasPrice();
    const gasLimit = 21000;
    const amountToSend = this.web3.utils.toWei(`${amount}`, 'ether');
    const transactionObject = {
      from: fromAddress,
      to: toAddress,
      value: amountToSend,
      gasPrice: gasPrice,
      gas: gasLimit,
      nonce: nonce,
    };

    const signedTransaction = await this.web3.eth.accounts.signTransaction(
      transactionObject,
      privateKey,
    );

    const sentTransaction = await this.web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );

    console.log('Transaction sent:', sentTransaction);

    return sentTransaction;
  }
}
