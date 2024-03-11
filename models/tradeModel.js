import mongoose from "mongoose";

const TradeModel = mongoose.Schema({
  type: { type: String, required: true },
  companyName: { type: String, required: true },
  category: { type: String, required: true },
  basePrice: { type: Number, required: true },
  currentPrice: { type: Number },
  stopLoss: { type: Number, required: true },
  target: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {type: String  , default: "open"},
});

export default mongoose.model("TradeModel", TradeModel);
