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
    capitalAdequacy: {
      rwa: {
        type: Number,
      },
      tier1: {
        type: Number,
      },
      tier2: {
        type: Number,
      },
      sumOfTier: {
        type: Number,
      },
      tier1CAR: {
        type: Number,
      },
      sumOfTierCAR: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const CapitalAdequacy = mongoose.model("CapitalAdequacy", schema);

module.exports.CapitalAdequacy = CapitalAdequacy;
