import { Schema, model, SchemaTypes } from 'mongoose';


export interface IKightMarket {
    address: string 
    scanToBlock: number
    blockDeploy:number
    isScan?: boolean
    jsonRPC: string
}

const KnightSchema = new Schema<IKightMarket>({
    address: { type: SchemaTypes.String, set: (userAddress: string) => userAddress.toLowerCase() },
    scanToBlock:  { type: SchemaTypes.Number, required: true},
    blockDeploy: { type: SchemaTypes.Number, required: true },
    isScan: { type: SchemaTypes.Boolean, default: false},
    jsonRPC: { type: SchemaTypes.String, required: true},
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
});



export const KnightMarketModel = model<IKightMarket>('knight-market', KnightSchema);
