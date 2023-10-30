"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const envConfig_1 = require("./envConfig");
const connectURL = envConfig_1.environment.MONGO_CONNECT;
const dbConfig = () => {
    mongoose_1.default.connect(connectURL).then(() => {
        console.log(`${mongoose_1.default.connection.host} is ready to serve`);
    });
};
exports.dbConfig = dbConfig;
