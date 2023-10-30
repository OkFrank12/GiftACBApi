import mongoose from "mongoose";

interface iHistory {
  gift: {};
  userID: String;
  user: {};
  amount: number;
}

interface iHistoryData extends iHistory, mongoose.Document {}

const historyModel = new mongoose.Schema<iHistoryData>(
  {
    gift: {
      type: mongoose.Types.ObjectId,
      ref: "gifts",
    },
    userID: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "gift-users",
    },
    amount: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model<iHistoryData>("historys", historyModel);
