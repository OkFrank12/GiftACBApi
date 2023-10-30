import mongoose from "mongoose";

interface iUser {
  userName: string;
  email: string;
  password: string;
  token: string;
  verified: boolean;
  otp: string;
  wallet: number;
  gift: {}[];
  history: {}[];
}

interface iUserData extends iUser, mongoose.Document {}

const userModel = new mongoose.Schema<iUserData>(
  {
    userName: {
      type: String,
      required: [true, "UserName Credentials is a must"],
    },
    email: {
      type: String,
      required: [true, "Email Credentials is a must"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    otp: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    wallet: {
      type: Number,
    },
    gift: [
      {
        type: mongoose.Types.ObjectId,
        ref: "gifts",
      },
    ],
    history: [
      {
        type: mongoose.Types.ObjectId,
        ref: "historys",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<iUserData>("gift-users", userModel);
