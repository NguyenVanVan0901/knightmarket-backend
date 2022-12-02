import { CronJob } from "cron";
import { IKightMarket, KnightMarketModel } from "../app/models/KnightMarket";
import { TYPE_EVENT } from "../constants/global";
import Web3 from "web3";
import { EventData } from 'web3-eth-contract';
import { KnightModel } from "../app/models/Knight";
const KnightAbi = require("../abi/knight.json");
const providerAchemy = new Web3.providers.WebsocketProvider(
    "wss://polygon-mumbai.g.alchemy.com/v2/wU4prjL7wZdA2-1i3rKqWVLxDoOKBQfE"
);
const web3Achemy = new Web3(providerAchemy);
const KnightContract = new web3Achemy.eth.Contract(
    KnightAbi,
    "0x7F5aE36F8e1DA5110D524076BeE7192064eaE8FF"
);

class JobManager {
    isRunning: boolean;
    collection: IKightMarket;

    constructor(collection: IKightMarket) {
        this.isRunning = false;
        this.collection = collection;
    }
}

class JobScanKnightMarket {
    cronJob: CronJob;
    jobManager: JobManager;

    constructor() {
        this.cronJob = new CronJob("*/3 * * * * *", async () => {
            try {
                if (!this.jobManager.isRunning) {
                    await this.handleScanKnightMarket();
                }
            } catch (e) {
                console.error(e);
            }
        });
    }

    async handleScanKnightMarket(): Promise<void> {
        try {
            const lastBlock = await web3Achemy.eth.getBlockNumber();
            this.jobManager.isRunning = true;
            const eventsLogTransfer = await KnightContract.getPastEvents(
                TYPE_EVENT.TRANSFER,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );
            console.log(eventsLogTransfer);
            const eventsLogNewKnight = await KnightContract.getPastEvents(
                TYPE_EVENT.NEW_KNIGHT,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );
            await this.handleNewKnight(eventsLogNewKnight);
            console.log(eventsLogNewKnight);
            console.log(lastBlock);
            await KnightMarketModel.updateOne({}, { scanToBlock: lastBlock });
            this.jobManager.collection.scanToBlock = lastBlock;
            this.jobManager.isRunning = false;
        } catch (error) {
          console.log('Scan knight market fail');
          
        }
    }

    async handleNewKnight(eventLogs: EventData[]): Promise<void> {
        try {
            for (const event of eventLogs) {
              const permaLinkBase = `https://testnets.opensea.io/assets/mumbai/${this.jobManager.collection.address}/${event.returnValues.knightID}`;
              const NewKnight = new KnightModel({
                  dna: event.returnValues.dna,
                  knightID: event.returnValues.knightID,
                  level: event.returnValues.level,
                  attackTime: event.returnValues.readyTime,
                  sexTime: event.returnValues.sexTime,
                  owner: event.returnValues.owner.toLowerCase(),
                  tokenURI: event.returnValues.tokenURI,
                  permaLink: permaLinkBase,
              });
              const metadata = event.returnValues.tokenURI.replace(
                  "ipfs://",
                  "https://gateway.pinata.cloud/ipfs/"
              );
              fetch(metadata)
                  .then((res) => {
                    return res.json();
                  })
                  .then((dataMeta) => {
                      NewKnight.image = dataMeta.image.replace(
                          "ipfs://",
                          "https://opensea.mypinata.cloud/ipfs/"
                      );
                      NewKnight.name = event.returnValues.name + " - " + dataMeta.name;
                      return NewKnight;
                  })
                  .then((dataKnight) => {
                      return dataKnight.save();
                  })
                  .then((result) => console.log("Create kngiht success"))
                  .catch((error) => console.log(error));
            }
        } catch (error) {
          console.log('Error create new NFT');
          
        }
    }

    async start(): Promise<void> {
        if (!this.cronJob.running) {
            await this.initManager();
            this.cronJob.start();
            console.log("Running job scan transfer NFT");
        }
    }

    async initManager(): Promise<void> {
        const knightMarket = await KnightMarketModel.findOne();
        this.jobManager = new JobManager(knightMarket);
    }
}

export const jobScanKnightMarket = new JobScanKnightMarket();
