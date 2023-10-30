"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorConfig = void 0;
const errorSet_1 = require("./errorSet");
const errorRender = (err, res) => {
    return res.status(errorSet_1.RESPONSE.NOT_FOUND).json({
        name: err.name,
        message: err.message,
        status: err.status,
        success: err.success,
        stack: err.stack,
        err,
    });
};
const errorConfig = (err, req, res, next) => {
    errorRender(err, res);
};
exports.errorConfig = errorConfig;
