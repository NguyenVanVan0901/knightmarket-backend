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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routers_1 = __importDefault(require("./routers"));
const database_1 = require("./config/database");
const seed_1 = require("./config/seed");
const logger_1 = __importDefault(require("./utility/logger"));
class App {
    constructor() {
        this.express = (0, express_1.default)();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, database_1.connectDatabase)('KnightMarket');
            this.express.use((0, cors_1.default)());
            this.express.use(express_1.default.json());
            this.express.use(express_1.default.urlencoded({ extended: true }));
            // -- file upload
            this.express.use('/static', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
            // -- router
            yield (0, routers_1.default)(this.express);
            // Init data
            yield seed_1.seedData.initKnightMarket();
        });
    }
    start(port) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.express.listen(port, () => logger_1.default.info(`App running on port: ${port}`));
        });
    }
}
exports.default = new App();
