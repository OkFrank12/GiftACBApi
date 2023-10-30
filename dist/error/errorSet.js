"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorSet = exports.RESPONSE = void 0;
var RESPONSE;
(function (RESPONSE) {
    RESPONSE[RESPONSE["OK"] = 200] = "OK";
    RESPONSE[RESPONSE["CREATED"] = 201] = "CREATED";
    RESPONSE[RESPONSE["NOT_FOUND"] = 404] = "NOT_FOUND";
    RESPONSE[RESPONSE["NOT_FULLFILLED"] = 500] = "NOT_FULLFILLED";
    RESPONSE[RESPONSE["NOT_VERIFIED"] = 403] = "NOT_VERIFIED";
    RESPONSE[RESPONSE["NOT_AUTHORIZED"] = 401] = "NOT_AUTHORIZED";
    RESPONSE[RESPONSE["UPDATED"] = 200] = "UPDATED";
    RESPONSE[RESPONSE["DELETE"] = 202] = "DELETE";
})(RESPONSE || (exports.RESPONSE = RESPONSE = {}));
class errorSet extends Error {
    constructor(args) {
        super(args.message);
        this.success = false;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name;
        this.message = args.message;
        this.status = args.status;
        if (this.success !== undefined) {
            this.success = args.success;
        }
        Error.captureStackTrace(this);
    }
}
exports.errorSet = errorSet;
