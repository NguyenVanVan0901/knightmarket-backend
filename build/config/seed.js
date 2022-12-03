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
exports.seedData = void 0;
const KnightMarket_1 = require("../app/models/KnightMarket");
const env_1 = __importDefault(require("../env"));
class SeedData {
    initKnightMarket() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isInserted = yield KnightMarket_1.KnightMarketModel.findOne();
                if (isInserted) {
                    return;
                }
                const payloadKnightMarket = {
                    address: env_1.default.CONTRACT[env_1.default.CHAIN_DEFAULT].KnghitNFT.toLowerCase(),
                    jsonRPC: env_1.default.JSON_RPC,
                    scanToBlock: env_1.default.BLOCK_DEPLOY,
                    blockDeploy: env_1.default.BLOCK_DEPLOY,
                };
                yield KnightMarket_1.KnightMarketModel.create(payloadKnightMarket);
                console.log('Success: Init knight market ');
            }
            catch (error) {
                console.log('Error:', error);
            }
        });
    }
}
exports.seedData = new SeedData();
