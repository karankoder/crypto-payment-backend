import { app } from './app.js';
import { nodeEnv, port, backendUrl } from './config/constants.js';

app.listen(port, () => {
  console.log(`Server is running on  ${backendUrl} in ${nodeEnv} mode`);
});
