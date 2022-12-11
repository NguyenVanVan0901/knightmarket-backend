"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnightModel = void 0;
const mongoose_1 = require("mongoose");
const KnightSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.SchemaTypes.String, required: true },
    dna: { type: mongoose_1.SchemaTypes.String },
    knightID: { type: mongoose_1.SchemaTypes.Number, required: true },
    level: { type: mongoose_1.SchemaTypes.Number, required: true },
    attackTime: { type: mongoose_1.SchemaTypes.Number, required: true },
    sexTime: { type: mongoose_1.SchemaTypes.Number, required: true },
    winCount: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    lostCount: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    owner: { type: mongoose_1.SchemaTypes.String, set: (userAddress) => userAddress.toLowerCase() },
    tokenURI: { type: mongoose_1.SchemaTypes.String, required: true },
    image: { type: mongoose_1.SchemaTypes.String, required: true },
    isSalling: { type: mongoose_1.SchemaTypes.Boolean, default: false },
    permaLink: { type: mongoose_1.SchemaTypes.String, required: true },
    maritalStatus: { type: mongoose_1.SchemaTypes.Boolean, default: false },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    timestamps: true,
});
KnightSchema.virtual('saleKnight', {
    ref: 'sale_knight',
    localField: 'knightID',
    foreignField: 'knightID',
    justOne: true
});
exports.KnightModel = (0, mongoose_1.model)('knight', KnightSchema);
