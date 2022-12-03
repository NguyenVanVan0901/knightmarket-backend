import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { jobScanKnightMarket } from './jobs/transfer.job';
(async () => {
  try {
    await app.init();
    const appServer = await app.start(Number(process.env.PORT) || 2105);

    appServer.on('listening', async () => {
      await jobScanKnightMarket.start();
    });

    process.on('SIGINT', async () => {
      await jobScanKnightMarket.close(); 
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await jobScanKnightMarket.close();
      process.exit(0);
    });

  } catch (error) {
    console.log('LISTEN ERROR:', error);
  }
})();
