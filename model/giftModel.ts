import mongoose from "mongoose";

interface iGift {
  giftName: string;
  giftPrice: number;
  giftTerms: string;
  userID: string;
  user: {};
  bought: boolean;
  imageID: string;
  image: string;
}

interface iGiftData extends iGift, mongoose.Document {}

const giftModel = new mongoose.Schema<iGiftData>(
  {
    giftName: {
      type: String,
      required: [true, "Gift Name is required"],
    },
    giftPrice: {
      type: Number,
      required: true,
    },
    giftTerms: {
      type: String,
      required: [true, "Gift Terms is required"],
    },
    image: {
      type: String,
      // required: true,
    },
    imageID: {
      type: String,
      // required: true,
    },
    userID: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "gift-users",
    },
    bought: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<iGiftData>("gifts", giftModel);
