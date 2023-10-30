import express, { Request, Response } from "express";
import { RESPONSE } from "../error/errorSet";
import giftModel from "../model/giftModel";
import userModel from "../model/userModel";
import mongoose from "mongoose";
import historyModel from "../model/historyModel";
import { streamUpload } from "../utils/streamUpload";

export const createGiftCard = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { giftName, giftPrice, giftTerms } = req.body;
    const { _id } = req.params;
    // const { secure_url, public_id }: any = await streamUpload(req);
    const giftUser: any = await userModel.findById(_id);
    const gifted: any = await giftModel.create({
      giftName,
      giftPrice,
      giftTerms,
      userID: _id,
      // image: secure_url,
      // imageID: public_id,
    });

    if (giftUser) {
      giftUser?.gift.push(new mongoose.Types.ObjectId(gifted?._id));
      giftUser?.save();

      return res.status(RESPONSE.CREATED).json({
        message: `Successfully created gift card`,
        data: gifted,
      });
    } else {
      return res.status(RESPONSE.NOT_AUTHORIZED).json({
        message: `You can do this!!!`,
      });
    }
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: "error buying giftcards",
      data: error.message,
    });
  }
};

export const populateGiftCard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    const gifted = await userModel.findById(_id).populate({
      path: "gift",
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.status(RESPONSE.OK).json({
      message: `Gifts Populated`,
      data: gifted,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: "error populating gift cards",
      data: error.message,
    });
  }
};

export const allGiftCards = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const allGiftCard = await giftModel.find().sort({
      createdAt: -1,
    });

    return res.status(RESPONSE.OK).json({
      message: "allGiftCard successfully viewed",
      data: allGiftCard,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: `error viewing all gift cards`,
      data: error.message,
    });
  }
};

export const oneGiftCard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { giftID } = req.params;
    const oneGift = await giftModel.findById(giftID);

    return res.status(RESPONSE.OK).json({
      message: "oneGift successfully viewed",
      data: oneGift,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: `error viewing one gift card`,
      data: error.message,
    });
  }
};

export const buyGiftCard = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const { _id, giftID } = req.params;
    const giftUser = await userModel.findById(_id);
    const gift = await giftModel.findById(giftID);
    if (giftUser?.wallet! < amount) {
      return res.status(RESPONSE.NOT_AUTHORIZED).json({
        message: `You can not purchase`,
      });
    } else {
      if (gift?.bought !== true) {
        const history = await historyModel.create({
          amount,
          userID: _id,
          giftName: gift?.giftName,
        });

        if (gift?.giftPrice === amount) {
          const update = await giftModel.findByIdAndUpdate(
            gift?._id,
            {
              bought: true,
            },
            { new: true }
          );

          if (update?.userID) {
            const gifted = await userModel.findById(update?.userID);
            await userModel.findByIdAndUpdate(
              update?.userID,
              {
                wallet: amount + gifted?.wallet,
              },
              { new: true }
            );

            gifted?.history.push(new mongoose.Types.ObjectId(history?._id));
            gifted?.save();
          }

          const updates = await userModel.findByIdAndUpdate(
            giftUser?._id,
            {
              wallet: giftUser?.wallet! - amount,
            },
            { new: true }
          );

          if (updates) {
            giftUser?.history.push(new mongoose.Types.ObjectId(history?._id));
            giftUser?.save();

            return res.status(RESPONSE.UPDATED).json({
              message: `Updated History`,
              data: history,
            });
          } else {
            return res.status(RESPONSE.NOT_AUTHORIZED).json({
              message: "This cannot happen",
            });
          }

          // giftUser.gift.push(new mongoose.Types.ObjectId(gift?._id));
          // giftUser?.save();
        } else {
          return res.status(RESPONSE.NOT_AUTHORIZED).json({
            message: `Please input the correct price tag`,
          });
        }
      } else {
        return res.status(RESPONSE.NOT_AUTHORIZED).json({
          message: `This gift card is already purchased or it's yours`,
        });
      }
    }
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: "error buying gift card",
      data: error.message,
    });
  }
};

export const populateHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;
    const historyPopulate = await userModel.findById(_id).populate({
      path: "history",
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.status(RESPONSE.OK).json({
      message: "Populating History",
      data: historyPopulate,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: `error populating history`,
      data: error.message,
    });
  }
};

export const viewAllHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const all = await historyModel.find();

    return res.status(RESPONSE.OK).json({
      message: `Viewing all history`,
      data: all,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: "error viewing all history",
      data: error.message,
    });
  }
};

export const deleteGiftCard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { giftID, _id } = req.params;
    const gift = await giftModel.findById(giftID);
    const giftUser: any = await userModel.findById(_id);

    if (giftUser) {
      giftUser?.gift?.pull(new mongoose.Types.ObjectId(giftID));
      giftUser?.save();

      await giftModel.findByIdAndDelete(giftID);
    }

    return res.status(RESPONSE.DELETE).json({
      message: `Deleted`,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: "error deleting gift card",
      data: error.message,
    });
  }
};

export const deleteHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { historyID, _id } = req.params;
    await historyModel.findById(historyID);
    const giftUser: any = await userModel.findById(_id);

    if (giftUser) {
      giftUser.history.pull(new mongoose.Types.ObjectId(historyID));
      giftUser?.save();

      await historyModel.findByIdAndDelete(historyID);
    }

    return res.status(RESPONSE.DELETE).json({
      message: `1 Gift Card from History Deleted`,
    });
  } catch (error: any) {
    return res.status(RESPONSE.NOT_FULLFILLED).json({
      message: "error deleting history",
      data: error.message,
    });
  }
};
