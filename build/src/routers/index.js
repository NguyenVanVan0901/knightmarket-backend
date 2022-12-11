"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Knight = require('./knight');
const knight_1 = __importDefault(require("./knight"));
function route(app) {
    app.use('/v1/api', knight_1.default);
}
exports.default = route;
