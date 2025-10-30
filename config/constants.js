export const backendUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_BACKEND_URL
    : process.env.BACKEND_URL;

export const frontendUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_FRONTEND_URL
    : process.env.FRONTEND_URL;
