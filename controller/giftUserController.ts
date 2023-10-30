import userModel from "../model/userModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { RESPONSE } from "../error/errorSet";
import { environment } from "../config/envConfig";
import { sendInitialMail, sendLastMail } from "../utils/email";

export const registerGiftUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userName, email, password } = req.body;
    const salted = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salted);
    const cryptoVal = crypto.randomBytes(10).toString("hex");
    const token = jwt.sign(cryptoVal, environment.TOKEN_SECRET);
    const otp = crypto.randomBytes(3).toString("hex");
    const giftUser = await userModel.create({
      userName,
      email,
      password: hashed,
      token,
      otp,
      wallet: 200,
    });

    sendInitialMail(giftUser).then(() => {
      console.log(`OTP Mail sent...!`);
    });

    return res.status(RESPONSE.CREATED).json({
      message: `Registering Gift User`,
      data: giftUser,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: `Error registering gift user`,
      data: error.message,
    });
  }
};

export const enterOTPGiftUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { otp } = req.body;
    const { token } = req.params;

    jwt.verify(token, environment.TOKEN_SECRET, async (err, payload: any) => {
      if (payload) {
        const giftUser = await userModel.findById(payload.id);

        if (giftUser?.otp === otp) {
          sendLastMail(giftUser).then(() => {
            console.log(`Verification Mail sent...!`);
          });

          return res.status(RESPONSE.OK).json({
            message: `Please go and verify`,
            data: giftUser,
          });
        } else {
          return res.status(RESPONSE.NOT_AUTHORIZED).json({
            message: `OTP Error`,
          });
        }
      } else {
        return err;
      }
    });

    return res;
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: "error entering OTP",
      data: error.message,
    });
  }
};

export const verifiedGiftUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.params;
    jwt.verify(token, environment.TOKEN_SECRET, async (err, payload: any) => {
      if (err) {
        throw new Error();
      } else {
        const giftUser = await userModel.findById(payload.id);

        if (giftUser) {
          await userModel.findByIdAndUpdate(
            giftUser?._id,
            {
              verified: true,
              token: "",
            },
            { new: true }
          );

          return res.status(RESPONSE.OK).json({
            message: `Verified Successfully`,
          });
        } else {
          return res.status(RESPONSE.NOT_AUTHORIZED).json({
            message: `You are not authorized for this: Token Err`,
          });
        }
      }
    });

    return res;
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: `Error verifying gift user`,
      data: error.message,
    });
  }
};

export const signInGiftUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const giftUser = await userModel.findOne({ email });
    if (giftUser) {
      const checkPassword = await bcrypt.compare(password, giftUser.password);
      if (checkPassword) {
        const token = jwt.sign({ id: giftUser?._id }, environment.TOKEN_SECRET);
        if (giftUser?.verified && giftUser.token === "") {
          return res.status(RESPONSE.OK).json({
            message: `Welcome ${giftUser?.userName}`,
            data: token,
          });
        } else {
          return res.status(RESPONSE.NOT_VERIFIED).json({
            message: `You have not been verified`,
          });
        }
      } else {
        return res.status(RESPONSE.NOT_AUTHORIZED).json({
          message: `Your Password is not valid`,
        });
      }
    } else {
      return res.status(RESPONSE.NOT_FOUND).json({
        message: `Email is not found`,
      });
    }
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: `error signing in gift user`,
      data: error.message,
    });
  }
};

export const viewOneGiftUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    const one = await userModel.findById(_id);

    return res.status(RESPONSE.OK).json({
      message: `Viewing one gift user`,
      data: one,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: `error viewing one gift user`,
      data: error.message,
    });
  }
};

export const viewAllGiftUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const all = await userModel.find();

    return res.status(RESPONSE.OK).json({
      message: `successfully viewed all gift users`,
      data: all,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: "error viewing all gift users",
      data: error.message,
    });
  }
};

export const deleteGiftUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    const giftUser = await userModel.findByIdAndDelete(_id);

    return res.status(RESPONSE.DELETE).json({
      message: `Deleted ${giftUser?.userName}`,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: "error deleting gift user",
      data: error.message,
    });
  }
};
