import { ethers } from 'ethers';
import provider from '../config/provider.js';
import { serverWalletPrivateKey } from '../config/constants.js';

/**
 * Creates a new random Ethereum wallet.
 * This is a non-custodial operation; the server does not store these keys.
 */
export const createWallet = () => {
  const wallet = ethers.Wallet.createRandom();

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  };
};

/**
 * Retrieves the balance of a given wallet address.
 */
export const getWalletBalance = async (address) => {
  const balanceWei = await provider.getBalance(address);

  const balanceMatic = ethers.formatEther(balanceWei);

  return {
    address: address,
    balance: balanceMatic,
    unit: 'MATIC',
  };
};

/**
 * Simulates a P2P transfer by sending funds from the server's
 * central wallet to a specified recipient address.
 */
export const simulateTransfer = async (toAddress, amount) => {
  if (!serverWalletPrivateKey) {
    throw new Error('Server wallet private key is not configured.');
  }

  const serverWallet = new ethers.Wallet(serverWalletPrivateKey, provider);
  console.log(`Sending from server wallet: ${serverWallet.address}`);

  const amountWei = ethers.parseEther(amount);

  const tx = {
    to: toAddress,
    value: amountWei,
  };

  console.log(`Sending ${amount} MATIC to ${toAddress}`);
  const txResponse = await serverWallet.sendTransaction(tx);

  await txResponse.wait(1);

  console.log(`Transaction sent! Hash: ${txResponse.hash}`);

  return {
    success: true,
    from: serverWallet.address,
    to: toAddress,
    amount: amount,
    unit: 'MATIC',
    transactionHash: txResponse.hash,
    explorerUrl: `https://amoy.polygonscan.com/tx/${txResponse.hash}`,
  };
};
