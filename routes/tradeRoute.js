import express from "express";
import {
  closedTrade,
  createTrade,
  getAllTrade,
  getTradeByCategory,
  updateTrade,
} from "../controllers/tradeController.js";

const tradeRouter = express.Router();

tradeRouter.get("/get-trade", getAllTrade);
tradeRouter.get("/get-trade/:category", getTradeByCategory);
tradeRouter.post("/create-trade", createTrade);
tradeRouter.patch("/update-trade" ,updateTrade);
tradeRouter.patch("/closed-trade/:id" , closedTrade);

export default tradeRouter;
