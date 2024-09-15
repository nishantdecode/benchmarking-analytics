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
    costIncome: {
      income: {
        type: Number,
      },
      incomeAdjusted: {
        type: Number,
      },
      roa: {
        type: Number,
      },
      roe: {
        type: Number,
      },
      roRwa: {
        type: Number,
      },
      nim: {
        type: Number,
      },
      cofDeposits: {
        type: Number,
      },
      profitMarginRevenues: {
        type: Number,
      },
      costsRevenues: {
        type: Number,
      },
      provisionsRevenues: {
        type: Number,
      },
      totalExpensesRevenues: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const CostIncomeKeyRatio = mongoose.model("CostIncomeKeyRatio", schema);

module.exports.CostIncomeKeyRatio = CostIncomeKeyRatio;
