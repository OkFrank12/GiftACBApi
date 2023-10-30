"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const historyModel = new mongoose_1.default.Schema({
    gift: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "gifts",
    },
    userID: {
        type: String,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "gift-users",
    },
    amount: {
        type: Number,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("historys", historyModel);
