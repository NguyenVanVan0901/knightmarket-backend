"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Knight_1 = require("../models/Knight");
const RequestMarry_1 = require("../models/RequestMarry");
const SaleKnight_1 = require("../models/SaleKnight");
const { ADDRESS_SMARTCONTRACT } = process.env;
class KnightController {
    storeRequestMarry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idKnightRequest, idKnightResponse, ownerRequest, ownerResponse, amountGift } = req.body;
            const newRequest = new RequestMarry_1.RequestMarryModel({
                idKnightRequest,
                idKnightResponse,
                ownerRequest: ownerRequest.toLowerCase(),
                ownerResponse: ownerResponse.toLowerCase(),
                amountGift
            });
            newRequest.save()
                .then((data) => {
                console.log(data);
                res.status(200).json({ success: true });
            })
                .catch((error) => {
                console.log(error);
                res.status(500).json({ success: false });
            });
        });
    }
    updateRequestMarry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idKnightRequest, idKnightResponse } = req.body;
            RequestMarry_1.RequestMarryModel.findOneAndUpdate({ idKnightRequest, idKnightResponse }, { status: "Married" })
                .then((data) => {
                Knight_1.KnightModel.updateMany({ $or: [{ knightID: idKnightRequest }, { knightID: idKnightResponse }] }, { $set: { maritalStatus: true } })
                    .then((data) => {
                    console.log(data);
                    res.status(200).json({ success: true });
                })
                    .catch((error) => res.status(200).json({ success: false }));
            })
                .catch((error) => {
                console.log(error);
                res.status(500).json({ success: false });
            });
        });
    }
    destroyMarry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idKnightRequest, idKnightResponse } = req.query;
            RequestMarry_1.RequestMarryModel.findOneAndDelete({ idKnightRequest, idKnightResponse })
                .then((data) => {
                console.log(data);
                Knight_1.KnightModel.updateMany({ $or: [{ knightID: idKnightRequest }, { knightID: idKnightResponse }] }, { $set: { maritalStatus: false } });
                res.status(200).json({ success: true });
            })
                .catch((error) => {
                console.log(error);
                res.status(500).json({ success: false });
            });
        });
    }
    getRequestMarry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { owner } = req.query;
            try {
                if (owner && typeof owner === 'string') {
                    const listRequest = yield RequestMarry_1.RequestMarryModel.find({ $or: [
                            { ownerRequest: owner.toLowerCase() },
                            { ownerResponse: owner.toLowerCase() }
                        ] })
                        .populate("knightRequest knightResponse")
                        .sort({ createdAt: -1 });
                    if (listRequest) {
                        return res.status(200).json({ success: true, data: listRequest });
                    }
                }
                throw new Error('owner not found');
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false });
            }
        });
    }
    storeKnight(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, dna, knightID, level, attackTime, sexTime, owner, tokenURI } = req.body;
            const permaLinkBase = `https://testnets.opensea.io/assets/rinkeby/${ADDRESS_SMARTCONTRACT}/${knightID}`;
            const NewKnight = new Knight_1.KnightModel({
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
                .then((res) => res.json())
                .then((data) => {
                NewKnight.image = data.image.replace("ipfs://", "https://opensea.mypinata.cloud/ipfs/");
                NewKnight.name = name + " - " + data.name;
                return NewKnight;
            })
                .then((dataKnight) => {
                return dataKnight.save();
            })
                .then((result) => res.status(200).json({ success: true, data: result }))
                .catch((error) => console.log(error));
        });
    }
    getKnightsOfOwner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { owner } = req.query;
                if (owner && typeof owner === 'string') {
                    const knightsOfOwner = yield Knight_1.KnightModel.find({ owner: owner.toLowerCase() })
                        .populate("saleKnight")
                        .sort({ createdAt: -1 })
                        .limit(20);
                    if (knightsOfOwner) {
                        return res.status(200).json({ success: true, data: knightsOfOwner });
                    }
                }
                throw new Error('owner not found');
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false });
            }
        });
    }
    getKnightById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const knightsOfOwner = yield Knight_1.KnightModel.findOne({ knightID: id })
                    .then((data) => {
                    res.status(200).json({ success: true, data });
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false });
            }
        });
    }
    getKnightNotOwner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { owner } = req.query;
                if (owner && typeof owner === 'string') {
                    const knightsNotOwner = yield Knight_1.KnightModel.find({ owner: { $ne: owner.toLowerCase() } }).sort({ createdAt: -1 }).limit(20);
                    if (knightsNotOwner) {
                        return res.status(200).json({ success: true, data: knightsNotOwner });
                    }
                }
                throw new Error('owner not found');
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false });
            }
        });
    }
    storeSaleKnight(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { knightID, price, bidID, timeEnd } = req.body;
            const NewSaleKnight = new SaleKnight_1.SaleKnightModel({
                knightID,
                price,
                bidID,
                timeEnd,
            });
            yield NewSaleKnight.save()
                .then((storeRes) => {
                return Knight_1.KnightModel.updateOne({ knightID: parseInt(knightID) }, { isSalling: true });
            })
                .then((updateRes) => {
                res.status(200).json({ status: 200, message: "save sale knight succces." });
            })
                .catch((error) => console.log("Create sale kngiht false: ", error));
        });
    }
    getSaleKnight(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = Math.floor(new Date().getTime() / 1000);
                const maxSale = yield SaleKnight_1.SaleKnightModel.find({}).populate("knight").sort({ "price": -1 }).limit(5);
                const listSaleKnight = yield SaleKnight_1.SaleKnightModel.find({ timeEnd: { $gt: now }, price: { $lt: maxSale[4].price } }).populate("knight").sort({ createdAt: -1 }).limit(4);
                if (listSaleKnight) {
                    res.status(200).json({ status: 200, message: "succces.", data: listSaleKnight, maxSale });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false });
            }
        });
    }
    buySaleKnight(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bidID, newOwner } = req.body;
            console.log(req.body);
            SaleKnight_1.SaleKnightModel.findOneAndDelete({ bidID })
                .then((daleteRes) => {
                if (daleteRes) {
                    return Knight_1.KnightModel.updateOne({ knightID: daleteRes.knightID }, { $set: { owner: newOwner.toLowerCase(), isSalling: false } });
                }
                throw 'bidId not found';
            })
                .then((updateRes) => {
                console.log(updateRes);
                res.status(200).json({ status: 200, message: "Buy Sale Knight success" });
            })
                .catch((error) => console.log("Buy Sale Knight False: ", error));
        });
    }
    destroySaleKnight(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bidID } = req.query;
            SaleKnight_1.SaleKnightModel.findOneAndDelete({ bidID })
                .then((dataRes) => {
                if (dataRes) {
                    return Knight_1.KnightModel.findOneAndUpdate({ knightID: dataRes.knightID }, { $set: { isSalling: false } });
                }
                throw 'bidId not found';
            })
                .then((resClient) => res.status(200).json({ status: 200, message: "Destroy sale knight success!" }))
                .catch((error) => {
                res.status(500).json({ status: 500, message: "Destroy sale knight false!" });
            });
        });
    }
    levelUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { knightID } = req.body;
            const myKnight = yield Knight_1.KnightModel.findOne({ knightID });
            if (myKnight) {
                myKnight.level += 1;
                myKnight.save()
                    .then((dataUpdate) => {
                    console.log(dataUpdate);
                    return res.status(200).json({ statu: 200, message: "level up success!" });
                })
                    .catch((error) => {
                    return res.status(500).json({ statu: 500, message: "level up false!" });
                });
            }
            return res.status(500).json({ statu: 500, message: "level up false!" });
        });
    }
    changeName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { knightID, newName } = req.body;
            const myKnight = yield Knight_1.KnightModel.findOne({ knightID });
            if (myKnight) {
                Knight_1.KnightModel.updateOne({ knightID }, { $set: { name: newName + " - " + myKnight.name.split(" - ")[1] } })
                    .then((dataUpdate) => {
                    res.status(200).json({ statu: 200, message: "Change name success!" });
                })
                    .catch((error) => {
                    res.status(500).json({ statu: 500, message: "Change name false!" });
                });
            }
            return res.status(500).json({ statu: 500, message: "changeName false!" });
        });
    }
    battleResults(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { result, idKnightWin, idKnightLose } = req.body;
            const knightWin = yield Knight_1.KnightModel.findOne({ knightID: parseInt(idKnightWin) });
            const knightLose = yield Knight_1.KnightModel.findOne({ knightID: parseInt(idKnightLose) });
            if (knightLose && knightWin) {
                if (result) {
                    knightWin.level += 1;
                    knightWin.winCount ? knightWin.winCount += 1 : '';
                    knightLose.lostCount ? knightLose.lostCount += 1 : '';
                }
                else {
                    knightWin.winCount ? knightWin.winCount += 1 : '';
                    knightLose.lostCount ? knightLose.lostCount += 1 : '';
                }
                yield knightWin.save()
                    .then((dataWin) => {
                    return knightLose.save();
                })
                    .then((dataLose) => {
                    return res.status(200).json({ statu: 200, message: "Attack done!" });
                })
                    .catch((error) => {
                    return res.status(500).json({ statu: 500, message: "Attack false!" });
                });
            }
        });
    }
    triggerCoolDown(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { knightID, timeOut } = req.body;
            Knight_1.KnightModel.updateOne({ knightID: parseInt(knightID) }, { $set: { attackTime: timeOut } })
                .then((dataUpdate) => {
                res.status(200).json({ statu: 200, message: "Trigger coolDown done!" });
            })
                .catch((error) => {
                res.status(500).json({ statu: 500, message: "Trigger coolDown false!" });
            });
        });
    }
    triggerTired(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { knightID, timeOut } = req.body;
            Knight_1.KnightModel.updateOne({ knightID: parseInt(knightID) }, { $set: { sexTime: timeOut } })
                .then((dataUpdate) => {
                res.status(200).json({ statu: 200, message: "Trigger coolDown done!" });
            })
                .catch((error) => {
                res.status(500).json({ statu: 500, message: "Trigger coolDown false!" });
            });
        });
    }
    transferFrom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { knightID, newOwner } = req.body;
            Knight_1.KnightModel.findOneAndUpdate({ knightID }, { $set: { owner: newOwner.toLowerCase() } })
                .then((data) => {
                res.status(200).json({ statu: 200, message: "Transfer from done!" });
            })
                .catch((error) => {
                res.status(500).json({ statu: 500, message: "Transfer from false!" });
            });
        });
    }
    allKnight(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            Knight_1.KnightModel.find().sort({ createdAt: -1 })
                .then((data) => {
                res.status(200).json({ statu: 200, message: "success", data });
            })
                .catch((error) => {
                res.status(500).json({ statu: 500, message: "false!" });
            });
        });
    }
    saleMaxKnight(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Math.floor(new Date().getTime() / 1000);
            const maxSale = yield SaleKnight_1.SaleKnightModel.find({ timeEnd: { $gt: now } }).populate("knight").sort({ "price": -1 }).limit(1)
                .then((data) => {
                res.status(200).json({ statu: 200, message: "success", data });
            })
                .catch((error) => {
                res.status(500).json({ statu: 500, message: "false!" });
            });
        });
    }
    saleMediumKnight(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = Math.floor(new Date().getTime() / 1000);
                const maxSale = yield SaleKnight_1.SaleKnightModel.find({}).populate("knight").sort({ "price": -1 }).limit(1);
                const listSaleKnight = yield SaleKnight_1.SaleKnightModel.find({ timeEnd: { $gt: now }, price: { $lt: maxSale[0].price } }).populate("knight").sort({ createdAt: -1 }).limit(4);
                if (listSaleKnight) {
                    res.status(200).json({ status: 200, message: "succces.", data: listSaleKnight });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false });
            }
        });
    }
}
exports.default = new KnightController;
