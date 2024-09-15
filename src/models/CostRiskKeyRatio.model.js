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
    timeSaving: {
      nplCoverage: {
        type: Number,
      },
      npl: {
        type: Number,
      },
      allowance: {
        type: Number,
      },
      ld: {
        type: Number,
      },
      lSama: {
        type: Number,
      },
      currentAccounts: {
        type: Number,
      },
      nonCommissionBearingDeposits: {
        type: Number,
      },
      time_and_savings: {
        type: Number,
      },
    },
    otherIncomeRevenues: {
      nyiRevenues: {
        type: Number,
      },
      fees_of_revenues: {
        type: Number,
      },
      fxRevenues: {
        type: Number,
      },
      otherIncomeRevenues: {
        type: Number,
      },
    },
    provisions: {
      staffExpenses_of_TotalExpenses: {
        type: Number,
      },
      nonStaffExpenses: {
        type: Number,
      },
      provisions_of_totalExpenses: {
        type: Number,
      },
    },
    loan: {
      retailNplCoverage: {
        type: Number,
      },
      coroprate_and_others_nplCoverage: {
        type: Number,
      },
      retailNpl: {
        type: Number,
      },
      coroprateNpl: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const CostRiskKeyRatio = mongoose.model("CostRiskKeyRatio", schema);

module.exports.CostRiskKeyRatio = CostRiskKeyRatio;
