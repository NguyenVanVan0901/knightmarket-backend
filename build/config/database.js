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
exports.objConnectDB = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const stringConnect = process.env.NODE_ENV === 'production' ? process.env.STRING_CONNECT_MONGODB : process.env.STRING_CONNECT_MONGODB_LOCAl;
const objConnectDB = {};
exports.objConnectDB = objConnectDB;
function connectDatabase(dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            objConnectDB.database = yield mongoose_1.default.connect(`${stringConnect}/${dbName}?retryWrites=true&w=majority`);
            console.log(`Connected MongoDB Successfully! DatabaseName => "${dbName}"`);
        }
        catch (error) {
            console.log(`Connected MongoDB failue! DatabaseName => "${dbName}"`);
            console.log(error);
        }
    });
}
exports.connectDatabase = connectDatabase;
