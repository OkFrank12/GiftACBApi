import { NextFunction, Request, Response } from "express";
import { RESPONSE, errorSet } from "./errorSet";

const errorRender = (err: errorSet, res: Response) => {
  return res.status(RESPONSE.NOT_FOUND).json({
    name: err.name,
    message: err.message,
    status: err.status,
    success: err.success,
    stack: err.stack,
    err,
  });
};

export const errorConfig = (
  err: errorSet,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorRender(err, res);
};
