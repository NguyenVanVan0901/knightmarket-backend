import { Schema, model, SchemaTypes } from 'mongoose';


export interface IKight {
    name: string 
    dna: string
    knightID:number
    level: number
    attackTime: number
    sexTime: number
    winCount?:number
    lostCount?:number
    owner: string
    tokenURI: string
    image: string
    isSalling: boolean
    permaLink:string
    maritalStatus: boolean
}

const KnightSchema = new Schema<IKight>({
    name:  { type: SchemaTypes.String, required: true},
    dna: { type: SchemaTypes.String },
    knightID: { type: SchemaTypes.Number, required: true },
    level: { type: SchemaTypes.Number, required: true },
    attackTime: { type: SchemaTypes.Number, required: true },
    sexTime: { type: SchemaTypes.Number, required: true },
    winCount:{ type: SchemaTypes.Number, default: 0 },
    lostCount:{ type: SchemaTypes.Number, default: 0 },
    owner: { type: SchemaTypes.String, set: (userAddress: string) => userAddress.toLowerCase() },
    tokenURI: { type: SchemaTypes.String, required: true },
    image: { type: SchemaTypes.String, required: true},
    isSalling: { type: SchemaTypes.Boolean, default: false},
    permaLink:{ type: SchemaTypes.String, required: true},
    maritalStatus: { type: SchemaTypes.Boolean, default: false},
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

export const KnightModel = model<IKight>('knight', KnightSchema);
