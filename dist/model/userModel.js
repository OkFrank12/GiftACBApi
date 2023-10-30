"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: [true, "UserName Credentials is a must"],
    },
    email: {
        type: String,
        required: [true, "Email Credentials is a must"],
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    otp: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    wallet: {
        type: Number,
    },
    gift: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "gifts",
        },
    ],
    history: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "historys",
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("gift-users", userModel);
