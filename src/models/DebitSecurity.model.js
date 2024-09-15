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
    debitSecurity: {
      shortTermPortion: {
        type: Number,
      },
      longTermPortion: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const DebitSequrity = mongoose.model("DebitSequrity", schema);

module.exports.DebitSequrity = DebitSequrity;
