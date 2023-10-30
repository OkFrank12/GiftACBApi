import express from "express";
import {
  allGiftCards,
  buyGiftCard,
  createGiftCard,
  deleteGiftCard,
  deleteHistory,
  oneGiftCard,
  populateGiftCard,
  populateHistory,
  viewAllHistory,
} from "../controller/giftController";
import multer from "multer";

const gift = express.Router();
const upload = multer().single("image");

gift.route(`/:_id/create-gift`).post(createGiftCard);
gift.route(`/:_id/populate`).get(populateGiftCard);
gift.route(`/all-gift`).get(allGiftCards);
gift.route(`/:giftID/one-gift`).get(oneGiftCard);
gift.route(`/:giftID/:_id/delete`).delete(deleteGiftCard);
gift.route(`/:_id/:giftID/buy-gift`).post(buyGiftCard);
gift.route(`/:_id/populate-history`).get(populateHistory);
gift.route(`/all-history`).get(viewAllHistory);
gift.route(`/:historyID/:_id/history`).delete(deleteHistory);

export default gift;
