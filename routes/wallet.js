import { Router } from 'express';
import {
  handleCreateWallet,
  handleGetBalance,
  handleSimulateTransfer,
} from '../controllers/wallet.js';

const router = Router();

router.post('/create', handleCreateWallet);
router.get('/balance/:address', handleGetBalance);
router.post('/transfer/simulate', handleSimulateTransfer);

export default router;
