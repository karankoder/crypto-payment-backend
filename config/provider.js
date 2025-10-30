import { ethers } from 'ethers';
import { rpcUrl } from './constants.js';

const provider = new ethers.JsonRpcProvider(rpcUrl);

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(`Connected to Polygon Amoy. Current block: ${blockNumber}`);
  })
  .catch((error) => {
    console.error('Error connecting to Polygon Amoy:', error.message);
  });

export default provider;
