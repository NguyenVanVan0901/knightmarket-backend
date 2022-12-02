import { CronJob } from "cron";
import { IKightMarket, KnightMarketModel } from "../app/models/KnightMarket";
import { TYPE_EVENT } from "../constants/global";
import Web3 from "web3";
import { EventData } from 'web3-eth-contract';
import { KnightModel } from "../app/models/Knight";
import { SaleKnightModel } from "../app/models/SaleKnight";
import axios from "axios";
import { RequestMarryModel } from "../app/models/RequestMarry";
import ConfigEnv from "../env";
const KnightAbi = require("../abi/knight.json");
const providerAchemy = new Web3.providers.WebsocketProvider(
    "wss://polygon-mumbai.g.alchemy.com/v2/wU4prjL7wZdA2-1i3rKqWVLxDoOKBQfE"
);
const web3Achemy = new Web3(providerAchemy);
const KnightContract = new web3Achemy.eth.Contract(
    KnightAbi,
    ConfigEnv.CONTRACT[ConfigEnv.CHAIN_DEFAULT].KnghitNFT
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
        this.cronJob = new CronJob("*/12 * * * * *", async () => {
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
            const fromBlock = this.jobManager.collection.scanToBlock + 1;
            this.jobManager.isRunning = true;
            
            const eventsLogTransfer = await KnightContract.getPastEvents(
                TYPE_EVENT.TRANSFER,
                {
                    filter: {},
                    fromBlock: fromBlock,
                    toBlock: lastBlock,
                }
            );

            const eventsLogNewKnight = await KnightContract.getPastEvents(
                TYPE_EVENT.NEW_KNIGHT,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );

            const eventsLogSaleKnight = await KnightContract.getPastEvents(
                TYPE_EVENT.SALE_KNIGHT,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );

            const eventsLogBuyKnight = await KnightContract.getPastEvents(
                TYPE_EVENT.BUY_KNIGHT,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );

            const eventsLogDestroySaleKnight = await KnightContract.getPastEvents(
                TYPE_EVENT.DESTROY_SALE_KNIGHT,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );
            
            const eventsLogRequestMarry = await KnightContract.getPastEvents(
                TYPE_EVENT.REQUEST_MARRY,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );

            const eventsLogApprovalMarry = await KnightContract.getPastEvents(
                TYPE_EVENT.APPROVAL_MARRY,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );

            const eventsLogLevelUp = await KnightContract.getPastEvents(
                TYPE_EVENT.LEVELUP,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );

            const eventsLogTriggerCooldown = await KnightContract.getPastEvents(
                TYPE_EVENT.TRIGGER_COOLDOWN,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );

            const eventsLogTriggerTired = await KnightContract.getPastEvents(
                TYPE_EVENT.TRIGGER_TIRED,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );

            const eventsLogBattelResoult = await KnightContract.getPastEvents(
                TYPE_EVENT.BATTLERESULTS,
                {
                    filter: {},
                    fromBlock: this.jobManager.collection.scanToBlock,
                    toBlock: lastBlock,
                }
            );
            
            await this.handleNewKnight(eventsLogNewKnight);
            await this.handleSaleKnight(eventsLogSaleKnight);
            await this.handleBuyKnight(eventsLogBuyKnight);
            await this.handleDestroySaleKnight(eventsLogDestroySaleKnight);
            await this.handleTransfer(eventsLogTransfer);
            await this.handleRequestMarry(eventsLogRequestMarry);
            await this.handleApprovalMarry(eventsLogApprovalMarry);
            await this.handleLevelUp(eventsLogLevelUp);
            await this.handleTriggerCooldown(eventsLogTriggerCooldown);
            await this.handleTriggerTired(eventsLogTriggerTired);
            await this.handleBattelResoult(eventsLogBattelResoult);
            await KnightMarketModel.updateOne({}, { scanToBlock: lastBlock });
            console.log(`Handle scan from block: `, fromBlock, ' => ', lastBlock);
            this.jobManager.collection.scanToBlock = lastBlock;
            this.jobManager.isRunning = false;
        } catch (error) {
          console.log('Scan knight market fail', error.message);
          this.jobManager.isRunning = false;
        }
    }

    async handleTransfer(eventLogs: EventData[]): Promise<void> {
        try {
            console.log('handleTransfer: ',eventLogs);
            
            for (const event of eventLogs) {
              await KnightModel.updateOne({knightID: parseInt(event.returnValues.tokenId)}, { owner: event.returnValues.to.toLowerCase()})
              console.log(`Update owner kngiht id ${ event.returnValues.tokenId } success`);
            }
        } catch (error) {
          console.log('Error Transfer NFT', error.message);
          
        }
    }

    async handleNewKnight(eventLogs: EventData[]): Promise<void> {
        try {
            for (let i = 0; i < eventLogs.length; i++) {
                const event = eventLogs[i];
                const tokenIsExited = await KnightModel.findOne({ knightID: parseInt(event.returnValues.knightID) })
                if (tokenIsExited) {
                    console.log('Da create roi');
                    return;
                }
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
                const uriMetadata = event.returnValues.tokenURI.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                );
                const { data } =  await axios.get(uriMetadata);
                NewKnight.image = data?.image?.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                );
                NewKnight.name = event.returnValues.name + " - " + data?.name;
                await NewKnight.save();
                console.log(`Create kngiht id ${ event.returnValues.knightID } success`);
            }
        } catch (error) {
          console.log('Error create new NFT', error.message);
        }
    }

    async handleSaleKnight(eventLogs: EventData[]): Promise<void> {
        try {
            for (const event of eventLogs) {
                const checkSale = await SaleKnightModel.findOne({bidID: event.returnValues.bidID});
                if(!checkSale){
                    const NewSaleKnight  = new SaleKnightModel({ 
                        knightID: event.returnValues.knightID,
                        price: event.returnValues.price,
                        bidID: event.returnValues.bidID,
                        timeEnd: event.returnValues.timeEnd,
                    });
                    Promise.all([
                        NewSaleKnight.save(),
                        KnightModel.updateOne({knightID: parseInt(event.returnValues.knightID)}, {isSalling: true})
                    ])
                    console.log("SaleKnight Knight Succcess");
                }
            }
        } catch (error) {
            console.log('Error Handle Sale Knight: ', error.message);
            
        }
    }

    async handleBuyKnight(eventLogs: EventData[]): Promise<void> { 
        try {
            for (const event of eventLogs) {
                const saleKnight = await SaleKnightModel.findOne({bidID: event.returnValues.bidID});
                if(saleKnight) {
                    Promise.all([
                        SaleKnightModel.deleteOne({bidID: event.returnValues.bidID}),
                        KnightModel.updateOne(
                            {knightID: parseInt(event.returnValues.knightID)}, 
                            {$set: { isSalling: false , owner: event.returnValues.newOner.toLowerCase()}}
                        )
                    ]);
                    console.log("Delete Sale Knight Succcess", event.returnValues.knightID);
                    console.log("Update Knight Succcess", event.returnValues.knightID);
                }
            }
        } catch (error) {
            console.log('Error Handle Buy Knight: ', error.message);
        }
    }

    async handleDestroySaleKnight(eventLogs: EventData[]): Promise<void> { 
        try {
            for (const event of eventLogs) {
                const saleKnight = await SaleKnightModel.findOne({bidID: event.returnValues.bidID});
                if(saleKnight){
                    Promise.all([
                        SaleKnightModel.deleteOne({bidID: event.returnValues.bidID}),
                        KnightModel.findOneAndUpdate({knightID: saleKnight.knightID}, {$set: { isSalling: false }})
                    ])
                    console.log("Destroy Sale Knight Succcess");
                    console.log("Update Knight Succcess");
                }
            }
        } catch (error) {
            console.log('Error Handle Destroy Knight: ', error.message);
        }
    }

    async handleRequestMarry(eventLogs: EventData[]): Promise<void> {
        try {
            for (const event of eventLogs) {
                const checkRequest = RequestMarryModel.findOne({ 
                    ownerRequest: event.returnValues._from.toLowerCase() ,
                    ownerResponse: event.returnValues._to.toLowerCase(),
                    idKnightRequest: event.returnValues._IDknightRequest, 
                    idKnightResponse: event.returnValues._IDknightResponse
                })
                if(!checkRequest) {
                    const newRequest = new RequestMarryModel({
                        idKnightRequest: event.returnValues._IDknightRequest, 
                        idKnightResponse: event.returnValues._IDknightResponse, 
                        ownerRequest: event.returnValues._from.toLowerCase(), 
                        ownerResponse: event.returnValues._to.toLowerCase(), 
                        amountGift: event.returnValues.amountGift
                    })
                    await newRequest.save();
                    console.log("Request Marry Knight Succcess");
                }
            }
        } catch (error) {
          console.log('Error Request Marry Knight', error.message);
        }
    }

    async handleApprovalMarry(eventLogs: EventData[]): Promise<void> {
        try {
            for (const event of eventLogs) {
                await RequestMarryModel.findOneAndUpdate({ 
                    idKnightRequest: event.returnValues._IDknightRequest, 
                    idKnightResponse: event.returnValues._IDknightResponse
                }, { status: "Married" });
                await KnightModel.updateMany({$or: [
                    { knightID: event.returnValues._IDknightRequest }, 
                    { knightID: event.returnValues._IDknightResponse }
                ]}, { $set: { maritalStatus: true } })
                console.log("ApprovalMarry Knight Succcess");
            }
        } catch (error) {
          console.log('Error ApprovalMarry Knight: ', error.message);
        }
    }

    async handleLevelUp(eventLogs: EventData[]): Promise<void> {
        try {
            for (const event of eventLogs) {
                await KnightModel.updateOne({ knightID: parseInt(event.returnValues._knightID) }, { level: event.returnValues._newlevel })
                console.log("LevelUp Knight Succcess");
            }
        } catch (error) {
            console.log('Error LevelUp Knight:', error.message);
        }
    }

    async handleTriggerCooldown(eventLogs: EventData[]): Promise<void> {
        try {
            for (const event of eventLogs) {
                await KnightModel.updateOne(
                    { knightID: parseInt(event.returnValues._knightID) }, 
                    { attackTime: event.returnValues._timeOut }
                );
                console.log("TriggerCoolDown Knight Succcess");
            }
        } catch (error) {
            console.log('Error TriggerCoolDown Knight:', error.message);
        }
    }

    async handleTriggerTired(eventLogs: EventData[]): Promise<void> {
        try {
            for (const event of eventLogs) {
                await KnightModel.updateOne({ knightID: parseInt(event.returnValues._knightID) }, { sexTime: event.returnValues._timeOut })
                console.log("Trigger Tired Knight Succcess");
            }
        } catch (error) {
            console.log('Error Trigger Tired:', error.message);
            
        }
    }

    async handleBattelResoult(eventLogs: EventData[]): Promise<void> {
        try {
            for (const event of eventLogs) {
                const knightWin = await KnightModel.findOne({ knightID: parseInt(event.returnValues._knightWin) });
                const knightLose = await KnightModel.findOne({ knightID: parseInt(event.returnValues._knightLose) });
                if(event.returnValues._result) {
                    knightWin.level += knightWin.level +1;
                    knightWin.winCount += knightWin.winCount +1;
                    knightLose.lostCount += knightWin.lostCount +1;
                } else {
                    knightWin.winCount += knightWin.winCount +1;
                    knightLose.lostCount += knightWin.lostCount +1;
                }
                await knightWin.save()
                console.log("Update Knight Win Succcess");
                await knightLose.save()
                console.log("Update Knight Lose Succcess");
            }
        } catch (error) {
            console.log('Error Battel Resoult:', error.message);
        }
    }
    

    async start(): Promise<void> {
        if (!this.cronJob.running) {
            await this.initManager();
            await KnightMarketModel.updateOne({}, { isScan: true });
            this.cronJob.start();
            console.log("Running job scan transfer NFT");
        }
    }

    async close(): Promise<void> {
        if (this.cronJob.running) {
            await KnightMarketModel.updateOne({}, { isScan: false });
            console.log("Closed job scan transfer NFT");
        }
    }

    async initManager(): Promise<void> {
        const knightMarket = await KnightMarketModel.findOne();
        this.jobManager = new JobManager(knightMarket);
    }
}

export const jobScanKnightMarket = new JobScanKnightMarket();
