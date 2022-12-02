import { Schema, model, SchemaTypes } from 'mongoose';

const SaleKnight = new Schema({
    knightID:{ type: SchemaTypes.Number, required: true },
    bidID: { type: SchemaTypes.String, required: true},
    price: { type: SchemaTypes.String, required: true},
    timeEnd: { type: SchemaTypes.Number, required: true },
},{
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

export  const SaleKnightModel =  model('sale_knight', SaleKnight);