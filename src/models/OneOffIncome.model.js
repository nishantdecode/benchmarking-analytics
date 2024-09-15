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
    oneOffIncome: {
      nonTradingGains: {
        type: Number,
      },
      otherGains: {
        type: Number,
      },
      adjustedIncome: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const OneOffIncome = mongoose.model("OneOffIncome", schema);

module.exports.OneOffIncome = OneOffIncome;
