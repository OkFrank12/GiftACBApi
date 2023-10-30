"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const giftModel = new mongoose_1.default.Schema({
    giftName: {
        type: String,
        required: [true, "Gift Name is required"],
    },
    giftPrice: {
        type: Number,
        required: true,
    },
    giftTerms: {
        type: String,
        required: [true, "Gift Terms is required"],
    },
    image: {
        type: String,
        // required: true,
    },
    imageID: {
        type: String,
        // required: true,
    },
    userID: {
        type: String,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "gift-users",
    },
    bought: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("gifts", giftModel);
