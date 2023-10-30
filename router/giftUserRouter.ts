import express from "express";
import {
  deleteGiftUser,
  enterOTPGiftUser,
  registerGiftUser,
  signInGiftUser,
  verifiedGiftUser,
  viewAllGiftUsers,
  viewOneGiftUser,
} from "../controller/giftUserController";

const router = express.Router();

router.route(`/register`).post(registerGiftUser);
router.route(`/:token/first-process`).post(enterOTPGiftUser);
router.route(`/:token/verified`).get(verifiedGiftUser);
router.route(`/sign-in`).post(signInGiftUser);
router.route("/:_id/one").get(viewOneGiftUser);
router.route("/all").get(viewAllGiftUsers);
router.route("/:_id").delete(deleteGiftUser);

export default router;
