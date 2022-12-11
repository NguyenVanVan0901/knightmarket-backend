import { config } from "dotenv";
config();

export type ConfigEnvData = {
    CHAIN_DEFAULT: number,
    CONTRACT: {
        [key : number]: {
            KnghitNFT: string
            BlockDeploy: number
            JsonRPC: string
            WebSocketRPC: string
        }
    },
}

const NODE_ENV = process.env.NODE_ENV;

const ConfigEnv: ConfigEnvData = require(`../env/${NODE_ENV}.json`); 

export default ConfigEnv;