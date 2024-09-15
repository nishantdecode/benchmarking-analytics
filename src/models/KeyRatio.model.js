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
    cor: {
      type: Number,
    },
    nplCoverage: {
      type: Number,
    },
    npl: {
      type: Number,
    },
    allowance: {
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
    staffExpenses_of_TotalExpenses: {
      type: Number,
    },
    nonStaffExpenses: {
      type: Number,
    },
    provisions_of_totalExpenses: {
      type: Number,
    },
    retailNplCoverage: {
      type: Number,
    },
    corporate_and_others_nplCoverage: {
      type: Number,
    },
    retailNpl: {
      type: Number,
    },
    corporateNpl: {
      type: Number,
    },
    nyiIncome_operatingIncome: {
      type: Number,
    },
    nyiIncome_operatingExpenses: {
      type: Number,
    },
    nyiIncome_totalAssets: {
      type: Number,
    },
    operatingExpenses_totalAssets: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const KeyRatio = mongoose.model("KeyRatio", schema);

module.exports.KeyRatio = KeyRatio;
