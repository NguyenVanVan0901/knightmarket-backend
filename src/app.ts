import path from 'path';
import express from 'express';
import cors from 'cors';
import route from './routers';
import { connectDatabase } from './config/database';
import { seedData } from './config/seed';
import Logger from './utility/logger';
class App {
  public express;

  constructor() {
    this.express = express();
  }

  public async init() {
    await connectDatabase('KnightMarket');
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));

    // -- file upload
    this.express.use('/static', express.static(path.join(__dirname, 'uploads')));
    // -- router
    await route(this.express);
    // Init data
    await seedData.initKnightMarket();

  }

  public async start(port: number) {
    return this.express.listen(port, () =>  Logger.info(`App running on port: ${port}`));
  }
}

export default new App();
