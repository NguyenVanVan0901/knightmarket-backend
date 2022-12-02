import { config } from "dotenv";
config();

const NODE_ENV = process.env.NODE_ENV;

const ConfigEnv = require(`../env/${NODE_ENV}.json`); 

export default ConfigEnv;