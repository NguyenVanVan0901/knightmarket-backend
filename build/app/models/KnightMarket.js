"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnightMarketModel = void 0;
const mongoose_1 = require("mongoose");
const KnightSchema = new mongoose_1.Schema({
    address: { type: mongoose_1.SchemaTypes.String, set: (userAddress) => userAddress.toLowerCase() },
    scanToBlock: { type: mongoose_1.SchemaTypes.Number, required: true },
    blockDeploy: { type: mongoose_1.SchemaTypes.Number, required: true },
    isScan: { type: mongoose_1.SchemaTypes.Boolean, default: false },
    jsonRPC: { type: mongoose_1.SchemaTypes.String, required: true },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});
exports.KnightMarketModel = (0, mongoose_1.model)('knight-market', KnightSchema);
