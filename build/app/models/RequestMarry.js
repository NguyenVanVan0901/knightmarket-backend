"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestMarryModel = void 0;
const mongoose_1 = require("mongoose");
const RequestMarrySchema = new mongoose_1.Schema({
    idKnightRequest: { type: mongoose_1.SchemaTypes.Number, required: true },
    idKnightResponse: { type: mongoose_1.SchemaTypes.Number, required: true },
    ownerRequest: { type: mongoose_1.SchemaTypes.String, required: true },
    ownerResponse: { type: mongoose_1.SchemaTypes.String, required: true },
    amountGift: { type: mongoose_1.SchemaTypes.String, required: true },
    status: { type: mongoose_1.SchemaTypes.String, required: true },
}, {
    timestamps: true
});
RequestMarrySchema.set('toObject', { virtuals: true });
RequestMarrySchema.set('toJSON', { virtuals: true });
RequestMarrySchema.virtual('knightRequest', {
    ref: 'knight',
    localField: 'idKnightRequest',
    foreignField: 'knightID',
    justOne: true
});
RequestMarrySchema.virtual('knightResponse', {
    ref: 'knight',
    localField: 'idKnightResponse',
    foreignField: 'knightID',
    justOne: true
});
exports.RequestMarryModel = (0, mongoose_1.model)('request_marry', RequestMarrySchema);
