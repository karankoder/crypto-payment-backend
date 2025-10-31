import { Router } from 'express';
import {
  handleAnalyzeWallet,
  handleCreateWallet,
  handleGetBalance,
  handleSimulateTransfer,
} from '../controllers/wallet.js';

const router = Router();

router.post('/create', handleCreateWallet);
router.get('/balance/:address', handleGetBalance);
router.post('/transfer', handleSimulateTransfer);
router.get('/analyze/:address', handleAnalyzeWallet);

export default router;
