import { Schema, model, SchemaTypes } from 'mongoose';

const RequestMarrySchema = new Schema({
    idKnightRequest: { type: SchemaTypes.Number, required: true }, 
    idKnightResponse: { type: SchemaTypes.Number, required: true }, 
    ownerRequest: { type: SchemaTypes.String, required: true},
    ownerResponse: { type: SchemaTypes.String, required: true},
    amountGift: { type: SchemaTypes.String, required: true},
    status:{ type: SchemaTypes.String, required: true},
},
{
    timestamps:true
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
export  const RequestMarryModel = model('request_marry', RequestMarrySchema);