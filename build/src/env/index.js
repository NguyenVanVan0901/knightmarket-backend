"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const NODE_ENV = process.env.NODE_ENV;
const ConfigEnv = require(`../env/${NODE_ENV}.json`);
exports.default = ConfigEnv;
