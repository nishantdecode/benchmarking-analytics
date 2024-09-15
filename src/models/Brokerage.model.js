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
    brokerage: {
      brokerageFirms: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Brokerage = mongoose.model("Brokerage", schema);

module.exports.Brokerage = Brokerage;
