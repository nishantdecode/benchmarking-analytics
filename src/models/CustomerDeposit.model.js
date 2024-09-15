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
    customerDeposit: {
      demandDeposits: {
        type: Number,
      },
      customerTimeInvestment: {
        type: Number,
      },
      customerSavings: {
        type: Number,
      },
      otherDeposits: {
        type: Number,
      },
      totalDeposits: {
        type: Number,
      },
      totalNonCommissionDeposits: {
        type: Number,
      },
      timeSavingsDeposits: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const CustomerDeposit = mongoose.model("CustomerDeposit", schema);

module.exports.CustomerDeposit = CustomerDeposit;
