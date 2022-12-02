
import { KnightModel } from '../models/Knight';
import { RequestMarryModel } from '../models/RequestMarry';
import { SaleKnightModel } from '../models/SaleKnight';
const { ADDRESS_SMARTCONTRACT } = process.env;
class KnightController {
    
    async storeRequestMarry(req, res) {
        const {idKnightRequest, idKnightResponse, ownerRequest, ownerResponse, amountGift} = req.body;
        const newRequest = new RequestMarryModel({
            idKnightRequest, 
            idKnightResponse, 
            ownerRequest:ownerRequest.toLowerCase(), 
            ownerResponse:ownerResponse.toLowerCase(), 
            amountGift
        })
        newRequest.save() 
        .then((data)=> {
            console.log(data);
            res.status(200).json({success: true});
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({success: false});
        })
    }
    
    async updateRequestMarry(req,res) {
        const {idKnightRequest, idKnightResponse } = req.body;
        RequestMarryModel.findOneAndUpdate({idKnightRequest, idKnightResponse}, {status: "Married"})
        .then((data)=> {
            KnightModel.updateMany({$or: [{knightID:idKnightRequest }, {knightID: idKnightResponse}]}, {$set:{maritalStatus: true}})
            .then((data) =>{
                console.log(data);
                res.status(200).json({success: true})
            })
            .catch((error) => res.status(200).json({success: false}));
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({success: false});
        })
    }

    async destroyMarry(req, res) {
        const {idKnightRequest, idKnightResponse } = req.query;
        RequestMarryModel.findOneAndDelete({idKnightRequest, idKnightResponse})
        .then((data)=> {
            console.log(data);
            KnightModel.updateMany({$or: [{knightID:idKnightRequest }, {knightID: idKnightResponse}]}, {$set:{maritalStatus: false}})
            res.status(200).json({success: true});
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({success: false});
        })
    }

    async getRequestMarry(req, res) {
        const { owner } = req.query;
        console.log(req.query);
        try {
            const listRequest = await RequestMarryModel.find({ $or: [{ ownerRequest: owner.toLowerCase() }, { ownerResponse: owner.toLowerCase()}]})
            .populate("knightRequest knightResponse").sort({ createdAt: -1 })
            if(listRequest)
            {
                res.status(200).json({success:true, data:listRequest });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({success: false});
        }
    }

    async storeKnight(req, res) {
        const { name, dna, knightID, level, attackTime, sexTime, owner, tokenURI} = req.body;
        const permaLinkBase = `https://testnets.opensea.io/assets/rinkeby/${ADDRESS_SMARTCONTRACT}/${knightID}`;
        const NewKnight  = new KnightModel({ 
            dna,
            knightID,
            level,
            attackTime,
            sexTime,
            owner,
            tokenURI,
            permaLink: permaLinkBase
        });
        const metadata = tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
        fetch(metadata)
        .then((res)=> res.json())
        .then((data) => {
            NewKnight.image = data.image.replace("ipfs://","https://opensea.mypinata.cloud/ipfs/");
            NewKnight.name = name + " - " + data.name;
            return NewKnight;
        })
        .then((dataKnight) => {
           return dataKnight.save();
        })
        .then((result) =>  res.status(200).json({success:true, data: result}))
        .catch((error) => console.log(error));  
    }

    async getKnightsOfOwner(req, res) {
        try {
            // jobTransferNFT.start();
            const { owner } = req.query;
            const knightsOfOwner = await KnightModel.find({owner: owner.toLowerCase()}).populate("saleKnight").sort({ createdAt: -1 }).limit(20);
            if(knightsOfOwner){
                res.status(200).json({success:true, data: knightsOfOwner});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false});
        }
    }
    async getKnightById(req,res){
        try {
            const { id } = req.query;
            const knightsOfOwner = await KnightModel.findOne({knightID: id})
            .then((data) => {
                res.status(200).json({success:true, data});
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false});
        }
    }

