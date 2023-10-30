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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHistory = exports.deleteGiftCard = exports.viewAllHistory = exports.populateHistory = exports.buyGiftCard = exports.oneGiftCard = exports.allGiftCards = exports.populateGiftCard = exports.createGiftCard = void 0;
const errorSet_1 = require("../error/errorSet");
const giftModel_1 = __importDefault(require("../model/giftModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const historyModel_1 = __importDefault(require("../model/historyModel"));
const createGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { giftName, giftPrice, giftTerms } = req.body;
        const { _id } = req.params;
        // const { secure_url, public_id }: any = await streamUpload(req);
        const giftUser = yield userModel_1.default.findById(_id);
        const gifted = yield giftModel_1.default.create({
            giftName,
            giftPrice,
            giftTerms,
            userID: _id,
            // image: secure_url,
            // imageID: public_id,
        });
        if (giftUser) {
            giftUser === null || giftUser === void 0 ? void 0 : giftUser.gift.push(new mongoose_1.default.Types.ObjectId(gifted === null || gifted === void 0 ? void 0 : gifted._id));
            giftUser === null || giftUser === void 0 ? void 0 : giftUser.save();
            return res.status(errorSet_1.RESPONSE.CREATED).json({
                message: `Successfully created gift card`,
                data: gifted,
            });
        }
        else {
            return res.status(errorSet_1.RESPONSE.NOT_AUTHORIZED).json({
                message: `You can do this!!!`,
            });
        }
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: "error buying giftcards",
            data: error.message,
        });
    }
});
exports.createGiftCard = createGiftCard;
const populateGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const gifted = yield userModel_1.default.findById(_id).populate({
            path: "gift",
            options: {
                sort: { createdAt: -1 },
            },
        });
        return res.status(errorSet_1.RESPONSE.OK).json({
            message: `Gifts Populated`,
            data: gifted,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: "error populating gift cards",
            data: error.message,
        });
    }
});
exports.populateGiftCard = populateGiftCard;
const allGiftCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allGiftCard = yield giftModel_1.default.find().sort({
            createdAt: -1,
        });
        return res.status(errorSet_1.RESPONSE.OK).json({
            message: "allGiftCard successfully viewed",
            data: allGiftCard,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: `error viewing all gift cards`,
            data: error.message,
        });
    }
});
exports.allGiftCards = allGiftCards;
const oneGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { giftID } = req.params;
        const oneGift = yield giftModel_1.default.findById(giftID);
        return res.status(errorSet_1.RESPONSE.OK).json({
            message: "oneGift successfully viewed",
            data: oneGift,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: `error viewing one gift card`,
            data: error.message,
        });
    }
});
exports.oneGiftCard = oneGiftCard;
const buyGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        const { _id, giftID } = req.params;
        const giftUser = yield userModel_1.default.findById(_id);
        const gift = yield giftModel_1.default.findById(giftID);
        if ((giftUser === null || giftUser === void 0 ? void 0 : giftUser.wallet) < amount) {
            return res.status(errorSet_1.RESPONSE.NOT_AUTHORIZED).json({
                message: `You can not purchase`,
            });
        }
        else {
            if ((gift === null || gift === void 0 ? void 0 : gift.bought) !== true) {
                const history = yield historyModel_1.default.create({
                    amount,
                    userID: _id,
                    giftName: gift === null || gift === void 0 ? void 0 : gift.giftName,
                });
                if ((gift === null || gift === void 0 ? void 0 : gift.giftPrice) === amount) {
                    const update = yield giftModel_1.default.findByIdAndUpdate(gift === null || gift === void 0 ? void 0 : gift._id, {
                        bought: true,
                    }, { new: true });
                    if (update === null || update === void 0 ? void 0 : update.userID) {
                        const gifted = yield userModel_1.default.findById(update === null || update === void 0 ? void 0 : update.userID);
                        yield userModel_1.default.findByIdAndUpdate(update === null || update === void 0 ? void 0 : update.userID, {
                            wallet: amount + (gifted === null || gifted === void 0 ? void 0 : gifted.wallet),
                        }, { new: true });
                        gifted === null || gifted === void 0 ? void 0 : gifted.history.push(new mongoose_1.default.Types.ObjectId(history === null || history === void 0 ? void 0 : history._id));
                        gifted === null || gifted === void 0 ? void 0 : gifted.save();
                    }
                    const updates = yield userModel_1.default.findByIdAndUpdate(giftUser === null || giftUser === void 0 ? void 0 : giftUser._id, {
                        wallet: (giftUser === null || giftUser === void 0 ? void 0 : giftUser.wallet) - amount,
                    }, { new: true });
                    if (updates) {
                        giftUser === null || giftUser === void 0 ? void 0 : giftUser.history.push(new mongoose_1.default.Types.ObjectId(history === null || history === void 0 ? void 0 : history._id));
                        giftUser === null || giftUser === void 0 ? void 0 : giftUser.save();
                        return res.status(errorSet_1.RESPONSE.UPDATED).json({
                            message: `Updated History`,
                            data: history,
                        });
                    }
                    else {
                        return res.status(errorSet_1.RESPONSE.NOT_AUTHORIZED).json({
                            message: "This cannot happen",
                        });
                    }
                    // giftUser.gift.push(new mongoose.Types.ObjectId(gift?._id));
                    // giftUser?.save();
                }
                else {
                    return res.status(errorSet_1.RESPONSE.NOT_AUTHORIZED).json({
                        message: `Please input the correct price tag`,
                    });
                }
            }
            else {
                return res.status(errorSet_1.RESPONSE.NOT_AUTHORIZED).json({
                    message: `This gift card is already purchased or it's yours`,
                });
            }
        }
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: "error buying gift card",
            data: error.message,
        });
    }
});
exports.buyGiftCard = buyGiftCard;
const populateHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const historyPopulate = yield userModel_1.default.findById(_id).populate({
            path: "history",
            options: {
                sort: { createdAt: -1 },
            },
        });
        return res.status(errorSet_1.RESPONSE.OK).json({
            message: "Populating History",
            data: historyPopulate,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: `error populating history`,
            data: error.message,
        });
    }
});
exports.populateHistory = populateHistory;
const viewAllHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield historyModel_1.default.find();
        return res.status(errorSet_1.RESPONSE.OK).json({
            message: `Viewing all history`,
            data: all,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: "error viewing all history",
            data: error.message,
        });
    }
});
exports.viewAllHistory = viewAllHistory;
const deleteGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { giftID, _id } = req.params;
        const gift = yield giftModel_1.default.findById(giftID);
        const giftUser = yield userModel_1.default.findById(_id);
        if (giftUser) {
            (_a = giftUser === null || giftUser === void 0 ? void 0 : giftUser.gift) === null || _a === void 0 ? void 0 : _a.pull(new mongoose_1.default.Types.ObjectId(giftID));
            giftUser === null || giftUser === void 0 ? void 0 : giftUser.save();
            yield giftModel_1.default.findByIdAndDelete(giftID);
        }
        return res.status(errorSet_1.RESPONSE.DELETE).json({
            message: `Deleted`,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: "error deleting gift card",
            data: error.message,
        });
    }
});
exports.deleteGiftCard = deleteGiftCard;
const deleteHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { historyID, _id } = req.params;
        yield historyModel_1.default.findById(historyID);
        const giftUser = yield userModel_1.default.findById(_id);
        if (giftUser) {
            giftUser.history.pull(new mongoose_1.default.Types.ObjectId(historyID));
            giftUser === null || giftUser === void 0 ? void 0 : giftUser.save();
            yield historyModel_1.default.findByIdAndDelete(historyID);
        }
        return res.status(errorSet_1.RESPONSE.DELETE).json({
            message: `1 Gift Card from History Deleted`,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: "error deleting history",
            data: error.message,
        });
    }
});
exports.deleteHistory = deleteHistory;
