import { IKightMarket, KnightMarketModel } from "../app/models/KnightMarket";
import ConfigEnv from "../env";

class SeedData {
    async  initKnightMarket() {
        try {
            const isInserted = await KnightMarketModel.findOne();
            if (isInserted) {
                return;
            }
            const payloadKnightMarket:IKightMarket = {
                address: ConfigEnv.CONTRACT[ConfigEnv.CHAIN_DEFAULT].KnghitNFT.toLowerCase(),
                jsonRPC: ConfigEnv.JSON_RPC,
                scanToBlock: ConfigEnv.BLOCK_DEPLOY,
                blockDeploy: ConfigEnv.BLOCK_DEPLOY,
            }

            await KnightMarketModel.create(payloadKnightMarket);
            console.log('Success: Init knight market ');
            
        } catch (error) {
            console.log('Error:', error);
        }
    }
}

export const seedData = new SeedData();