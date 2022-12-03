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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const transfer_job_1 = require("./jobs/transfer.job");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app_1.default.init();
        const appServer = yield app_1.default.start(Number(process.env.PORT) || 2105);
        appServer.on('listening', () => __awaiter(void 0, void 0, void 0, function* () {
            yield transfer_job_1.jobScanKnightMarket.start();
        }));
        process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
            yield transfer_job_1.jobScanKnightMarket.close();
            process.exit(0);
        }));
        process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
            yield transfer_job_1.jobScanKnightMarket.close();
            process.exit(0);
        }));
    }
    catch (error) {
        console.log('LISTEN ERROR:', error);
    }
}))();
