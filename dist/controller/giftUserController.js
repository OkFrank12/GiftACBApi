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
exports.deleteGiftUser = exports.viewAllGiftUsers = exports.viewOneGiftUser = exports.signInGiftUser = exports.verifiedGiftUser = exports.enterOTPGiftUser = exports.registerGiftUser = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const errorSet_1 = require("../error/errorSet");
const envConfig_1 = require("../config/envConfig");
const email_1 = require("../utils/email");
const registerGiftUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const salted = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salted);
        const cryptoVal = crypto_1.default.randomBytes(10).toString("hex");
        const token = jsonwebtoken_1.default.sign(cryptoVal, envConfig_1.environment.TOKEN_SECRET);
        const otp = crypto_1.default.randomBytes(3).toString("hex");
        const giftUser = yield userModel_1.default.create({
            userName,
            email,
            password: hashed,
            token,
            otp,
            wallet: 200,
        });
        (0, email_1.sendInitialMail)(giftUser).then(() => {
            console.log(`OTP Mail sent...!`);
        });
        return res.status(errorSet_1.RESPONSE.CREATED).json({
            message: `Registering Gift User`,
            data: giftUser,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: `Error registering gift user`,
            data: error.message,
        });
    }
});
exports.registerGiftUser = registerGiftUser;
const enterOTPGiftUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        const { token } = req.params;
        jsonwebtoken_1.default.verify(token, envConfig_1.environment.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (payload) {
                const giftUser = yield userModel_1.default.findById(payload.id);
                if ((giftUser === null || giftUser === void 0 ? void 0 : giftUser.otp) === otp) {
                    (0, email_1.sendLastMail)(giftUser).then(() => {
                        console.log(`Verification Mail sent...!`);
                    });
                    return res.status(errorSet_1.RESPONSE.OK).json({
                        message: `Please go and verify`,
                        data: giftUser,
                    });
                }
                else {
                    return res.status(errorSet_1.RESPONSE.NOT_AUTHORIZED).json({
                        message: `OTP Error`,
                    });
                }
            }
            else {
                return err;
            }
        }));
        return res;
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: "error entering OTP",
            data: error.message,
        });
    }
});
exports.enterOTPGiftUser = enterOTPGiftUser;
const verifiedGiftUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        jsonwebtoken_1.default.verify(token, envConfig_1.environment.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error();
            }
            else {
                const giftUser = yield userModel_1.default.findById(payload.id);
                if (giftUser) {
                    yield userModel_1.default.findByIdAndUpdate(giftUser === null || giftUser === void 0 ? void 0 : giftUser._id, {
                        verified: true,
                        token: "",
                    }, { new: true });
                    return res.status(errorSet_1.RESPONSE.OK).json({
                        message: `Verified Successfully`,
                    });
                }
                else {
                    return res.status(errorSet_1.RESPONSE.NOT_AUTHORIZED).json({
                        message: `You are not authorized for this: Token Err`,
                    });
                }
            }
        }));
        return res;
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: `Error verifying gift user`,
            data: error.message,
        });
    }
});
exports.verifiedGiftUser = verifiedGiftUser;
const signInGiftUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const giftUser = yield userModel_1.default.findOne({ email });
        if (giftUser) {
            const checkPassword = yield bcrypt_1.default.compare(password, giftUser.password);
            if (checkPassword) {
                const token = jsonwebtoken_1.default.sign({ id: giftUser === null || giftUser === void 0 ? void 0 : giftUser._id }, envConfig_1.environment.TOKEN_SECRET);
                if ((giftUser === null || giftUser === void 0 ? void 0 : giftUser.verified) && giftUser.token === "") {
                    return res.status(errorSet_1.RESPONSE.OK).json({
                        message: `Welcome ${giftUser === null || giftUser === void 0 ? void 0 : giftUser.userName}`,
                        data: token,
                    });
                }
                else {
                    return res.status(errorSet_1.RESPONSE.NOT_VERIFIED).json({
                        message: `You have not been verified`,
                    });
                }
            }
            else {
                return res.status(errorSet_1.RESPONSE.NOT_AUTHORIZED).json({
                    message: `Your Password is not valid`,
                });
            }
        }
        else {
            return res.status(errorSet_1.RESPONSE.NOT_FOUND).json({
                message: `Email is not found`,
            });
        }
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: `error signing in gift user`,
            data: error.message,
        });
    }
});
exports.signInGiftUser = signInGiftUser;
const viewOneGiftUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const one = yield userModel_1.default.findById(_id);
        return res.status(errorSet_1.RESPONSE.OK).json({
            message: `Viewing one gift user`,
            data: one,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: `error viewing one gift user`,
            data: error.message,
        });
    }
});
exports.viewOneGiftUser = viewOneGiftUser;
const viewAllGiftUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield userModel_1.default.find();
        return res.status(errorSet_1.RESPONSE.OK).json({
            message: `successfully viewed all gift users`,
            data: all,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: "error viewing all gift users",
            data: error.message,
        });
    }
});
exports.viewAllGiftUsers = viewAllGiftUsers;
const deleteGiftUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const giftUser = yield userModel_1.default.findByIdAndDelete(_id);
        return res.status(errorSet_1.RESPONSE.DELETE).json({
            message: `Deleted ${giftUser === null || giftUser === void 0 ? void 0 : giftUser.userName}`,
        });
    }
    catch (error) {
        return res.status(errorSet_1.RESPONSE.NOT_FULLFILLED).json({
            message: "error deleting gift user",
            data: error.message,
        });
    }
});
exports.deleteGiftUser = deleteGiftUser;
