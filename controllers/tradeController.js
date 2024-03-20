import tradeModel from "../models/tradeModel.js";
import HttpError from "../models/errorModel.js";

export const createTrade = async (req, res, next) => {
  try {
    const { type, companyName, category, basePrice, target, stopLoss } =
      req.body;

    const currentPrice = basePrice;

    if (
      !type ||
      !companyName ||
      !category ||
      !basePrice ||
      !target ||
      !stopLoss
    ) {
      return next(new HttpError(`Please fill all fields`, 422));
    }

    if (type == "buy") {
      if (
        parseFloat(stopLoss) < parseFloat(basePrice) &&
        parseFloat(basePrice) < parseFloat(target)
      ) {
        const newTrade = new tradeModel({
          type,
          companyName,
          category,
          basePrice: parseFloat(basePrice),
          currentPrice: parseFloat(currentPrice),
          target: parseFloat(target),
          stopLoss: parseFloat(stopLoss),
        });

        const savedTrade = await newTrade.save();
        res.status(201).json(savedTrade);
      } else {
        return next(
          new HttpError(`In Buy stop loss should be less than limit price`, 422)
        );
      }
    } else if (type == "sell") {
      if (
        parseFloat(target) < parseFloat(basePrice) &&
        parseFloat(basePrice) < parseFloat(stopLoss)
      ) {
        const newTrade = new tradeModel({
          type,
          companyName,
          category,
          basePrice: parseFloat(basePrice),
          currentPrice: parseFloat(currentPrice),
          target: parseFloat(target),
          stopLoss: parseFloat(stopLoss),
        });

        const savedTrade = await newTrade.save();
        res.status(201).json(savedTrade);
      } else {
        return next(
          new HttpError(`In Sell stop loss is greater than base price`, 422)
        );
      }
    }
  } catch (error) {
    return next(new HttpError(`Failed to create trade`, 500));
  }
};


// get all trade from the server
export const getAllTrade = async (req, res) => {
  try {
    const response = await tradeModel.find();
    if (!response) {
      return res.status(404).json("Data not found");
    }

    res.status(200).json(response);
  } catch (error) {
    return next(new HttpError(`Failed to get all the fileds`, 500));
  }
};


// it will filter the trade and send it to the frontend
export const getTradeByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;

    if (!category) {
      return next(new HttpError(`Category is not defind`, 422));
    }

    const response = await tradeModel.find({ category: category });

    if (!response) {
      return next(new HttpError(`Posts not found`, 404));
    }

    res.status(200).json(response);
  } catch (error) {
    return next(new HttpError(`Failed to get trade by category`, 500));
  }
};

export const updateTrade = async (req, res, next) => {
  try {
    const tradesToUpdate = req.body.trades;

    const updatedTrades = await Promise.all(
      tradesToUpdate.map(async (trade) => {
        const { _id, type, stopLoss, basePrice, target, currentPrice } = trade;

        if (type === "buy") {
          if (
            parseFloat(stopLoss) < parseFloat(basePrice) &&
            parseFloat(basePrice) < parseFloat(target)
          ) {
            const updatedTrade = await tradeModel.findByIdAndUpdate(
              _id,
              { stopLoss, basePrice, target, currentPrice },
              { new: true }
            );

            return updatedTrade;
          } else {
            new HttpError(
              `In Buy stop loss should be less than limit price`,
              422
            );
          }
        } else {
          if (
            parseFloat(target) < parseFloat(basePrice) &&
            parseFloat(basePrice) < parseFloat(stopLoss)
          ) {
            const updatedTrade = await tradeModel.findByIdAndUpdate(
              _id,
              { stopLoss, basePrice, target, currentPrice },
              { new: true }
            );

            return updatedTrade;
          } else {
            return next(
              new HttpError(`In Sell stop loss is greater than base price`, 422)
            );
          }
        }
      })
    );

    res.status(200).json(updatedTrades);
  } catch (error) {
    return next(new HttpError(`Failed to update the trades`, 500));
  }
};

export const closedTrade = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return next(new HttpError(`id is not present`, 422));
    }

    const { status } = req.body;

    const response = await tradeModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json("trade closed");
  } catch (error) {
    return next(new HttpError(`Failed to closed the trades`, 500));
  }
};
