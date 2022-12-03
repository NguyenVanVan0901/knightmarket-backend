"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleKnightModel = void 0;
const mongoose_1 = require("mongoose");
const SaleKnight = new mongoose_1.Schema({
    knightID: { type: mongoose_1.SchemaTypes.Number, required: true },
    bidID: { type: mongoose_1.SchemaTypes.String, required: true },
    price: { type: mongoose_1.SchemaTypes.String, required: true },
    timeEnd: { type: mongoose_1.SchemaTypes.Number, required: true },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    timestamps: true,
});
SaleKnight.set('toObject', { virtuals: true });
SaleKnight.set('toJSON', { virtuals: true });
SaleKnight.virtual('knight', {
    ref: 'knight',
    localField: 'knightID',
    foreignField: 'knightID',
    justOne: true
});
exports.SaleKnightModel = (0, mongoose_1.model)('sale_knight', SaleKnight);
