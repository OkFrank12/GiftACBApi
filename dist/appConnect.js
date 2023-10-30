"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const errorSet_1 = require("./error/errorSet");
const errorConfig_1 = require("./error/errorConfig");
const giftUserRouter_1 = __importDefault(require("./router/giftUserRouter"));
const giftRouter_1 = __importDefault(require("./router/giftRouter"));
const myApp = (app) => {
    app.use(express_1.default.json()).use((0, cors_1.default)()).use((0, helmet_1.default)()).use((0, morgan_1.default)("dev"));
    app.set("view engine", "ejs");
    app.use(`/api`, giftUserRouter_1.default);
    app.use(`/api`, giftRouter_1.default);
    app.get("/", (req, res) => {
        try {
            return res.status(errorSet_1.RESPONSE.OK).json({
                message: "Default API hits",
            });
            // const optionData = {
            //   userName: `Franklin`,
            //   email: `cfoonyemmemme@gmail.com`,
            //   otp: "0as1",
            //   url: "https://mail.google.com",
            // };
            // return res.status(RESPONSE.OK).render("lastMail", optionData);
        }
        catch (error) {
            return res.status(errorSet_1.RESPONSE.NOT_FOUND).json({
                message: "error from default API Route",
                data: error.message,
            });
        }
    });
    app
        .all("*", (req, res, next) => {
        return new errorSet_1.errorSet({
            name: `Route Error`,
            message: `This is as a result of ${req.originalUrl} is not correct`,
            status: errorSet_1.RESPONSE.NOT_FOUND,
            success: false,
        });
    })
        .use(errorConfig_1.errorConfig);
};
exports.myApp = myApp;
