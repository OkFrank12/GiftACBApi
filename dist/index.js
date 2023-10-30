"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConnect_1 = require("./config/dbConnect");
const appConnect_1 = require("./appConnect");
const envConfig_1 = require("./config/envConfig");
const port = parseInt(envConfig_1.environment.PORT);
const app = (0, express_1.default)();
(0, appConnect_1.myApp)(app);
const server = app.listen(envConfig_1.environment.PORT || port, () => {
    (0, dbConnect_1.dbConfig)();
});
process.on("uncaughtException", (error) => {
    console.log(`uncaughtException: `, error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log("unhandledRejection: ", reason);
    server.close(() => {
        process.exit(1);
    });
});
