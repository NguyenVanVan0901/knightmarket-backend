"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobScanKnightMarket = void 0;
const cron_1 = require("cron");
const KnightMarket_1 = require("../app/models/KnightMarket");
const web3_1 = __importDefault(require("web3"));
const Knight_1 = require("../app/models/Knight");
const SaleKnight_1 = require("../app/models/SaleKnight");
const axios_1 = __importDefault(require("axios"));
const RequestMarry_1 = require("../app/models/RequestMarry");
const env_1 = __importDefault(require("../env"));
const knight_json_1 = __importDefault(require("../abi/knight.json"));
const logger_1 = __importDefault(require("../utility/logger"));
const handle_1 = require("./handle");
const chainId = env_1.default.CHAIN_DEFAULT;
const providerAchemy = new web3_1.default.providers.WebsocketProvider(env_1.default.CONTRACT[chainId].WebSocketRPC);
const web3Achemy = new web3_1.default(providerAchemy);
const KnightContract = new web3Achemy.eth.Contract(knight_json_1.default, env_1.default.CONTRACT[chainId].KnghitNFT);
class JobManager {
    constructor(callback) {
        this.isRunning = false;
        this.collection = callback();
    }
}
class JobScanKnightMarket extends handle_1.HandleEventsContract {
    constructor() {
        super();
        this.jobManager = new JobManager(() => __awaiter(this, void 0, void 0, function* () {
            return yield KnightMarket_1.KnightMarketModel.findOne();
        }));
        this.cronJob = new cron_1.CronJob("*/3 * * * * *", () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.jobManager.isRunning) {
                    yield this.handleScanKnightMarket();
                }
            }
            catch (e) {
                console.error(e);
            }
        }));
    }
    handleScanKnightMarket() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastBlock = yield web3Achemy.eth.getBlockNumber();
                const fromBlock = this.jobManager.collection.scanToBlock + 1;
                this.jobManager.isRunning = true;
                const eventsLogTransfer = yield this.handleTransferLog(fromBlock, lastBlock);
                const eventsLogNewKnight = yield this.handleNewKnightLog(fromBlock, lastBlock);
                // const eventsLogSaleKnight = await KnightContract.getPastEvents(
                //     TYPE_EVENT.SALE_KNIGHT,
                //     {
                //         filter: {},
                //         fromBlock: this.jobManager.collection.scanToBlock,
                //         toBlock: lastBlock,
                //     }
                // );
                // const eventsLogBuyKnight = await KnightContract.getPastEvents(
                //     TYPE_EVENT.BUY_KNIGHT,
                //     {
                //         filter: {},
                //         fromBlock: this.jobManager.collection.scanToBlock,
                //         toBlock: lastBlock,
                //     }
                // );
                // const eventsLogDestroySaleKnight = await KnightContract.getPastEvents(
                //     TYPE_EVENT.DESTROY_SALE_KNIGHT,
                //     {
                //         filter: {},
                //         fromBlock: this.jobManager.collection.scanToBlock,
                //         toBlock: lastBlock,
                //     }
                // );
                // const eventsLogRequestMarry = await KnightContract.getPastEvents(
                //     TYPE_EVENT.REQUEST_MARRY,
                //     {
                //         filter: {},
                //         fromBlock: this.jobManager.collection.scanToBlock,
                //         toBlock: lastBlock,
                //     }
                // );
                // const eventsLogApprovalMarry = await KnightContract.getPastEvents(
                //     TYPE_EVENT.APPROVAL_MARRY,
                //     {
                //         filter: {},
                //         fromBlock: this.jobManager.collection.scanToBlock,
                //         toBlock: lastBlock,
                //     }
                // );
                // const eventsLogLevelUp = await KnightContract.getPastEvents(
                //     TYPE_EVENT.LEVELUP,
                //     {
                //         filter: {},
                //         fromBlock: this.jobManager.collection.scanToBlock,
                //         toBlock: lastBlock,
                //     }
                // );
                // const eventsLogTriggerCooldown = await KnightContract.getPastEvents(
                //     TYPE_EVENT.TRIGGER_COOLDOWN,
                //     {
                //         filter: {},
                //         fromBlock: this.jobManager.collection.scanToBlock,
                //         toBlock: lastBlock,
                //     }
                // );
                // const eventsLogTriggerTired = await KnightContract.getPastEvents(
                //     TYPE_EVENT.TRIGGER_TIRED,
                //     {
                //         filter: {},
                //         fromBlock: this.jobManager.collection.scanToBlock,
                //         toBlock: lastBlock,
                //     }
                // );
                // const eventsLogBattelResoult = await KnightContract.getPastEvents(
                //     TYPE_EVENT.BATTLERESULTS,
                //     {
                //         filter: {},
                //         fromBlock: this.jobManager.collection.scanToBlock,
                //         toBlock: lastBlock,
                //     }
                // );
                // await this.handleTransfer(eventsLogTransfer);
                yield this.handleNewKnight(eventsLogNewKnight);
                // await this.handleSaleKnight(eventsLogSaleKnight);
                // await this.handleBuyKnight(eventsLogBuyKnight);
                // await this.handleDestroySaleKnight(eventsLogDestroySaleKnight);
                // await this.handleRequestMarry(eventsLogRequestMarry);
                // await this.handleApprovalMarry(eventsLogApprovalMarry);
                // await this.handleLevelUp(eventsLogLevelUp);
                // await this.handleTriggerCooldown(eventsLogTriggerCooldown);
                // await this.handleTriggerTired(eventsLogTriggerTired);
                // await this.handleBattelResoult(eventsLogBattelResoult);
                yield KnightMarket_1.KnightMarketModel.updateOne({}, { scanToBlock: lastBlock });
                console.log(`Handle scan from block: `, fromBlock, ' => ', lastBlock);
                this.jobManager.collection.scanToBlock = lastBlock;
                this.jobManager.isRunning = false;
            }
            catch (error) {
                console.log(this.jobManager);
                console.log('Scan knight market fail', error.message);
                this.jobManager.isRunning = false;
            }
        });
    }
    handleTransfer(eventLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('handleTransfer: ', eventLogs);
                for (const event of eventLogs) {
                    yield Knight_1.KnightModel.updateOne({ knightID: parseInt(event.returnValues.tokenId) }, { owner: event.returnValues.to.toLowerCase() });
                    console.log(`Update owner kngiht id ${event.returnValues.tokenId} success`);
                }
            }
            catch (error) {
                console.log('Error Transfer NFT', error.message);
            }
        });
    }
    handleNewKnight(eventLogs) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let i = 0; i < eventLogs.length; i++) {
                    const event = eventLogs[i];
                    const tokenIsExited = yield Knight_1.KnightModel.findOne({ knightID: parseInt(event.returnValues.knightID) });
                    if (tokenIsExited) {
                        continue;
                    }
                    const permaLinkBase = `https://testnets.opensea.io/assets/mumbai/${this.jobManager.collection.address}/${event.returnValues.knightID}`;
                    const NewKnight = new Knight_1.KnightModel({
                        dna: event.returnValues.dna,
                        knightID: event.returnValues.knightID,
                        level: event.returnValues.level,
                        attackTime: event.returnValues.readyTime,
                        sexTime: event.returnValues.sexTime,
                        owner: event.returnValues.owner.toLowerCase(),
                        tokenURI: event.returnValues.tokenURI,
                        permaLink: permaLinkBase,
                    });
                    const uriMetadata = event.returnValues.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
                    const data = yield this.handleMetadata(uriMetadata);
                    NewKnight.image = (_b = (_a = data === null || data === void 0 ? void 0 : data.image) === null || _a === void 0 ? void 0 : _a.replace("ipfs://", "https://ipfs.io/ipfs/")) !== null && _b !== void 0 ? _b : `${process.env.APP_URL}21.png`;
                    NewKnight.name = event.returnValues.name + " - " + (data === null || data === void 0 ? void 0 : data.name);
                    yield NewKnight.save();
                    console.log(`Create kngiht id ${event.returnValues.knightID} success`);
                }
            }
            catch (error) {
                console.log('Error create new NFT', error.message);
            }
        });
    }
    handleSaleKnight(eventLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const event of eventLogs) {
                    const checkSale = yield SaleKnight_1.SaleKnightModel.findOne({ bidID: event.returnValues.bidID });
                    if (!checkSale) {
                        const NewSaleKnight = new SaleKnight_1.SaleKnightModel({
                            knightID: event.returnValues.knightID,
                            price: event.returnValues.price,
                            bidID: event.returnValues.bidID,
                            timeEnd: event.returnValues.timeEnd,
                        });
                        Promise.all([
                            NewSaleKnight.save(),
                            Knight_1.KnightModel.updateOne({ knightID: parseInt(event.returnValues.knightID) }, { isSalling: true })
                        ]);
                        console.log("SaleKnight Knight Succcess");
                    }
                }
            }
            catch (error) {
                console.log('Error Handle Sale Knight: ', error.message);
            }
        });
    }
    handleBuyKnight(eventLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const event of eventLogs) {
                    const saleKnight = yield SaleKnight_1.SaleKnightModel.findOne({ bidID: event.returnValues.bidID });
                    if (saleKnight) {
                        Promise.all([
                            SaleKnight_1.SaleKnightModel.deleteOne({ bidID: event.returnValues.bidID }),
                            Knight_1.KnightModel.updateOne({ knightID: parseInt(event.returnValues.knightID) }, { $set: { isSalling: false, owner: event.returnValues.newOner.toLowerCase() } })
                        ]);
                        console.log("Delete Sale Knight Succcess", event.returnValues.knightID);
                        console.log("Update Knight Succcess", event.returnValues.knightID);
                    }
                }
            }
            catch (error) {
                console.log('Error Handle Buy Knight: ', error.message);
            }
        });
    }
    handleDestroySaleKnight(eventLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const event of eventLogs) {
                    const saleKnight = yield SaleKnight_1.SaleKnightModel.findOne({ bidID: event.returnValues.bidID });
                    if (saleKnight) {
                        Promise.all([
                            SaleKnight_1.SaleKnightModel.deleteOne({ bidID: event.returnValues.bidID }),
                            Knight_1.KnightModel.findOneAndUpdate({ knightID: saleKnight.knightID }, { $set: { isSalling: false } })
                        ]);
                        console.log("Destroy Sale Knight Succcess");
                        console.log("Update Knight Succcess");
                    }
                }
            }
            catch (error) {
                console.log('Error Handle Destroy Knight: ', error.message);
            }
        });
    }
    handleRequestMarry(eventLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const event of eventLogs) {
                    const checkRequest = RequestMarry_1.RequestMarryModel.findOne({
                        ownerRequest: event.returnValues._from.toLowerCase(),
                        ownerResponse: event.returnValues._to.toLowerCase(),
                        idKnightRequest: event.returnValues._IDknightRequest,
                        idKnightResponse: event.returnValues._IDknightResponse
                    });
                    if (!checkRequest) {
                        const newRequest = new RequestMarry_1.RequestMarryModel({
                            idKnightRequest: event.returnValues._IDknightRequest,
                            idKnightResponse: event.returnValues._IDknightResponse,
                            ownerRequest: event.returnValues._from.toLowerCase(),
                            ownerResponse: event.returnValues._to.toLowerCase(),
                            amountGift: event.returnValues.amountGift
                        });
                        yield newRequest.save();
                        console.log("Request Marry Knight Succcess");
                    }
                }
            }
            catch (error) {
                console.log('Error Request Marry Knight', error.message);
            }
        });
    }
    handleApprovalMarry(eventLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const event of eventLogs) {
                    yield RequestMarry_1.RequestMarryModel.findOneAndUpdate({
                        idKnightRequest: event.returnValues._IDknightRequest,
                        idKnightResponse: event.returnValues._IDknightResponse
                    }, { status: "Married" });
                    yield Knight_1.KnightModel.updateMany({ $or: [
                            { knightID: event.returnValues._IDknightRequest },
                            { knightID: event.returnValues._IDknightResponse }
                        ] }, { $set: { maritalStatus: true } });
                    console.log("ApprovalMarry Knight Succcess");
                }
            }
            catch (error) {
                console.log('Error ApprovalMarry Knight: ', error.message);
            }
        });
    }
    handleLevelUp(eventLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const event of eventLogs) {
                    yield Knight_1.KnightModel.updateOne({ knightID: parseInt(event.returnValues._knightID) }, { level: event.returnValues._newlevel });
                    console.log("LevelUp Knight Succcess");
                }
            }
            catch (error) {
                console.log('Error LevelUp Knight:', error.message);
            }
        });
    }
    handleTriggerCooldown(eventLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const event of eventLogs) {
                    yield Knight_1.KnightModel.updateOne({ knightID: parseInt(event.returnValues._knightID) }, { attackTime: event.returnValues._timeOut });
                    console.log("TriggerCoolDown Knight Succcess");
                }
            }
            catch (error) {
                console.log('Error TriggerCoolDown Knight:', error.message);
            }
        });
    }
    handleTriggerTired(eventLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const event of eventLogs) {
                    yield Knight_1.KnightModel.updateOne({ knightID: parseInt(event.returnValues._knightID) }, { sexTime: event.returnValues._timeOut });
                    console.log("Trigger Tired Knight Succcess");
                }
            }
            catch (error) {
                console.log('Error Trigger Tired:', error.message);
            }
        });
    }
    handleBattelResoult(eventLogs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const event of eventLogs) {
                    const knightWin = yield Knight_1.KnightModel.findOne({ knightID: parseInt(event.returnValues._knightWin) });
                    const knightLose = yield Knight_1.KnightModel.findOne({ knightID: parseInt(event.returnValues._knightLose) });
                    if (knightLose && knightWin) {
                        if (event.returnValues._result) {
                            knightWin.level += 1;
                            knightWin.winCount ? knightWin.winCount += 1 : '';
                            knightLose.lostCount ? knightLose.lostCount += 1 : '';
                        }
                        else {
                            knightWin.winCount ? knightWin.winCount += 1 : '';
                            knightLose.lostCount ? knightLose.lostCount += 1 : '';
                        }
                        yield knightWin.save();
                        console.log("Update Knight Win Succcess");
                        yield knightLose.save();
                        console.log("Update Knight Lose Succcess");
                    }
                }
            }
            catch (error) {
                console.log('Error Battel Resoult:', error.message);
            }
        });
    }
    handleMetadata(uriMetadata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(uriMetadata);
                return data;
            }
            catch (error) {
                console.log('Get metadata fail =>', uriMetadata);
                console.log('Error =>', error.message);
                return null;
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.cronJob.running) {
                    yield KnightMarket_1.KnightMarketModel.updateOne({}, { isScan: true });
                    const checkDataJob = yield this.jobManager.collection;
                    if (!checkDataJob) {
                        const knightMarket = yield KnightMarket_1.KnightMarketModel.findOne();
                        this.jobManager.collection = knightMarket ? knightMarket : yield this.jobManager.collection;
                        this.cronJob.start();
                        logger_1.default.info(`Running job with address => ${this.jobManager.collection.address}`);
                        logger_1.default.warn(`Running job with chain => ${env_1.default.CHAIN_DEFAULT}`);
                        logger_1.default.warn(`Running job with wss => ${env_1.default.CONTRACT[chainId].WebSocketRPC}`);
                    }
                    else if (checkDataJob) {
                        this.jobManager.collection = checkDataJob;
                        this.cronJob.start();
                        logger_1.default.info(`Running job with address => ${this.jobManager.collection.address}`);
                        logger_1.default.warn(`Running job with chain => ${env_1.default.CHAIN_DEFAULT}`);
                        logger_1.default.warn(`Running job with wss => ${env_1.default.CONTRACT[chainId].WebSocketRPC}`);
                    }
                    else {
                        console.log("Knight market not created yet");
                        console.log("Can't run job scan knight market");
                    }
                }
            }
            catch (error) {
                console.log('Start job scan knight market failure: ', error.message);
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.cronJob.running) {
                    // await KnightMarketModel.updateOne({}, { isScan: false });
                    yield KnightMarket_1.KnightMarketModel.deleteMany();
                    console.log("Closed job scan knight market");
                }
            }
            catch (error) {
                console.log('Close job scan knight market failure: ', error.message);
            }
        });
    }
}
exports.jobScanKnightMarket = new JobScanKnightMarket();
