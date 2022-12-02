import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { objConnectDB } from './config/database';
import { jobScanKnightMarket } from './jobs/transfer.job';
(async () => {
  try {
    await app.init();
    const appServer = app.start(+process.env.PORT || 2105);

    appServer.on('listening', async () => {
      jobScanKnightMarket.start();
    });

    process.on('SIGINT', async () => {
      jobScanKnightMarket.close(); 
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      jobScanKnightMarket.close();
      process.exit(0);
    });

  } catch (error) {
    console.log('LISTEN ERROR:', error);
  }
})();
