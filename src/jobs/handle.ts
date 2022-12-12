import { CronJob } from "cron";
import { IKightMarket, KnightMarketModel } from "../app/models/KnightMarket";
import { TYPE_EVENT } from "../constants/global";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { EventData } from 'web3-eth-contract';
import { KnightModel } from "../app/models/Knight";
import { SaleKnightModel } from "../app/models/SaleKnight";
import axios from "axios";
import { RequestMarryModel } from "../app/models/RequestMarry";
import ConfigEnv from "../env";
import KnightAbi from "../abi/knight.json";
import Logger from "../utility/logger";
const chainId = ConfigEnv.CHAIN_DEFAULT;
const providerAchemy = new Web3.providers.WebsocketProvider(ConfigEnv.CONTRACT[chainId].WebSocketRPC);
const web3Achemy = new Web3(providerAchemy);
const KnightContract = new web3Achemy.eth.Contract(
    KnightAbi as AbiItem[],
    ConfigEnv.CONTRACT[chainId].KnghitNFT
);

class HandleEventsContract {
    protected nodeProvider;
    protected web3Provider;
    protected knightContract;


    constructor() {
        this.nodeProvider = new Web3.providers.WebsocketProvider(ConfigEnv.CONTRACT[chainId].WebSocketRPC);
        this.web3Provider = new Web3(this.nodeProvider);
        this.knightContract = new this.web3Provider.eth.Contract( KnightAbi as AbiItem[], ConfigEnv.CONTRACT[chainId].KnghitNFT);
    }

    async handleTransferLog(fromBlock: number, lastBlock: number): Promise<EventData[]> {
        try {
            const listEventsLog: EventData[] = [];
            while (fromBlock > lastBlock) {
                let blockPicker = fromBlock + 4000;
                const eventsLogTransfer = await KnightContract.getPastEvents(
                    TYPE_EVENT.TRANSFER,
                    {
                        filter: {},
                        fromBlock: fromBlock,
                        toBlock: Math.min(blockPicker, lastBlock),
                    }
                );
                listEventsLog.concat(eventsLogTransfer);
                fromBlock = blockPicker + 1 ;
            }
            return listEventsLog;
        } catch (error) {
            throw error;
        }
    }

    async handleNewKnightLog(fromBlock: number, lastBlock: number): Promise<EventData[]> {
        try {
            const lastBlock = await web3Achemy.eth.getBlockNumber();
            let listEventsLog: EventData[] = [];
            while (fromBlock < lastBlock) {
                let blockPicker = fromBlock + 4000;
                const eventsLogNewKnight = await KnightContract.getPastEvents(
                    TYPE_EVENT.NEW_KNIGHT,
                    {
                        filter: {},
                        fromBlock: fromBlock,
                        toBlock: Math.min(blockPicker, lastBlock),
                    }
                );
                listEventsLog = listEventsLog.concat(eventsLogNewKnight);
                fromBlock = blockPicker + 1 ;
            }
            return listEventsLog;
        } catch (error: any) {            
            throw error;
        }
    }

}

export {
    HandleEventsContract
};
export default new HandleEventsContract();