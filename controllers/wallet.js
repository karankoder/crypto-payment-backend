import * as blockchainService from '../services/blockchain.js';
import * as gemini from '../services/gemini.js';
import ErrorHandler from '../middlewares/error.js';
import { ethers } from 'ethers';

/**
 * Controller to handle the creation of a new wallet.
 */
export const handleCreateWallet = (req, res, next) => {
  try {
    const wallet = blockchainService.createWallet();

    res.status(200).json({
      success: true,
      message:
        'Wallet created successfully. Save these credentials securely. The server does NOT store them.',
      data: wallet,
    });
  } catch (error) {
    return next(new ErrorHandler('Error creating wallet', 500));
  }
};

/**
 * Controller to handle retrieving a wallet's balance.
 */
export const handleGetBalance = async (req, res, next) => {
  try {
    const { address } = req.params;

    if (!address || !ethers.isAddress(address)) {
      return next(new ErrorHandler('Invalid or missing wallet address', 400));
    }

    const balanceData = await blockchainService.getWalletBalance(address);

    res.status(200).json({
      success: true,
      message: 'Wallet balance retrieved successfully',
      data: balanceData,
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler('Error retrieving balance', 500));
  }
};

/**
 * Controller to handle a simulated P2P transfer.
 * Takes a 'toAddress' and 'amount' from the request body.
 */
export const handleSimulateTransfer = async (req, res, next) => {
  try {
    const { toAddress, amount } = req.body;

    if (!toAddress || !amount) {
      return next(
        new ErrorHandler('Missing required fields: toAddress and amount', 400)
      );
    }

    if (!ethers.isAddress(toAddress)) {
      return next(
        new ErrorHandler('Invalid recipient address (toAddress)', 400)
      );
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return next(
        new ErrorHandler('Invalid amount. Must be a positive number.', 400)
      );
    }

    const transferData = await blockchainService.simulateTransfer(
      toAddress,
      amount
    );

    res.status(200).json({
      success: true,
      message: 'Transfer simulation successful.',
      data: transferData,
    });
  } catch (error) {
    console.error('Transfer Error:', error.message);
    if (error.message.includes('insufficient funds')) {
      return next(
        new ErrorHandler('Server wallet has insufficient funds.', 500)
      );
    }
    return next(
      new ErrorHandler(error.message || 'Error simulating transfer', 500)
    );
  }
};

/**
 * Controller to handle analyzing a wallet's activity using Gemini.
 */
export const handleAnalyzeWallet = async (req, res, next) => {
  try {
    const { address } = req.params;

    if (!address || !ethers.isAddress(address)) {
      return next(new ErrorHandler('Invalid or missing wallet address', 400));
    }

    const history = await blockchainService.getWalletHistory(address);

    if (history.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          analysis: 'This wallet has no transaction history.',
        },
      });
    }

    const simplifiedHistory = history.slice(0, 20).map((tx) => ({
      type: tx.from === address ? 'Sent' : 'Received',
      to: tx.to,
      from: tx.from,
      value_MATIC: ethers.formatEther(tx.value),
      timestamp: tx.timeStamp
        ? new Date(tx.timeStamp * 1000).toISOString()
        : 'N/A',
    }));

    const analysis = await gemini.getWalletAnalysis(simplifiedHistory);

    res.status(200).json({
      success: true,
      data: {
        analysis: analysis,
      },
    });
  } catch (error) {
    console.error(error);
    return next(
      new ErrorHandler(error.message || 'Error analyzing wallet', 500)
    );
  }
};