    async getKnightNotOwner(req,res) {
        try {
            const { owner } = req.query;
            const knightsNotOwner = await KnightModel.find({owner: { $ne: owner.toLowerCase() }}).sort({ createdAt: -1 }).limit(20);
            if(knightsNotOwner){
                res.status(200).json({success:true, data: knightsNotOwner});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false});
        }
    }

    async storeSaleKnight(req, res) {
        const {knightID, price, bidID, timeEnd} = req.body;
        const NewSaleKnight  = new SaleKnightModel({ 
            knightID,
            price,
            bidID,
            timeEnd,
        });
        await NewSaleKnight.save()
        .then((storeRes) => {
            return  KnightModel.updateOne({knightID: parseInt(knightID)}, {isSalling: true})
        })
        .then((updateRes) => {
            res.status(200).json({status: 200, message:"save sale knight succces."})
        })
        .catch((error) => console.log("Create sale kngiht false: ", error))
    }

    async getSaleKnight(req, res) {
        try {
            const now = Math.floor(new Date().getTime() / 1000);
            const maxSale = await SaleKnightModel.find({}).populate("knight").sort({"price": -1 }).limit(5)
            const listSaleKnight = await SaleKnightModel.find({timeEnd: {$gt: now}, price: {$lt: maxSale[4].price}}).populate("knight").sort({ createdAt: -1 }).limit(4);
            if(listSaleKnight)
            {
                res.status(200).json({status: 200, message:"succces.", data: listSaleKnight, maxSale});
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({success: false});
        }
    }

    async buySaleKnight(req, res) {
        const { bidID, newOwner} = req.body;
        console.log(req.body)
        SaleKnightModel.findOneAndDelete({ bidID })
        .then((daleteRes) => {
           if (daleteRes) {
                return KnightModel.updateOne({knightID: daleteRes.knightID}, {$set: { owner: newOwner.toLowerCase() , isSalling: false}})
           }
           throw 'bidId not found';
        })
        .then((updateRes) => {
            console.log(updateRes);
            res.status(200).json({status: 200, message: "Buy Sale Knight success"})
        })
        .catch((error) => console.log("Buy Sale Knight False: ", error));
    }

    async destroySaleKnight(req, res) {
        const { bidID } = req.query;
        SaleKnightModel.findOneAndDelete({bidID})
        .then((dataRes) => {
            if (dataRes) {
                return KnightModel.findOneAndUpdate({knightID: dataRes.knightID}, {$set: {isSalling: false}})
            }
            throw 'bidId not found';
        })
        .then((resClient) => res.status(200).json({status: 200, message: "Destroy sale knight success!"}))
        .catch((error) =>{
            res.status(500).json({status: 500, message:"Destroy sale knight false!"})
        })

    }

    async levelUp(req, res) {
        const {knightID} = req.body;
        const myKnight = await KnightModel.findOne({knightID})
        if (myKnight) {
            myKnight.level += 1;
            myKnight.save()
            .then((dataUpdate) => {
                console.log(dataUpdate);
                return res.status(200).json({statu: 200, message:"level up success!"});
            })
            .catch((error) => {
                return res.status(500).json({statu: 500, message:"level up false!"});
            })
        }
        return res.status(500).json({statu: 500, message:"level up false!"});

    }

    async changeName(req, res) {
        const {knightID, newName} = req.body;
        const myKnight = await KnightModel.findOne({knightID})
        if (myKnight) {
            KnightModel.updateOne({knightID}, {$set:{name: newName + " - " + myKnight.name.split(" - ")[1]}})
            .then((dataUpdate) => {
                res.status(200).json({statu: 200, message:"Change name success!"});
            })
            .catch((error) => {
                res.status(500).json({statu: 500, message:"Change name false!"});
            })
        }
        return res.status(500).json({statu: 500, message:"changeName false!"});
    }

    async battleResults(req, res) {
        const {result, idKnightWin, idKnightLose} = req.body;
        const knightWin = await KnightModel.findOne({knightID: parseInt(idKnightWin)});
        const knightLose = await KnightModel.findOne({knightID: parseInt(idKnightLose)});
        if (knightLose && knightWin) {
            if(result) {
                knightWin.level += 1;
                knightWin.winCount += 1;
                knightLose.lostCount += 1;
            } else {
                knightWin.winCount += 1;
                knightLose.lostCount += 1;
            }
            await knightWin.save()
            .then((dataWin) =>{
                return knightLose.save()
            })
            .then((dataLose) => {
                return res.status(200).json({statu: 200, message:"Attack done!"});
            })
            .catch((error) => {
                return res.status(500).json({statu: 500, message:"Attack false!"});
            });
        }
    }

    async triggerCoolDown(req, res) {
        const {knightID, timeOut} = req.body;
        KnightModel.updateOne({knightID: parseInt(knightID)}, {$set: { attackTime: timeOut}})
        .then((dataUpdate) => {
            res.status(200).json({statu: 200, message:"Trigger coolDown done!"});
        })
        .catch((error) => {
            res.status(500).json({statu: 500, message:"Trigger coolDown false!"});
        })
    }

    async triggerTired(req, res) {
        const {knightID, timeOut} = req.body;
        KnightModel.updateOne({knightID: parseInt(knightID)},{$set:  { sexTime: timeOut}})
        .then((dataUpdate) => {
            res.status(200).json({statu: 200, message:"Trigger coolDown done!"});
        })
        .catch((error) => {
            res.status(500).json({statu: 500, message:"Trigger coolDown false!"});
        })
    }

    async transferFrom(req, res) {
        const {knightID, newOwner} = req.body;
        KnightModel.findOneAndUpdate({knightID}, {$set: {owner: newOwner.toLowerCase()}})
        .then((data) => {
            res.status(200).json({statu: 200, message:"Transfer from done!"});
        })
        .catch((error) => {
            res.status(500).json({statu: 500, message:"Transfer from false!"});
        })
    }

    async allKnight(req, res) {
        KnightModel.find().sort({createdAt: -1})
        .then((data) => {
            res.status(200).json({statu: 200, message:"success", data});
        })
        .catch((error) => {
            res.status(500).json({statu: 500, message:"false!"});
        })
    }

    async saleMaxKnight(req, res) {
        const now = Math.floor(new Date().getTime() / 1000);
        const maxSale = await SaleKnightModel.find({timeEnd: {$gt: now}}).populate("knight").sort({"price": -1 }).limit(1)
        .then((data) => {
            res.status(200).json({statu: 200, message:"success", data});
        })
        .catch((error) => {
            res.status(500).json({statu: 500, message:"false!"});
        })
    }

    async saleMediumKnight(req, res) {
        try {
            const now = Math.floor(new Date().getTime() / 1000);
            const maxSale = await SaleKnightModel.find({}).populate("knight").sort({"price": -1 }).limit(1)
            const listSaleKnight = await SaleKnightModel.find({timeEnd: {$gt: now}, price: {$lt: maxSale[0].price}}).populate("knight").sort({ createdAt: -1 }).limit(4);
            if(listSaleKnight)
            {
                res.status(200).json({status: 200, message:"succces.", data: listSaleKnight });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({success: false});
        }
    }
}


export default new KnightController;