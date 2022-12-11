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
                jsonRPC:ConfigEnv.CONTRACT[ConfigEnv.CHAIN_DEFAULT].JsonRPC,
                scanToBlock: ConfigEnv.CONTRACT[ConfigEnv.CHAIN_DEFAULT].BlockDeploy,
                blockDeploy: ConfigEnv.CONTRACT[ConfigEnv.CHAIN_DEFAULT].BlockDeploy,
            }

            await KnightMarketModel.create(payloadKnightMarket);
            console.log('Success: Init knight market ');
            
        } catch (error) {
            console.log('Error:', error);
        }
    }
}

export const seedData = new SeedData();