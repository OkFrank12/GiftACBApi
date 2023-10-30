"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const giftUserController_1 = require("../controller/giftUserController");
const router = express_1.default.Router();
router.route(`/register`).post(giftUserController_1.registerGiftUser);
router.route(`/:token/first-process`).post(giftUserController_1.enterOTPGiftUser);
router.route(`/:token/verified`).get(giftUserController_1.verifiedGiftUser);
router.route(`/sign-in`).post(giftUserController_1.signInGiftUser);
router.route("/:_id/one").get(giftUserController_1.viewOneGiftUser);
router.route("/all").get(giftUserController_1.viewAllGiftUsers);
router.route("/:_id").delete(giftUserController_1.deleteGiftUser);
exports.default = router;
