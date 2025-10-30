export const backendUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_BACKEND_URL
    : process.env.BACKEND_URL;

export const frontendUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_FRONTEND_URL
    : process.env.FRONTEND_URL;

export const infuraApiKey = process.env.INFURA_API_KEY;

export const rpcUrl = `https://polygon-amoy.infura.io/v3/${infuraApiKey}`;
export const serverWalletPrivateKey = process.env.SERVER_WALLET_PRIVATE_KEY;
export const port = process.env.PORT || 4000;
export const nodeEnv = process.env.NODE_ENV || 'development';
