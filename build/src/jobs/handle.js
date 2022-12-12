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
exports.HandleEventsContract = void 0;
const global_1 = require("../constants/global");
const web3_1 = __importDefault(require("web3"));
const env_1 = __importDefault(require("../env"));
const knight_json_1 = __importDefault(require("../abi/knight.json"));
const chainId = env_1.default.CHAIN_DEFAULT;
const providerAchemy = new web3_1.default.providers.WebsocketProvider(env_1.default.CONTRACT[chainId].WebSocketRPC);
const web3Achemy = new web3_1.default(providerAchemy);
const KnightContract = new web3Achemy.eth.Contract(knight_json_1.default, env_1.default.CONTRACT[chainId].KnghitNFT);
class HandleEventsContract {
    constructor() {
        this.nodeProvider = new web3_1.default.providers.WebsocketProvider(env_1.default.CONTRACT[chainId].WebSocketRPC);
        this.web3Provider = new web3_1.default(this.nodeProvider);
        this.knightContract = new this.web3Provider.eth.Contract(knight_json_1.default, env_1.default.CONTRACT[chainId].KnghitNFT);
    }
    handleTransferLog(fromBlock, lastBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listEventsLog = [];
                while (fromBlock > lastBlock) {
                    let blockPicker = fromBlock + 4000;
                    const eventsLogTransfer = yield KnightContract.getPastEvents(global_1.TYPE_EVENT.TRANSFER, {
                        filter: {},
                        fromBlock: fromBlock,
                        toBlock: Math.min(blockPicker, lastBlock),
                    });
                    listEventsLog.concat(eventsLogTransfer);
                    fromBlock = blockPicker + 1;
                }
                return listEventsLog;
            }
            catch (error) {
                throw error;
            }
        });
    }
    handleNewKnightLog(fromBlock, lastBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastBlock = yield web3Achemy.eth.getBlockNumber();
                let listEventsLog = [];
                while (fromBlock < lastBlock) {
                    let blockPicker = fromBlock + 4000;
                    const eventsLogNewKnight = yield KnightContract.getPastEvents(global_1.TYPE_EVENT.NEW_KNIGHT, {
                        filter: {},
                        fromBlock: fromBlock,
                        toBlock: Math.min(blockPicker, lastBlock),
                    });
                    listEventsLog = listEventsLog.concat(eventsLogNewKnight);
                    fromBlock = blockPicker + 1;
                }
                return listEventsLog;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.HandleEventsContract = HandleEventsContract;
exports.default = new HandleEventsContract();
