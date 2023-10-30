import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import { environment } from "../config/envConfig";

const G_ID: string = environment.G_ID;
const G_SECRET: string = environment.G_SECRET;
const G_REFRESH: string = environment.G_REFRESH;
const G_URL: string = environment.G_URL;

const oAuth = new google.auth.OAuth2(G_ID, G_SECRET, G_URL);
oAuth.setCredentials({ access_token: G_REFRESH });

export const sendInitialMail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "cfoonyemmemme@gmail.com",
        clientId: G_ID,
        clientSecret: G_SECRET,
        refreshToken: G_REFRESH,
        accessToken,
      },
    });

    const token = jwt.sign({ id: user?._id }, environment.TOKEN_SECRET);

    const passedData = {
      userName: user?.userName,
      email: user?.email,
      otp: user?.otp,
      url: `http://localhost:5173/register/${token}/first-process`,
    };

    const findFile = path.join(__dirname, "../views/firstMail.ejs");
    const readFile = await ejs.renderFile(findFile, passedData);

    const mailer = {
      from: "GiftACB <cfoonyemmemme@gmail.com>",
      to: user?.email,
      subject: `OTP Grant`,
      html: readFile,
    };

    transporter.sendMail(mailer);
  } catch (error: any) {
    console.log(error);
  }
};

export const sendLastMail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "cfoonyemmemme@gmail.com",
        clientId: G_ID,
        clientSecret: G_SECRET,
        refreshToken: G_REFRESH,
        accessToken,
      },
    });

    const token = jwt.sign({ id: user?._id }, environment.TOKEN_SECRET);

    const passedData = {
      userName: user?.userName,
      email: user?.email,
      otp: user?.otp,
      url: `http://localhost:5173/register/${token}/verified`,
    };

    const findFile = path.join(__dirname, "../views/LastMail.ejs");
    const readFile = await ejs.renderFile(findFile, passedData);

    const mailer = {
      from: "GiftACB <cfoonyemmemme@gmail.com>",
      to: user?.email,
      subject: `Verification Grant`,
      html: readFile,
    };

    transporter.sendMail(mailer);
  } catch (error: any) {
    console.log(error);
  }
};
