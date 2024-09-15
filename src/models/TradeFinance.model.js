const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
    meta: {
      interval: {
        type: String,
        enum: ["QUARTERLY", "YEARLY"],
      },
      label: {
        type: String,
      },
      date: {
        type: Date,
      },
    },
    tradeFinance: {
      LCs: {
        type: Number,
      },
      LGs: {
        type: Number,
      },
      totalTradeFinance: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const TradeFinance = mongoose.model("TradeFinance", schema);

module.exports.TradeFinance = TradeFinance;
