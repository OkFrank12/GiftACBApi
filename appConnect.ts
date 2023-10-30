import express, { Request, Application, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { RESPONSE, errorSet } from "./error/errorSet";
import { errorConfig } from "./error/errorConfig";
import giftUser from "./router/giftUserRouter";
import gift from "./router/giftRouter";

export const myApp = (app: Application) => {
  app.use(express.json()).use(cors()).use(helmet()).use(morgan("dev"));
  app.set("view engine", "ejs");

  app.use(`/api`, giftUser);
  app.use(`/api`, gift);

  app.get("/", (req: Request, res: Response) => {
    try {
      return res.status(RESPONSE.OK).json({
        message: "Default API hits",
      });

      // const optionData = {
      //   userName: `Franklin`,
      //   email: `cfoonyemmemme@gmail.com`,
      //   otp: "0as1",
      //   url: "https://mail.google.com",
      // };

      // return res.status(RESPONSE.OK).render("lastMail", optionData);
    } catch (error: any) {
      return res.status(RESPONSE.NOT_FOUND).json({
        message: "error from default API Route",
        data: error.message,
      });
    }
  });

  app
    .all("*", (req: Request, res: Response, next: NextFunction) => {
      return new errorSet({
        name: `Route Error`,
        message: `This is as a result of ${req.originalUrl} is not correct`,
        status: RESPONSE.NOT_FOUND,
        success: false,
      });
    })
    .use(errorConfig);
};
